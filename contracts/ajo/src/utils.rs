use soroban_sdk::{Address, Env, Vec};

use crate::errors::AjoError;
use crate::types::Group;

/// Check if an address is a member of the group
///
/// # Arguments
/// * `members` - Vector of member addresses
/// * `address` - The address to check
///
/// # Returns
/// True if the address is in the members vector, false otherwise
pub fn is_member(members: &Vec<Address>, address: &Address) -> bool {
    for member in members.iter() {
        if member == *address {
            return true;
        }
    }
    false
}

/// Check if all members have contributed for the current cycle
///
/// # Arguments
/// * `env` - The environment
/// * `group` - The group to check
///
/// # Returns
/// True if all members have contributed for the current cycle, false otherwise
pub fn all_members_contributed(env: &Env, group: &Group) -> bool {
    for member in group.members.iter() {
        if !crate::storage::has_contributed(env, group.id, group.current_cycle, &member) {
            return false;
        }
    }
    true
}

/// Calculate the total payout amount for a cycle
///
/// # Arguments
/// * `group` - The group data
///
/// # Returns
/// The total payout amount (contribution_amount * number_of_members)
pub fn calculate_payout_amount(group: &Group) -> i128 {
    let member_count = group.members.len() as i128;
    group.contribution_amount * member_count
}

/// Get the current timestamp from the ledger
///
/// # Arguments
/// * `env` - The environment
///
/// # Returns
/// The current ledger timestamp in seconds
pub fn get_current_timestamp(env: &Env) -> u64 {
    env.ledger().timestamp()
}

/// Validate group creation parameters
///
/// # Arguments
/// * `contribution_amount` - The contribution amount per cycle
/// * `cycle_duration` - Duration of each cycle in seconds
/// * `max_members` - Maximum number of members allowed
///
/// # Returns
/// Ok(()) if parameters are valid
///
/// # Errors
/// * `InvalidAmount` - If contribution_amount <= 0
/// * `InvalidCycleDuration` - If cycle_duration == 0
/// * `InvalidMaxMembers` - If max_members < 2
pub fn validate_group_params(
    contribution_amount: i128,
    cycle_duration: u64,
    max_members: u32,
) -> Result<(), AjoError> {
    if contribution_amount <= 0 {
        return Err(AjoError::InvalidAmount);
    }
    
    if cycle_duration == 0 {
        return Err(AjoError::InvalidCycleDuration);
    }
    
    if max_members < 2 {
        return Err(AjoError::InvalidMaxMembers);
    }
    
    Ok(())
}
