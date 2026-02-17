#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env};
use soroban_ajo::*;

/// Helper function to create a test environment and contract
fn setup_test_env() -> (Env, AjoContractClient<'static>, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);
    
    // Generate test addresses
    let creator = Address::generate(&env);
    let member2 = Address::generate(&env);
    let member3 = Address::generate(&env);
    
    (env, client, creator, member2, member3)
}

#[test]
fn test_create_group() {
    let (env, client, creator, _, _) = setup_test_env();
    
    let contribution = 100_000_000i128; // 10 XLM
    let cycle_duration = 604_800u64; // 1 week in seconds
    let max_members = 10u32;
    
    let group_id = client.create_group(&creator, &contribution, &cycle_duration, &max_members);
    
    assert_eq!(group_id, 1);
    
    // Verify group was created correctly
    let group = client.get_group(&group_id);
    assert_eq!(group.id, 1);
    assert_eq!(group.creator, creator);
    assert_eq!(group.contribution_amount, contribution);
    assert_eq!(group.cycle_duration, cycle_duration);
    assert_eq!(group.max_members, max_members);
    assert_eq!(group.members.len(), 1);
    assert_eq!(group.current_cycle, 1);
    assert_eq!(group.payout_index, 0);
    assert_eq!(group.is_complete, false);
}

#[test]
fn test_join_group() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Member 2 joins
    client.join_group(&member2, &group_id);
    
    // Member 3 joins
    client.join_group(&member3, &group_id);
    
    // Verify members
    let members = client.list_members(&group_id);
    assert_eq!(members.len(), 3);
    
    // Verify is_member checks
    assert_eq!(client.is_member(&group_id, &creator), true);
    assert_eq!(client.is_member(&group_id, &member2), true);
    assert_eq!(client.is_member(&group_id, &member3), true);
}

#[test]
fn test_join_group_already_member() {
    let (env, client, creator, _, _) = setup_test_env();
    
    // Create group (creator is automatically a member)
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Try to join again - should return error
    let result = client.try_join_group(&creator, &group_id);
    assert!(result.is_err());
}

#[test]
fn test_join_group_full() {
    let (env, client, creator, member2, _) = setup_test_env();
    
    // Create group with max 2 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &2u32);
    
    // Member 2 joins (now at max)
    client.join_group(&member2, &group_id);
    
    // Try to add another member - should return error
    let member3 = Address::generate(&env);
    let result = client.try_join_group(&member3, &group_id);
    assert!(result.is_err());
}

#[test]
fn test_contribution_flow() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members max
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // All members contribute
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    
    // Check contribution status
    let status = client.get_contribution_status(&group_id, &1u32);
    assert_eq!(status.len(), 3);
    
    // All should have contributed
    for (_, has_paid) in status.iter() {
        assert_eq!(has_paid, true);
    }
}

#[test]
fn test_double_contribution() {
    let (env, client, creator, _, _) = setup_test_env();
    
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    
    // Contribute once
    client.contribute(&creator, &group_id);
    
    // Try to contribute again - should return error
    let result = client.try_contribute(&creator, &group_id);
    assert!(result.is_err());
}

#[test]
fn test_payout_incomplete_contributions() {
    let (env, client, creator, member2, _) = setup_test_env();
    
    // Create group with 2 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    
    // Only creator contributes
    client.contribute(&creator, &group_id);
    
    // Try to execute payout - should return error (not all contributed)
    let result = client.try_execute_payout(&group_id);
    assert!(result.is_err());
}

#[test]
fn test_payout_execution() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Cycle 1: All contribute, creator receives payout
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    
    // Verify state after first payout
    let group = client.get_group(&group_id);
    assert_eq!(group.current_cycle, 2);
    assert_eq!(group.payout_index, 1);
    assert_eq!(group.is_complete, false);
}

#[test]
fn test_full_lifecycle() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Verify not complete initially
    assert_eq!(client.is_complete(&group_id), false);
    
    // Cycle 1: Creator receives payout
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    assert_eq!(client.is_complete(&group_id), false);
    
    // Cycle 2: Member 2 receives payout
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    assert_eq!(client.is_complete(&group_id), false);
    
    // Cycle 3: Member 3 receives payout (final)
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    
    // Group should now be complete
    assert_eq!(client.is_complete(&group_id), true);
    
    let group = client.get_group(&group_id);
    assert_eq!(group.is_complete, true);
    assert_eq!(group.payout_index, 3);
}

#[test]
fn test_contribute_after_completion() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create and complete a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Complete all cycles
    for _ in 0..3 {
        client.contribute(&creator, &group_id);
        client.contribute(&member2, &group_id);
        client.contribute(&member3, &group_id);
        client.execute_payout(&group_id);
    }
    
    // Try to contribute to completed group - should return error
    let result = client.try_contribute(&creator, &group_id);
    assert!(result.is_err());
}

#[test]
fn test_create_group_invalid_amount() {
    let (env, client, creator, _, _) = setup_test_env();
    
    // Try to create group with zero contribution
    let result = client.try_create_group(&creator, &0i128, &604_800u64, &10u32);
    
    // Should return InvalidAmount error (code 9)
    assert!(result.is_err());
}

#[test]
fn test_create_group_invalid_duration() {
    let (env, client, creator, _, _) = setup_test_env();
    
    // Try to create group with zero duration
    let result = client.try_create_group(&creator, &100_000_000i128, &0u64, &10u32);
    
    // Should return InvalidCycleDuration error (code 10)
    assert!(result.is_err());
}

