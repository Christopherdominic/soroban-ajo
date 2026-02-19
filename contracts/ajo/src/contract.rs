use soroban_sdk::{contract, contractimpl, Address, Env, Vec};

use crate::errors::AjoError;
use crate::events;
use crate::storage;
use crate::types::Group;
use crate::utils;

/// The main Ajo contract
#[contract]
pub struct AjoContract;

#[contractimpl]
impl AjoContract {
    /// Create a new Ajo group
    ///
    /// * `creator` - Who is starting the group (first member)
    /// * `contribution_amount` - Amount in stroops each person puts in per cycle
    /// * `cycle_duration` - How long each rotation lasts (in seconds)
    /// * `max_members` - Total headcount limit for this group
    ///
    /// # Returns
    /// The unique group ID
    ///
    /// # Errors
    /// * `ContributionAmountZero` - Amount is exactly zero
    /// * `ContributionAmountNegative` - Amount is less than zero
    /// * `CycleDurationZero` - Duration is zero
    /// * `MaxMembersBelowMinimum` - Less than 2 members
    pub fn create_group(
        env: Env,
        creator: Address,
        contribution_amount: i128,
        cycle_duration: u64,
        max_members: u32,
    ) -> Result<u64, AjoError> {
        // Validate parameters
        utils::validate_group_params(contribution_amount, cycle_duration, max_members)?;
        
        // Require authentication
        creator.require_auth();
        
        // Generate new group ID
        let group_id = storage::get_next_group_id(&env);
        
        // Initialize members list with creator
        let mut members = Vec::new(&env);
        members.push_back(creator.clone());
        
        // Get current timestamp
        let now = utils::get_current_timestamp(&env);
        
        // Create group
        let group = Group {
            id: group_id,
            creator: creator.clone(),
            contribution_amount,
            cycle_duration,
            max_members,
            members,
            current_cycle: 1,
            payout_index: 0,
            created_at: now,
            cycle_start_time: now,
            is_complete: false,
        };
        
        // Store group
        storage::store_group(&env, group_id, &group);
        
        // Emit event
        events::emit_group_created(&env, group_id, &creator, contribution_amount, max_members);
        
        Ok(group_id)
    }
    
    /// Get group information
    ///
    /// # Arguments
    /// * `group_id` - The unique group identifier
    ///
    /// # Returns
    /// The group data
    ///
    /// # Errors
    /// * `GroupNotFound` - If the group does not exist
    pub fn get_group(env: Env, group_id: u64) -> Result<Group, AjoError> {
        storage::get_group(&env, group_id).ok_or(AjoError::GroupNotFound)
    }
    
    /// Get list of all members in a group
    ///
    /// # Arguments
    /// * `group_id` - The unique group identifier
    ///
    /// # Returns
    /// Vector of member addresses
    ///
    /// # Errors
    /// * `GroupNotFound` - If the group does not exist
    pub fn list_members(env: Env, group_id: u64) -> Result<Vec<Address>, AjoError> {
        let group = storage::get_group(&env, group_id).ok_or(AjoError::GroupNotFound)?;
        Ok(group.members)
    }
    
    /// Join an existing group
    ///
    /// # Arguments
    /// * `member` - User joining the esusu
    /// * `group_id` - ID of the target group
    ///
    /// # Errors
    /// * `GroupNotFound` - Group ID doesn't exist
    /// * `MaxMembersExceeded` - Room is full
    /// * `AlreadyMember` - User is already in there
    /// * `GroupComplete` - This esusu has already finished
    pub fn join_group(env: Env, member: Address, group_id: u64) -> Result<(), AjoError> {
        // Require authentication
        member.require_auth();
        
        // Get group
        let mut group = storage::get_group(&env, group_id).ok_or(AjoError::GroupNotFound)?;
        
        // Check if group is complete
        if group.is_complete {
            return Err(AjoError::GroupComplete);
        }
        
        // Check if already a member
        if utils::is_member(&group.members, &member) {
            return Err(AjoError::AlreadyMember);
        }
        
        // Check if group is full
        if group.members.len() >= group.max_members {
            return Err(AjoError::MaxMembersExceeded);
        }
        
        // Add member
        group.members.push_back(member.clone());
        
        // Update storage
        storage::store_group(&env, group_id, &group);
        
        // Emit event
        events::emit_member_joined(&env, group_id, &member);
        
        Ok(())
    }
    
    /// Check if an address is a member of a group
    ///
    /// # Arguments
    /// * `group_id` - The group to check
    /// * `address` - The address to check
    ///
    /// # Returns
    /// True if the address is a member, false otherwise
    ///
    /// # Errors
    /// * `GroupNotFound` - If the group does not exist
    pub fn is_member(env: Env, group_id: u64, address: Address) -> Result<bool, AjoError> {
        let group = storage::get_group(&env, group_id).ok_or(AjoError::GroupNotFound)?;
        Ok(utils::is_member(&group.members, &address))
    }
    
