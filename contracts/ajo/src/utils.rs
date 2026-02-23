use soroban_sdk::{Address, Env, Vec};

use crate::types::Group;

/// Check if an address is a member of the group
pub fn is_member(members: &Vec<Address>, address: &Address) -> bool {
    for member in members.iter() {
        if member == *address {
            return true;
        }
    }
    false
}

/// Check if all members have contributed for the current cycle
pub fn all_members_contributed(env: &Env, group: &Group) -> bool {
    for member in group.members.iter() {
        if !crate::storage::has_contributed(env, group.id, group.current_cycle, &member) {
            return false;
        }
    }
    true
}

/// Calculate the total payout amount for a cycle
pub fn calculate_payout_amount(group: &Group) -> i128 {
    let member_count = group.members.len() as i128;
    group.contribution_amount * member_count
}

/// Get the current timestamp
pub fn get_current_timestamp(env: &Env) -> u64 {
    env.ledger().timestamp()
}

/// Logic to ensure group parameters are sane before creating it.
pub fn validate_group_params(
    amount: i128,
    duration: u64,
    max_members: u32,
) -> Result<(), crate::errors::AjoError> {
    // Amounts must be positive
    if amount == 0 {
        return Err(crate::errors::AjoError::ContributionAmountZero);
    } else if amount < 0 {
        return Err(crate::errors::AjoError::ContributionAmountNegative);
    }
    
    // Time stops for no one - especially not a zero duration esusu
    if duration == 0 {
        return Err(crate::errors::AjoError::CycleDurationZero);
    }
    
    // We need at least two people to rotate money
    if max_members < 2 {
        return Err(crate::errors::AjoError::MaxMembersBelowMinimum);
    }
    
    Ok(())
}

/// Check if a member is eligible for emergency withdrawal
/// 
/// Eligibility rules:
/// - Must be a member of the group
/// - Must not have already withdrawn
/// - Must not have received payout yet
/// - Group must have missed at least one cycle (cycle_duration has passed without payout)
pub fn is_eligible_for_withdrawal(
    env: &Env,
    group: &Group,
    member: &Address,
) -> Result<bool, crate::errors::AjoError> {
    // Check if member
    if !is_member(&group.members, member) {
        return Err(crate::errors::AjoError::NotMember);
    }
    
    // Check if already withdrawn
    if crate::storage::has_withdrawn(env, group.id, member) {
        return Err(crate::errors::AjoError::AlreadyWithdrawn);
    }
    
    // Check if already received payout
    if crate::storage::has_received_payout(env, group.id, member) {
        return Err(crate::errors::AjoError::WithdrawalAfterPayout);
    }
    
    // Check if at least one cycle duration has passed since cycle start
    let current_time = get_current_timestamp(env);
    let time_since_cycle_start = current_time.saturating_sub(group.cycle_start_time);
    
    // Eligible if cycle duration has passed (indicating a stalled group)
    if time_since_cycle_start >= group.cycle_duration {
        Ok(true)
    } else {
        Ok(false)
    }
}

/// Calculate refund and penalty for emergency withdrawal
/// 
/// Logic:
/// - Count how many contributions the member has made
/// - Apply a 10% penalty to the total contributed amount
/// - Return (refund_amount, penalty_amount)
pub fn calculate_withdrawal_amounts(
    env: &Env,
    group: &Group,
    member: &Address,
) -> (i128, i128) {
    let mut contributions_made = 0u32;
    
    // Count contributions across all cycles up to current
    for cycle in 1..=group.current_cycle {
        if crate::storage::has_contributed(env, group.id, cycle, member) {
            contributions_made += 1;
        }
    }
    
    // Calculate total contributed
    let total_contributed = group.contribution_amount * (contributions_made as i128);
    
    // Apply 10% penalty
    let penalty_amount = total_contributed / 10;
    let refund_amount = total_contributed - penalty_amount;
    
    (refund_amount, penalty_amount)
}