#[test]
fn test_create_group_invalid_max_members() {
    let (env, client, creator, _, _) = setup_test_env();
    
    // Try to create group with only 1 member max
    let result = client.try_create_group(&creator, &100_000_000i128, &604_800u64, &1u32);
    
    // Should return InvalidMaxMembers error (code 11)
    assert!(result.is_err());
}

#[test]
fn test_contribute_not_member() {
    let (env, client, creator, _, _) = setup_test_env();
    
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Try to contribute as non-member
    let non_member = Address::generate(&env);
    let result = client.try_contribute(&non_member, &group_id);
    assert!(result.is_err());
}

#[test]
fn test_multiple_groups() {
    let (env, client, creator, member2, _) = setup_test_env();
    
    // Create first group
    let group_id1 = client.create_group(&creator, &100_000_000i128, &604_800u64, &5u32);
    
    // Create second group
    let group_id2 = client.create_group(&member2, &200_000_000i128, &1_209_600u64, &3u32);
    
    // Verify both groups exist independently
    assert_eq!(group_id1, 1);
    assert_eq!(group_id2, 2);
    
    let group1 = client.get_group(&group_id1);
    let group2 = client.get_group(&group_id2);
    
    assert_eq!(group1.creator, creator);
    assert_eq!(group2.creator, member2);
    assert_eq!(group1.contribution_amount, 100_000_000i128);
    assert_eq!(group2.contribution_amount, 200_000_000i128);
}

// ========================================
// Issue 2: Edge case tests for contribution flow
// ========================================

#[test]
fn test_negative_contribution_amount() {
    let (env, client, creator, _, _) = setup_test_env();
    
    // Try to create group with negative contribution
    let result = client.try_create_group(&creator, &-100_000_000i128, &604_800u64, &10u32);
    
    // Should return InvalidAmount error
    assert!(result.is_err());
}

#[test]
fn test_join_after_completion() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create and complete a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Complete all cycles
    for _ in 0..3 {
        client.contribute(&creator, &group_id);
        client.contribute(&member2, &group_id);
        client.contribute(&member3, &group_id);
        client.execute_payout(&group_id);
    }
    
    // Try to join completed group - should return error
    let new_member = Address::generate(&env);
    let result = client.try_join_group(&new_member, &group_id);
    assert!(result.is_err());
}

#[test]
fn test_duplicate_contribution_same_cycle() {
    let (env, client, creator, member2, _) = setup_test_env();
    
    // Create group with 2 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    
    // Contribute once
    client.contribute(&creator, &group_id);
    
    // Try to contribute again in the same cycle - should return error
    let result = client.try_contribute(&creator, &group_id);
    assert!(result.is_err());
    
    // Verify contribution status shows only one contribution
    let status = client.get_contribution_status(&group_id, &1u32);
    let creator_status = status.iter().find(|(addr, _)| addr == &creator).unwrap();
    assert_eq!(creator_status.1, true);
}

#[test]
fn test_contribution_across_cycles() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Cycle 1: All contribute
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    
    // Cycle 2: Creator can contribute again (new cycle)
    client.contribute(&creator, &group_id);
    
    // Verify contribution was recorded
    let status = client.get_contribution_status(&group_id, &2u32);
    let creator_status = status.iter().find(|(addr, _)| addr == &creator).unwrap();
    assert_eq!(creator_status.1, true);
}

// ========================================
// Issue 5: Group status helper tests
// ========================================

#[test]
fn test_group_status_initial_state() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Get status
    let status = client.get_group_status(&group_id);
    
    // Verify initial state
    assert_eq!(status.group_id, group_id);
    assert_eq!(status.current_cycle, 1);
    assert_eq!(status.next_recipient, creator);
    assert_eq!(status.contributions_count, 0);
    assert_eq!(status.total_members, 3);
    assert_eq!(status.cycle_complete, false);
    assert_eq!(status.is_complete, false);
}

#[test]
fn test_group_status_partial_contributions() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Two members contribute
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    
    // Get status
    let status = client.get_group_status(&group_id);
    
    // Verify partial contributions
    assert_eq!(status.contributions_count, 2);
    assert_eq!(status.total_members, 3);
    assert_eq!(status.cycle_complete, false);
}

#[test]
fn test_group_status_cycle_complete() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // All members contribute
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    
    // Get status
    let status = client.get_group_status(&group_id);
    
    // Verify cycle is complete
    assert_eq!(status.contributions_count, 3);
    assert_eq!(status.total_members, 3);
    assert_eq!(status.cycle_complete, true);
    assert_eq!(status.is_complete, false);  // Group not complete yet
}

#[test]
fn test_group_status_after_payout() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Complete cycle 1 and execute payout
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    
    // Get status for cycle 2
    let status = client.get_group_status(&group_id);
    
    // Verify moved to cycle 2
    assert_eq!(status.current_cycle, 2);
    assert_eq!(status.next_recipient, member2);  // Next in line
    assert_eq!(status.contributions_count, 0);  // New cycle, no contributions yet
    assert_eq!(status.cycle_complete, false);
    assert_eq!(status.is_complete, false);
}

#[test]
fn test_group_status_completed() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Complete all 3 cycles
    for _ in 0..3 {
        client.contribute(&creator, &group_id);
        client.contribute(&member2, &group_id);
        client.contribute(&member3, &group_id);
        client.execute_payout(&group_id);
    }
    
    // Get status
    let status = client.get_group_status(&group_id);
    
    // Verify group is complete
    assert_eq!(status.is_complete, true);
}