    /// Contribute to the current cycle
    ///
    /// # Arguments
    /// * `member` - Address making the contribution
    /// * `group_id` - The group to contribute to
    ///
    /// # Errors
    /// * `GroupNotFound` - If the group does not exist
    /// * `NotMember` - If the address is not a member
    /// * `AlreadyContributed` - If already contributed this cycle
    /// * `GroupComplete` - If the group has completed all cycles
    pub fn contribute(env: Env, member: Address, group_id: u64) -> Result<(), AjoError> {
        // Require authentication
        member.require_auth();
        
        // Get group
        let group = storage::get_group(&env, group_id).ok_or(AjoError::GroupNotFound)?;
        
        // Check if group is complete
        if group.is_complete {
            return Err(AjoError::GroupComplete);
        }
        
        // Check if member
        if !utils::is_member(&group.members, &member) {
            return Err(AjoError::NotMember);
        }
        
        // Check if already contributed
        if storage::has_contributed(&env, group_id, group.current_cycle, &member) {
            return Err(AjoError::AlreadyContributed);
        }
        
        // Transfer contribution to contract
        // Note: In production, this would use token.transfer() or native transfer
        // For now, we mark as contributed (assuming payment succeeded)
        
        // Record contribution
        storage::store_contribution(&env, group_id, group.current_cycle, &member, true);
        
        // Emit event
        events::emit_contribution_made(
            &env,
            group_id,
            &member,
            group.current_cycle,
            group.contribution_amount,
        );
        
        Ok(())
    }
    
    /// Get contribution status for all members in the current cycle
    ///
    /// # Arguments
    /// * `group_id` - The group to check
    /// * `cycle_number` - The cycle to check (use current_cycle from group)
    ///
    /// # Returns
    /// Vector of (Address, bool) tuples indicating contribution status
    ///
    /// # Errors
    /// * `GroupNotFound` - If the group does not exist
    pub fn get_contribution_status(
        env: Env,
        group_id: u64,
        cycle_number: u32,
    ) -> Result<Vec<(Address, bool)>, AjoError> {
        let group = storage::get_group(&env, group_id).ok_or(AjoError::GroupNotFound)?;
        Ok(storage::get_cycle_contributions(
            &env,
            group_id,
            cycle_number,
            &group.members,
        ))
    }
    
    /// Execute payout for the current cycle
    ///
    /// This function:
    /// 1. Verifies all members have contributed
    /// 2. Calculates and sends payout to the next member
    /// 3. Advances the payout index and cycle
    /// 4. Marks group as complete if all members have received payout
    ///
    /// # Arguments
    /// * `group_id` - The group to execute payout for
    ///
    /// # Errors
    /// * `GroupNotFound` - If the group does not exist
    /// * `IncompleteContributions` - If not all members have contributed
    /// * `GroupComplete` - If the group has already completed
    /// * `NoMembers` - If the group has no members (should never happen)
    pub fn execute_payout(env: Env, group_id: u64) -> Result<(), AjoError> {
        // Get group
        let mut group = storage::get_group(&env, group_id).ok_or(AjoError::GroupNotFound)?;
        
        // Check if group is complete
        if group.is_complete {
            return Err(AjoError::GroupComplete);
        }
        
        // Check if all members have contributed
        if !utils::all_members_contributed(&env, &group) {
            return Err(AjoError::IncompleteContributions);
        }
        
        // Get payout recipient
        let payout_recipient = group
            .members
            .get(group.payout_index)
            .ok_or(AjoError::NoMembers)?;
        
        // Calculate payout amount
        let payout_amount = utils::calculate_payout_amount(&group);
        
        // Transfer payout to recipient
        // Note: In production, this would use token.transfer() or native transfer
        // For now, we just record it
        
        // Mark payout as received
        storage::mark_payout_received(&env, group_id, &payout_recipient);
        
        // Emit payout event
        events::emit_payout_executed(
            &env,
            group_id,
            &payout_recipient,
            group.current_cycle,
            payout_amount,
        );
        
        // Advance payout index
        group.payout_index += 1;
        
        // Check if all members have received payout
        if group.payout_index >= group.members.len() {
            // All members have received payout - mark complete
            group.is_complete = true;
            events::emit_group_completed(&env, group_id);
        } else {
            // Advance to next cycle
            group.current_cycle += 1;
            group.cycle_start_time = utils::get_current_timestamp(&env);
        }
        
        // Update storage
        storage::store_group(&env, group_id, &group);
        
        Ok(())
    }
    
    /// Check if a group has completed all cycles
    ///
    /// # Arguments
    /// * `group_id` - The group to check
    ///
    /// # Returns
    /// True if the group is complete, false otherwise
    ///
    /// # Errors
    /// * `GroupNotFound` - If the group does not exist
    pub fn is_complete(env: Env, group_id: u64) -> Result<bool, AjoError> {
        let group = storage::get_group(&env, group_id).ok_or(AjoError::GroupNotFound)?;
        Ok(group.is_complete)
    }
}
