use soroban_sdk::{Address, Env, Vec};

use crate::types::Group;

/// Returns `true` if `address` appears in the group's `members` list.
///
/// Performs a linear scan since Soroban's `Vec` does not support O(1) lookup.
/// For groups capped at 100 members this is acceptable.
///
/// # Arguments
/// * `members` - The ordered member list to search
/// * `address` - The address to look for
///
/// # Returns
/// `true` if the address is found in the members list, `false` otherwise
pub fn is_member(members: &Vec<Address>, address: &Address) -> bool {
    for member in members.iter() {
        if member == *address {
            return true;
        }
    }
    false
}

/// Returns `true` if every member of the group has contributed in the current cycle.
///
/// Iterates over all members and short-circuits on the first missing contribution.
/// This is called by [`execute_payout`](crate::contract::AjoContract::execute_payout)
/// to gate payout execution — a payout cannot proceed until this returns `true`.
///
/// # Arguments
/// * `env` - The contract environment (needed for storage reads)
/// * `group` - The group whose current cycle contributions are being verified
///
/// # Returns
/// `true` if all members have contributed, `false` otherwise
pub fn all_members_contributed(env: &Env, group: &Group) -> bool {
    for member in group.members.iter() {
        if !crate::storage::has_contributed(env, group.id, group.current_cycle, &member) {
            return false;
        }
    }
    true
}

/// Calculates the total payout amount for a single cycle.
///
/// The payout equals each member's fixed contribution multiplied by the total
/// number of members. This ensures the recipient receives the full pool of contributions.
///
/// # Arguments
/// * `group` - The group whose payout is being calculated
///
/// # Returns
/// Total payout in stroops (`contribution_amount × member_count`)
pub fn calculate_payout_amount(group: &Group) -> i128 {
    let member_count = group.members.len() as i128;
    group.contribution_amount * member_count
}

/// Returns the current ledger timestamp in seconds since Unix epoch.
///
/// Wraps `env.ledger().timestamp()` for testability and to provide a
/// single consistent source of time across the contract.
///
/// # Arguments
/// * `env` - The contract environment used to access the ledger
///
/// # Returns
/// Current Unix timestamp in seconds
pub fn get_current_timestamp(env: &Env) -> u64 {
    env.ledger().timestamp()
}

/// Validates that group creation parameters meet business rules.
///
/// Called at the start of [`create_group`](crate::contract::AjoContract::create_group)
/// before any state is written. All three parameters are validated together
/// so callers receive a specific error identifying which constraint failed.
///
/// # Arguments
/// * `amount` - Proposed contribution amount in stroops; must be > 0
/// * `duration` - Proposed cycle duration in seconds; must be > 0
/// * `max_members` - Proposed member cap; must be between 2 and 100 inclusive
///
/// # Returns
/// `Ok(())` if all parameters are valid
///
/// # Errors
/// * [`ContributionAmountZero`](crate::errors::AjoError::ContributionAmountZero) — if `amount == 0`
/// * [`ContributionAmountNegative`](crate::errors::AjoError::ContributionAmountNegative) — if `amount < 0`
/// * [`CycleDurationZero`](crate::errors::AjoError::CycleDurationZero) — if `duration == 0`
/// * [`MaxMembersBelowMinimum`](crate::errors::AjoError::MaxMembersBelowMinimum) — if `max_members < 2`
/// * [`MaxMembersAboveLimit`](crate::errors::AjoError::MaxMembersAboveLimit) — if `max_members > 100`
pub fn validate_group_params(
    amount: i128,
    duration: u64,
    max_members: u32,
) -> Result<(), crate::errors::AjoError> {
    const MAX_MEMBERS_LIMIT: u32 = 100;

    // Amounts must be positive

    // Amounts must be positive
    if amount == 0 {
        return Err(crate::errors::AjoError::ContributionAmountZero);
    } else if amount < 0 {
        return Err(crate::errors::AjoError::ContributionAmountNegative);
    }

    // Time stops for no one - especially not a zero duration esusu

    // Time stops for no one - especially not a zero duration esusu
    if duration == 0 {
        return Err(crate::errors::AjoError::CycleDurationZero);
    }

    // We need at least two people to rotate money

    // We need at least two people to rotate money
    if max_members < 2 {
        return Err(crate::errors::AjoError::MaxMembersBelowMinimum);
    }

    // Reasonable upper limit to prevent gas issues

    // Reasonable upper limit to prevent gas issues
    if max_members > MAX_MEMBERS_LIMIT {
        return Err(crate::errors::AjoError::MaxMembersAboveLimit);
    }

    Ok(())
}

/// Returns the start and end timestamps for the group's current cycle window.
///
/// The cycle window is `[cycle_start_time, cycle_start_time + cycle_duration)`.
/// This is a pure calculation that does not read the ledger clock.
///
/// # Arguments
/// * `group` - The group whose cycle window is being computed
/// * `_current_time` - Reserved for future use (e.g., dynamic window adjustment)
///
/// # Returns
/// A `(start, end)` tuple of Unix timestamps in seconds
pub fn get_cycle_window(group: &Group, _current_time: u64) -> (u64, u64) {
    let cycle_start = group.cycle_start_time;
    let cycle_end = cycle_start + group.cycle_duration;
    (cycle_start, cycle_end)
}

