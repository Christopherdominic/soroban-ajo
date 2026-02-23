#![cfg(test)]

use soroban_sdk::{testutils::{Address as _, Ledger}, Address, Env};
use soroban_ajo::{AjoContract, AjoContractClient, AjoError};

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
    
    // Try to join again - should fail with AlreadyMember
    let result = client.try_join_group(&creator, &group_id);
    assert_eq!(result, Err(Ok(AjoError::AlreadyMember)));
}

#[test]
fn test_join_group_max_members_exceeded() {
    let (env, client, creator, member2, _) = setup_test_env();
    
    // Create group with max 2 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &2u32);
    
    // Member 2 joins (now at max)
    client.join_group(&member2, &group_id);
    
    // Try to add another member - should fail with MaxMembersExceeded
    let member3 = Address::generate(&env);
    let result = client.try_join_group(&member3, &group_id);
    assert_eq!(result, Err(Ok(AjoError::MaxMembersExceeded)));
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
    
    // Try to contribute again - should fail with AlreadyContributed
    let result = client.try_contribute(&creator, &group_id);
    assert_eq!(result, Err(Ok(AjoError::AlreadyContributed)));
}

#[test]
fn test_payout_incomplete_contributions() {
    let (env, client, creator, member2, _) = setup_test_env();
    
    // Create group with 2 members
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);
    client.join_group(&member2, &group_id);
    
    // Only creator contributes
    client.contribute(&creator, &group_id);
    
    // Try to execute payout - should fail with IncompleteContributions
    let result = client.try_execute_payout(&group_id);
    assert_eq!(result, Err(Ok(AjoError::IncompleteContributions)));
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
    
    // Try to contribute to completed group - should fail with GroupComplete
    let result = client.try_contribute(&creator, &group_id);
    assert_eq!(result, Err(Ok(AjoError::GroupComplete)));
}

#[test]
fn test_create_group_zero_contribution_fails() {
    let (_, client, admin, _, _) = setup_test_env();
    
    // Exactly zero shouldn't work
    let res = client.try_create_group(&admin, &0i128, &604_800u64, &10u32);
    assert_eq!(res, Err(Ok(AjoError::ContributionAmountZero)));
}

#[test]
fn test_create_group_negative_contribution_fails() {
    let (_, client, admin, _, _) = setup_test_env();
    
    // Negative amounts are a no-go
    let res = client.try_create_group(&admin, &-500i128, &604_800u64, &10u32);
    assert_eq!(res, Err(Ok(AjoError::ContributionAmountNegative)));
}

#[test]
fn test_create_group_invalid_duration_fails() {
    let (_, client, admin, _, _) = setup_test_env();
    
    // Can't have a 0 duration cycle
    let res = client.try_create_group(&admin, &100_000_000i128, &0u64, &5u32);
    assert_eq!(res, Err(Ok(AjoError::CycleDurationZero)));
}

#[test]
fn test_create_group_tiny_limit_fails() {
    let (_, client, admin, _, _) = setup_test_env();
    
    // Need at least 2 people for a rotation
    let res = client.try_create_group(&admin, &100_000_000i128, &604_800u64, &1u32);
    assert_eq!(res, Err(Ok(AjoError::MaxMembersBelowMinimum)));
}

