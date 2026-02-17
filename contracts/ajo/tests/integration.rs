#![cfg(test)]

//! Integration tests for the Ajo contract
//! 
//! These tests cover complete lifecycle scenarios and failure paths

use soroban_sdk::{testutils::Address as _, Address, Env};
use soroban_ajo::*;

/// Helper function to create a test environment and contract
fn setup() -> (Env, AjoContractClient<'static>, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);
    
    let creator = Address::generate(&env);
    let member2 = Address::generate(&env);
    let member3 = Address::generate(&env);
    
    (env, client, creator, member2, member3)
}

/// Test complete lifecycle: create → join → contribute → payout → complete
#[test]
fn test_complete_lifecycle_success() {
    let (env, client, creator, member2, member3) = setup();
    
    // Phase 1: Group Creation
    let contribution = 100_000_000i128;  // 10 XLM
    let cycle_duration = 604_800u64;     // 1 week
    let max_members = 3u32;
    
    let group_id = client.create_group(&creator, &contribution, &cycle_duration, &max_members);
    assert_eq!(group_id, 1);
    
    let group = client.get_group(&group_id);
    assert_eq!(group.members.len(), 1);
    assert_eq!(group.current_cycle, 1);
    assert_eq!(group.payout_index, 0);
    assert_eq!(group.is_complete, false);
    
    // Phase 2: Member Joining
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    let members = client.list_members(&group_id);
    assert_eq!(members.len(), 3);
    
    // Phase 3: Cycle 1 - Creator receives payout
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    
    // Check status before payout
    let status = client.get_group_status(&group_id);
    assert_eq!(status.cycle_complete, true);
    assert_eq!(status.next_recipient, creator);
    
    client.execute_payout(&group_id);
    
    let group = client.get_group(&group_id);
    assert_eq!(group.current_cycle, 2);
    assert_eq!(group.payout_index, 1);
    
    // Phase 4: Cycle 2 - Member2 receives payout
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    
    let group = client.get_group(&group_id);
    assert_eq!(group.current_cycle, 3);
    assert_eq!(group.payout_index, 2);
    
    // Phase 5: Cycle 3 - Member3 receives payout (final)
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    
    // Phase 6: Verify Completion
    let group = client.get_group(&group_id);
    assert_eq!(group.is_complete, true);
    assert_eq!(group.payout_index, 3);
    assert_eq!(client.is_complete(&group_id), true);
}

/// Test multiple concurrent groups
#[test]
fn test_multiple_groups_independently() {
    let (env, client, creator1, creator2, member) = setup();
    
    // Create two different groups
    let group1_id = client.create_group(&creator1, &100_000_000i128, &604_800u64, &5u32);
    let group2_id = client.create_group(&creator2, &200_000_000i128, &1_209_600u64, &3u32);
    
    assert_eq!(group1_id, 1);
    assert_eq!(group2_id, 2);
    
    // Same member joins both groups
    client.join_group(&member, &group1_id);
    client.join_group(&member, &group2_id);
    
    // Verify groups are independent
    let group1 = client.get_group(&group1_id);
    let group2 = client.get_group(&group2_id);
    
    assert_eq!(group1.creator, creator1);
    assert_eq!(group2.creator, creator2);
    assert_eq!(group1.contribution_amount, 100_000_000i128);
    assert_eq!(group2.contribution_amount, 200_000_000i128);
    assert_eq!(group1.members.len(), 2);
    assert_eq!(group2.members.len(), 2);
    
    // Contribute to group 1
    client.contribute(&creator1, &group1_id);
    client.contribute(&member, &group1_id);
    
    // Check contribution status - group1 should have 2, group2 should have 0
    let status1 = client.get_contribution_status(&group1_id, &1u32);
    let status2 = client.get_contribution_status(&group2_id, &1u32);
    
    let contributed_count1 = status1.iter().filter(|(_, paid)| *paid).count();
    let contributed_count2 = status2.iter().filter(|(_, paid)| *paid).count();
    
    assert_eq!(contributed_count1, 2);
    assert_eq!(contributed_count2, 0);
}

/// Test failure scenario: incomplete cycle prevents payout
#[test]
fn test_failure_incomplete_contributions() {
    let (env, client, creator, member2, member3) = setup();
    
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Only 2 out of 3 contribute
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    
    // Check status
    let status = client.get_group_status(&group_id);
    assert_eq!(status.contributions_count, 2);
    assert_eq!(status.total_members, 3);
    assert_eq!(status.cycle_complete, false);
    
    // Try to execute payout - should fail
    let result = client.try_execute_payout(&group_id);
    assert!(result.is_err());
}

/// Test failure scenario: operations on completed group
#[test]
fn test_failure_operations_on_completed_group() {
    let (env, client, creator, member2, member3) = setup();
    
    // Create and complete a small group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &2u32);
    client.join_group(&member2, &group_id);
    
    // Complete both cycles
    for _ in 0..2 {
        client.contribute(&creator, &group_id);
        client.contribute(&member2, &group_id);
        client.execute_payout(&group_id);
    }
    
    assert_eq!(client.is_complete(&group_id), true);
    
    // Try to join - should fail
    let result = client.try_join_group(&member3, &group_id);
    assert!(result.is_err());
    
    // Try to contribute - should fail
    let result = client.try_contribute(&creator, &group_id);
    assert!(result.is_err());
    
    // Try to execute payout - should fail
    let result = client.try_execute_payout(&group_id);
    assert!(result.is_err());
}

/// Test cancellation and refund scenario
#[test]
fn test_group_cancellation_scenario() {
    let (env, client, creator, member2, member3) = setup();
    
    // Create group and have members join
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Some members contribute
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    
    // Check status before cancellation
    let status = client.get_group_status(&group_id);
    assert_eq!(status.contributions_count, 2);
    assert_eq!(status.is_complete, false);
    
    // Creator cancels the group
    client.cancel_group(&creator, &group_id);
    
    // Verify group is marked complete
    let group = client.get_group(&group_id);
    assert_eq!(group.is_complete, true);
    
    // Verify no further operations are allowed
    let result = client.try_contribute(&member3, &group_id);
    assert!(result.is_err());
}

/// Test edge case: maximum members limit
#[test]
fn test_max_members_enforcement() {
    let (env, client, creator, member2, _) = setup();
    
    // Create group with max 2 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &2u32);
    
    // Member2 joins (now at max)
    client.join_group(&member2, &group_id);
    
    let group = client.get_group(&group_id);
    assert_eq!(group.members.len(), 2);
    
    // Try to add another member - should fail
    let member3 = Address::generate(&env);
    let result = client.try_join_group(&member3, &group_id);
    assert!(result.is_err());
}

/// Test validation: invalid group parameters
#[test]
fn test_validation_errors() {
    let (env, client, creator, _, _) = setup();
    
    // Zero contribution amount
    let result = client.try_create_group(&creator, &0i128, &604_800u64, &10u32);
    assert!(result.is_err());
    
    // Negative contribution amount  
    let result = client.try_create_group(&creator, &-100i128, &604_800u64, &10u32);
    assert!(result.is_err());
    
    // Zero cycle duration
    let result = client.try_create_group(&creator, &100_000_000i128, &0u64, &10u32);
    assert!(result.is_err());
    
    // Too few members (less than 2)
    let result = client.try_create_group(&creator, &100_000_000i128, &604_800u64, &1u32);
    assert!(result.is_err());
}