/// Returns `true` if `current_time` falls within the group's active cycle window.
///
/// The window is inclusive of `cycle_start_time` and exclusive of `cycle_end_time`
/// (`start <= current_time < end`). Once this returns `false`, the cycle has expired
/// and a payout can be triggered.
///
/// # Arguments
/// * `group` - The group whose cycle window is being checked
/// * `current_time` - The timestamp to evaluate, typically from [`get_current_timestamp`]
///
/// # Returns
/// `true` if current_time is within the cycle window, `false` otherwise
pub fn is_within_cycle_window(group: &Group, current_time: u64) -> bool {
    let (cycle_start, cycle_end) = get_cycle_window(group, current_time);
    current_time >= cycle_start && current_time < cycle_end
}

/// Returns `true` if `current_time` is within the grace period after cycle ends.
///
/// Grace period starts when the cycle ends and lasts for `group.grace_period` seconds.
/// During this time, members can still contribute but will incur penalties.
///
/// # Arguments
/// * `group` - The group whose grace period is being checked
/// * `current_time` - The timestamp to evaluate
///
/// # Returns
/// `true` if current_time is within the grace period, `false` otherwise
pub fn is_within_grace_period(group: &Group, current_time: u64) -> bool {
    let cycle_end = group.cycle_start_time + group.cycle_duration;
    let grace_end = cycle_end + group.grace_period;
    current_time >= cycle_end && current_time < grace_end
}

/// Returns the grace period end timestamp for the current cycle.
///
/// # Arguments
/// * `group` - The group whose grace period end is being calculated
///
/// # Returns
/// Unix timestamp when grace period ends
pub fn get_grace_period_end(group: &Group) -> u64 {
    group.cycle_start_time + group.cycle_duration + group.grace_period
}

/// Calculates the penalty amount for a late contribution.
///
/// Penalty = contribution_amount × (penalty_rate / 100)
/// For example, if contribution is 100 XLM and penalty_rate is 5,
/// the penalty is 5 XLM.
///
/// # Arguments
/// * `contribution_amount` - The base contribution amount
/// * `penalty_rate` - Penalty rate as percentage (0-100)
///
/// # Returns
/// Penalty amount in stroops
pub fn calculate_penalty(contribution_amount: i128, penalty_rate: u32) -> i128 {
    (contribution_amount * penalty_rate as i128) / 100
}

/// Checks if a contribution is late and calculates penalty if applicable.
///
/// Returns a tuple of (is_late, penalty_amount).
/// - If within cycle window: (false, 0)
/// - If within grace period: (true, calculated_penalty)
/// - If after grace period: returns error via caller
///
/// # Arguments
/// * `group` - The group being contributed to
/// * `current_time` - The timestamp of the contribution
///
/// # Returns
/// `(is_late, penalty_amount)` tuple
pub fn check_contribution_timing(group: &Group, current_time: u64) -> (bool, i128) {
    if is_within_cycle_window(group, current_time) {
        // On time - no penalty
        (false, 0)
    } else if is_within_grace_period(group, current_time) {
        // Late but within grace period - apply penalty
        let penalty = calculate_penalty(group.contribution_amount, group.penalty_rate);
        (true, penalty)
    } else {
        // Too late - caller should return error
        (true, 0)
    }
}

/// Validates grace period and penalty rate parameters.
///
/// # Arguments
/// * `grace_period` - Grace period duration in seconds
/// * `penalty_rate` - Penalty rate as percentage (0-100)
///
/// # Returns
/// `Ok(())` if valid
///
/// # Errors
/// * `InvalidGracePeriod` - if grace_period is unreasonably long (> 7 days)
/// * `InvalidPenaltyRate` - if penalty_rate > 100
pub fn validate_penalty_params(
    grace_period: u64,
    penalty_rate: u32,
) -> Result<(), crate::errors::AjoError> {
    const MAX_GRACE_PERIOD: u64 = 7 * 24 * 60 * 60; // 7 days

    if grace_period > MAX_GRACE_PERIOD {
        return Err(crate::errors::AjoError::InvalidGracePeriod);
    }

    if penalty_rate > 100 {
        return Err(crate::errors::AjoError::InvalidPenaltyRate);
    }

    Ok(())
}

/// Updates or creates a member's penalty record after a contribution.
///
/// # Arguments
/// * `env` - The contract environment
/// * `group_id` - The group
/// * `member` - The member's address
/// * `is_late` - Whether the contribution was late
/// * `penalty_amount` - Penalty charged (0 if on time)
pub fn update_member_penalty_record(
    env: &Env,
    group_id: u64,
    member: &Address,
    is_late: bool,
    penalty_amount: i128,
) {
    let mut record = crate::storage::get_member_penalty(env, group_id, member).unwrap_or(
        crate::types::MemberPenaltyRecord {
            member: member.clone(),
            group_id,
            late_count: 0,
            on_time_count: 0,
            total_penalties: 0,
            reliability_score: 100,
        },
    );

    if is_late {
        record.late_count += 1;
        record.total_penalties += penalty_amount;
    } else {
        record.on_time_count += 1;
    }

    // Calculate reliability score: (on_time / total) * 100
    let total_contributions = record.on_time_count + record.late_count;
    if total_contributions > 0 {
        record.reliability_score = (record.on_time_count * 100) / total_contributions;
    }

    crate::storage::store_member_penalty(env, group_id, member, &record);
}