#[test]
fn test_contribute_not_member() {
    let (env, client, creator, _, _) = setup_test_env();
    
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Try to contribute as non-member - should fail with NotMember
    let non_member = Address::generate(&env);
    let result = client.try_contribute(&non_member, &group_id);
    assert_eq!(result, Err(Ok(AjoError::NotMember)));
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

// ============================================================================
// Emergency Withdrawal Tests
// ============================================================================

#[test]
fn test_emergency_withdraw_eligible() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group with 3 members
    let contribution = 100_000_000i128; // 10 XLM
    let cycle_duration = 604_800u64; // 1 week
    let group_id = client.create_group(&creator, &contribution, &cycle_duration, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // All members contribute for cycle 1
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    
    // Advance time past cycle duration (group stalls)
    env.ledger().with_mut(|li| {
        li.timestamp = li.timestamp + cycle_duration + 1;
    });
    
    // Member2 performs emergency withdrawal
    let (refund, penalty) = client.emergency_withdraw(&member2, &group_id);
    
    // Member2 contributed once: 100_000_000
    // Penalty is 10%: 10_000_000
    // Refund is 90%: 90_000_000
    assert_eq!(refund, 90_000_000i128);
    assert_eq!(penalty, 10_000_000i128);
}

#[test]
fn test_emergency_withdraw_multiple_contributions() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group
    let contribution = 100_000_000i128;
    let cycle_duration = 604_800u64;
    let group_id = client.create_group(&creator, &contribution, &cycle_duration, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Complete cycle 1 with payout
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    
    // Contribute for cycle 2
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    
    // Advance time past cycle duration (group stalls)
    env.ledger().with_mut(|li| {
        li.timestamp = li.timestamp + cycle_duration + 1;
    });
    
    // Member3 performs emergency withdrawal
    let (refund, penalty) = client.emergency_withdraw(&member3, &group_id);
    
    // Member3 contributed twice: 200_000_000
    // Penalty is 10%: 20_000_000
    // Refund is 90%: 180_000_000
    assert_eq!(refund, 180_000_000i128);
    assert_eq!(penalty, 20_000_000i128);
}

#[test]
fn test_emergency_withdraw_not_eligible_too_early() {
    let (env, client, creator, member2, _) = setup_test_env();
    
    // Create group
    let cycle_duration = 604_800u64;
    let group_id = client.create_group(&creator, &100_000_000i128, &cycle_duration, &3u32);
    client.join_group(&member2, &group_id);
    
    // Contribute
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    
    // Try to withdraw before cycle duration passes - should fail
    let result = client.try_emergency_withdraw(&member2, &group_id);
    assert_eq!(result, Err(Ok(AjoError::NotEligibleForWithdrawal)));
}

#[test]
fn test_emergency_withdraw_not_member() {
    let (env, client, creator, _, _) = setup_test_env();
    
    // Create group
    let cycle_duration = 604_800u64;
    let group_id = client.create_group(&creator, &100_000_000i128, &cycle_duration, &3u32);
    
    // Advance time
    env.ledger().with_mut(|li| {
        li.timestamp = li.timestamp + cycle_duration + 1;
    });
    
    // Try to withdraw as non-member - should fail
    let non_member = Address::generate(&env);
    let result = client.try_emergency_withdraw(&non_member, &group_id);
    assert_eq!(result, Err(Ok(AjoError::NotMember)));
}

#[test]
fn test_emergency_withdraw_after_payout() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group
    let contribution = 100_000_000i128;
    let cycle_duration = 604_800u64;
    let group_id = client.create_group(&creator, &contribution, &cycle_duration, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Complete cycle 1 - creator receives payout
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    client.execute_payout(&group_id);
    
    // Advance time
    env.ledger().with_mut(|li| {
        li.timestamp = li.timestamp + cycle_duration + 1;
    });
    
    // Creator tries to withdraw after receiving payout - should fail
    let result = client.try_emergency_withdraw(&creator, &group_id);
    assert_eq!(result, Err(Ok(AjoError::WithdrawalAfterPayout)));
}

#[test]
fn test_emergency_withdraw_already_withdrawn() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group
    let contribution = 100_000_000i128;
    let cycle_duration = 604_800u64;
    let group_id = client.create_group(&creator, &contribution, &cycle_duration, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Contribute
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    
    // Advance time
    env.ledger().with_mut(|li| {
        li.timestamp = li.timestamp + cycle_duration + 1;
    });
    
    // First withdrawal succeeds
    client.emergency_withdraw(&member2, &group_id);
    
    // Try to withdraw again - should fail
    let result = client.try_emergency_withdraw(&member2, &group_id);
    assert_eq!(result, Err(Ok(AjoError::AlreadyWithdrawn)));
}

#[test]
fn test_emergency_withdraw_no_contributions() {
    let (env, client, creator, member2, _) = setup_test_env();
    
    // Create group
    let cycle_duration = 604_800u64;
    let group_id = client.create_group(&creator, &100_000_000i128, &cycle_duration, &3u32);
    client.join_group(&member2, &group_id);
    
    // Advance time without contributing
    env.ledger().with_mut(|li| {
        li.timestamp = li.timestamp + cycle_duration + 1;
    });
    
    // Member2 withdraws without having contributed
    let (refund, penalty) = client.emergency_withdraw(&member2, &group_id);
    
    // No contributions means no refund or penalty
    assert_eq!(refund, 0i128);
    assert_eq!(penalty, 0i128);
}

#[test]
fn test_emergency_withdraw_prevents_further_participation() {
    let (env, client, creator, member2, member3) = setup_test_env();
    
    // Create group
    let contribution = 100_000_000i128;
    let cycle_duration = 604_800u64;
    let group_id = client.create_group(&creator, &contribution, &cycle_duration, &3u32);
    client.join_group(&member2, &group_id);
    client.join_group(&member3, &group_id);
    
    // Contribute for cycle 1
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.contribute(&member3, &group_id);
    
    // Advance time
    env.ledger().with_mut(|li| {
        li.timestamp = li.timestamp + cycle_duration + 1;
    });
    
    // Member2 withdraws
    client.emergency_withdraw(&member2, &group_id);
    
    // Execute payout for cycle 1
    client.execute_payout(&group_id);
    
    // Try to contribute in cycle 2 - member2 should not be able to participate again
    // (They're still technically a member but have withdrawn)
    let result = client.try_emergency_withdraw(&member2, &group_id);
    assert_eq!(result, Err(Ok(AjoError::AlreadyWithdrawn)));
}

#[test]
fn test_emergency_withdraw_group_not_found() {
    let (env, client, _, member2, _) = setup_test_env();
    
    // Try to withdraw from non-existent group
    let result = client.try_emergency_withdraw(&member2, &999u64);
    assert_eq!(result, Err(Ok(AjoError::GroupNotFound)));
}
