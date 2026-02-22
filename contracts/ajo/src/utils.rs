use soroban_sdk::{Address, Env, Vec};

use crate::types::{Group, GroupMetadata, MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_RULES_LENGTH};

/// Returns `true` if `address` appears in the group's `members` list.
///
/// Performs a linear scan since Soroban's `Vec` does not support O(1) lookup.
/// For groups capped at 100 members this is acceptable.
///
/// # Arguments
/// * `members` - The ordered member list to search
/// * `address` - The address to look for
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
/// number of members. This ensures the recipient receives the full pool.
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

/// Returns the start and end timestamps for the group's current cycle.
///
/// The cycle window is `[cycle_start_time, cycle_start_time + cycle_duration)`.
/// This is a pure calculation — it does not read the ledger clock.
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
pub fn is_within_cycle_window(group: &Group, current_time: u64) -> bool {
    let (cycle_start, cycle_end) = get_cycle_window(group, current_time);
    current_time >= cycle_start && current_time < cycle_end
}

/// Validate metadata fields against size limits
pub fn validate_metadata(metadata: &GroupMetadata) -> Result<(), crate::errors::AjoError> {
    // Validate name length
    if metadata.name.len() > MAX_NAME_LENGTH {
        return Err(crate::errors::AjoError::MetadataNameTooLong);
    }
    
    // Validate description length
    if metadata.description.len() > MAX_DESCRIPTION_LENGTH {
        return Err(crate::errors::AjoError::MetadataDescriptionTooLong);
    }
    
    // Validate rules length
    if metadata.rules.len() > MAX_RULES_LENGTH {
        return Err(crate::errors::AjoError::MetadataRulesTooLong);
    }
    
    Ok(())
}
