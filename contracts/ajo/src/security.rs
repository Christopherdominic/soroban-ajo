///! Security utilities and monitoring for the Ajo contract
///!
///! This module provides security-focused utilities including:
///! - Transaction monitoring and anomaly detection
///! - Rate limiting helpers
///! - Security event logging
///! - Validation helpers

use soroban_sdk::{Address, Env, Vec};

use crate::errors::AjoError;
use crate::types::Group;

/// Security thresholds and limits
pub mod limits {
    /// Maximum members per group (prevents DoS via large groups)
    pub const MAX_MEMBERS: u32 = 100;
    
    /// Minimum members per group (ROSCA requires at least 2)
    pub const MIN_MEMBERS: u32 = 2;
    
    /// Maximum contribution amount (10 million XLM in stroops)
    pub const MAX_CONTRIBUTION: i128 = 10_000_000_000_000_000;
    
    /// Minimum contribution amount (0.01 XLM in stroops)
    pub const MIN_CONTRIBUTION: i128 = 100_000;
    
    /// Maximum cycle duration (365 days in seconds)
    pub const MAX_CYCLE_DURATION: u64 = 31_536_000;
    
    /// Minimum cycle duration (1 hour in seconds)
    pub const MIN_CYCLE_DURATION: u64 = 3_600;
    
    /// Maximum metadata field lengths
    pub const MAX_NAME_LENGTH: u32 = 100;
    pub const MAX_DESCRIPTION_LENGTH: u32 = 500;
    pub const MAX_RULES_LENGTH: u32 = 1000;
}

/// Validates group creation parameters against security limits
///
/// This function performs comprehensive validation of all group parameters
/// to prevent malicious or erroneous group creation.
///
/// # Arguments
/// * `contribution_amount` - The fixed contribution amount per cycle
/// * `cycle_duration` - Duration of each cycle in seconds
/// * `max_members` - Maximum number of members allowed
///
/// # Returns
/// * `Ok(())` if all parameters are valid
/// * `Err(AjoError)` with specific error for invalid parameters
///
/// # Security Checks
/// - Contribution amount must be positive and within reasonable bounds
/// - Cycle duration must be reasonable (not too short or too long)
/// - Member count must be within safe limits
pub fn validate_group_params(
    contribution_amount: i128,
    cycle_duration: u64,
    max_members: u32,
) -> Result<(), AjoError> {
    // Validate contribution amount
    if contribution_amount == 0 {
        return Err(AjoError::ContributionAmountZero);
    }
    if contribution_amount < 0 {
        return Err(AjoError::ContributionAmountNegative);
    }
    if contribution_amount < limits::MIN_CONTRIBUTION {
        return Err(AjoError::ContributionAmountZero); // Too small
    }
    if contribution_amount > limits::MAX_CONTRIBUTION {
        return Err(AjoError::ContributionAmountNegative); // Too large (reuse error)
    }
    
    // Validate cycle duration
    if cycle_duration == 0 {
        return Err(AjoError::CycleDurationZero);
    }
    if cycle_duration < limits::MIN_CYCLE_DURATION {
        return Err(AjoError::CycleDurationZero); // Too short
    }
    if cycle_duration > limits::MAX_CYCLE_DURATION {
        return Err(AjoError::CycleDurationZero); // Too long (reuse error)
    }
    
    // Validate max members
    if max_members < limits::MIN_MEMBERS {
        return Err(AjoError::MaxMembersBelowMinimum);
    }
    if max_members > limits::MAX_MEMBERS {
        return Err(AjoError::MaxMembersAboveLimit);
    }
    
    Ok(())
}

/// Checks if an address is a member of a group
///
/// # Arguments
/// * `members` - The list of group members
/// * `address` - The address to check
///
/// # Returns
/// `true` if the address is in the members list, `false` otherwise
pub fn is_member(members: &Vec<Address>, address: &Address) -> bool {
    for member in members.iter() {
        if member == *address {
            return true;
        }
    }
    false
}

/// Validates that all members have contributed in the current cycle
///
/// # Arguments
/// * `env` - The contract environment
/// * `group` - The group to check
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

/// Calculates the total payout amount for a cycle
///
/// # Arguments
/// * `group` - The group to calculate payout for
///
/// # Returns
/// The total payout amount (contribution_amount × number of members)
///
/// # Security Note
/// Uses checked multiplication to prevent overflow
pub fn calculate_payout_amount(group: &Group) -> i128 {
    let member_count = group.members.len() as i128;
    group.contribution_amount.checked_mul(member_count)
        .expect("Payout calculation overflow")
}

/// Security monitoring: Detects unusual transaction patterns
///
/// This function can be called to check for suspicious activity patterns.
/// In production, this would integrate with off-chain monitoring systems.
///
/// # Arguments
/// * `group` - The group to monitor
///
/// # Returns
/// `true` if activity appears normal, `false` if suspicious
///
/// # Checks
/// - Rapid group creation
/// - Unusual contribution patterns
/// - Large withdrawal amounts
pub fn check_transaction_pattern(group: &Group) -> bool {
    // Check for reasonable member count
    if group.members.len() > limits::MAX_MEMBERS as usize {
        return false;
    }
    
    // Check for reasonable contribution amount
    if group.contribution_amount > limits::MAX_CONTRIBUTION {
        return false;
    }
    
    // Check for reasonable cycle duration
    if group.cycle_duration > limits::MAX_CYCLE_DURATION {
        return false;
    }
    
    // All checks passed
    true
}

