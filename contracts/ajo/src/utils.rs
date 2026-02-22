use soroban_sdk::{Address, Env, Vec};

use crate::types::{Group, GroupMetadata, MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_RULES_LENGTH};

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

/// Get cycle start and end timestamps
pub fn get_cycle_window(group: &Group, current_time: u64) -> (u64, u64) {
    let cycle_start = group.cycle_start_time;
    let cycle_end = cycle_start + group.cycle_duration;
    (cycle_start, cycle_end)
}

/// Check if current time is within the active cycle window
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