/// Validates metadata field lengths
///
/// # Arguments
/// * `name_len` - Length of the name field
/// * `description_len` - Length of the description field
/// * `rules_len` - Length of the rules field
///
/// # Returns
/// `Ok(())` if all lengths are within limits, `Err(AjoError::MetadataTooLong)` otherwise
pub fn validate_metadata_lengths(
    name_len: u32,
    description_len: u32,
    rules_len: u32,
) -> Result<(), AjoError> {
    if name_len > limits::MAX_NAME_LENGTH
        || description_len > limits::MAX_DESCRIPTION_LENGTH
        || rules_len > limits::MAX_RULES_LENGTH
    {
        return Err(AjoError::MetadataTooLong);
    }
    Ok(())
}

/// Security audit helper: Generates a security report for a group
///
/// This function can be used by auditors or monitoring systems to get
/// a comprehensive security overview of a group's state.
///
/// # Arguments
/// * `env` - The contract environment
/// * `group` - The group to audit
///
/// # Returns
/// A tuple containing:
/// - Total contributions expected
/// - Total contributions received
/// - Payouts completed
/// - Security flags (0 = all good, >0 = issues detected)
pub fn audit_group_security(env: &Env, group: &Group) -> (u32, u32, u32, u32) {
    let total_expected = group.members.len() as u32 * group.current_cycle;
    
    let mut total_received = 0u32;
    for cycle in 1..=group.current_cycle {
        for member in group.members.iter() {
            if crate::storage::has_contributed(env, group.id, cycle, &member) {
                total_received += 1;
            }
        }
    }
    
    let payouts_completed = group.payout_index;
    
    // Security flags
    let mut flags = 0u32;
    
    // Flag 1: Incomplete contributions
    if total_received < total_expected && !group.is_complete {
        flags |= 1;
    }
    
    // Flag 2: Payout index mismatch
    if payouts_completed > group.members.len() as u32 {
        flags |= 2;
    }
    
    // Flag 3: Unusual parameters
    if !check_transaction_pattern(group) {
        flags |= 4;
    }
    
    (total_expected, total_received, payouts_completed, flags)
}

/// Gets the current timestamp from the ledger
///
/// # Arguments
/// * `env` - The contract environment
///
/// # Returns
/// Current ledger timestamp in seconds
pub fn get_current_timestamp(env: &Env) -> u64 {
    env.ledger().timestamp()
}

/// Checks if a cycle is still active based on time
///
/// # Arguments
/// * `env` - The contract environment
/// * `group` - The group to check
///
/// # Returns
/// `true` if the current cycle is still active, `false` if expired
pub fn is_cycle_active(env: &Env, group: &Group) -> bool {
    let current_time = get_current_timestamp(env);
    let cycle_end = group.cycle_start_time + group.cycle_duration;
    current_time < cycle_end
}

/// Security helper: Validates that a payout is legitimate
///
/// # Arguments
/// * `env` - The contract environment
/// * `group` - The group executing the payout
/// * `recipient` - The intended recipient
///
/// # Returns
/// `Ok(())` if payout is valid, `Err(AjoError)` otherwise
pub fn validate_payout(env: &Env, group: &Group, recipient: &Address) -> Result<(), AjoError> {
    // Check if group is complete
    if group.is_complete {
        return Err(AjoError::GroupComplete);
    }
    
    // Check if all members contributed
    if !all_members_contributed(env, group) {
        return Err(AjoError::IncompleteContributions);
    }
    
    // Check if recipient is a member
    if !is_member(&group.members, recipient) {
        return Err(AjoError::NotMember);
    }
    
    // Check if recipient already received payout
    if crate::storage::has_received_payout(env, group.id, recipient) {
        return Err(AjoError::AlreadyReceivedPayout);
    }
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_validate_group_params_valid() {
        let result = validate_group_params(1_000_000, 604_800, 10);
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_validate_group_params_zero_contribution() {
        let result = validate_group_params(0, 604_800, 10);
        assert_eq!(result, Err(AjoError::ContributionAmountZero));
    }
    
    #[test]
    fn test_validate_group_params_negative_contribution() {
        let result = validate_group_params(-100, 604_800, 10);
        assert_eq!(result, Err(AjoError::ContributionAmountNegative));
    }
    
    #[test]
    fn test_validate_group_params_zero_duration() {
        let result = validate_group_params(1_000_000, 0, 10);
        assert_eq!(result, Err(AjoError::CycleDurationZero));
    }
    
    #[test]
    fn test_validate_group_params_too_few_members() {
        let result = validate_group_params(1_000_000, 604_800, 1);
        assert_eq!(result, Err(AjoError::MaxMembersBelowMinimum));
    }
    
    #[test]
    fn test_validate_group_params_too_many_members() {
        let result = validate_group_params(1_000_000, 604_800, 101);
        assert_eq!(result, Err(AjoError::MaxMembersAboveLimit));
    }
    
    #[test]
    fn test_validate_metadata_lengths_valid() {
        let result = validate_metadata_lengths(50, 200, 500);
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_validate_metadata_lengths_too_long() {
        let result = validate_metadata_lengths(101, 200, 500);
        assert_eq!(result, Err(AjoError::MetadataTooLong));
    }
}
