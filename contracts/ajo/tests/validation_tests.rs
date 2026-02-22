#![cfg(test)]

use soroban_ajo::{AjoContract, AjoContractClient, AjoError};
use soroban_sdk::{testutils::Address as _, Address, Env};

fn setup_test() -> (Env, AjoContractClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);
    let creator = Address::generate(&env);

    (env, client, creator)
}

#[test]
fn test_invalid_contribution_amount_zero() {
    let (_env, client, creator) = setup_test();

    let result = client.try_create_group(
        &creator, &0,     // Invalid: zero contribution
        &86400, // 1 day
        &5,
    );

    assert_eq!(result, Err(Ok(AjoError::ContributionAmountZero)));
}

#[test]
fn test_invalid_contribution_amount_negative() {
    let (_env, client, creator) = setup_test();

    let result = client.try_create_group(
        &creator, &-100, // Invalid: negative contribution
        &86400, &5,
    );

    assert_eq!(result, Err(Ok(AjoError::ContributionAmountNegative)));
}

#[test]
fn test_invalid_cycle_duration_zero() {
    let (_env, client, creator) = setup_test();

    let result = client.try_create_group(
        &creator, &1000, &0, // Invalid: zero duration
        &5,
    );

    assert_eq!(result, Err(Ok(AjoError::CycleDurationZero)));
}

#[test]
fn test_max_members_below_minimum() {
    let (_env, client, creator) = setup_test();

    let result = client.try_create_group(
        &creator, &1000, &86400, &1, // Invalid: only 1 member (need at least 2)
    );

    assert_eq!(result, Err(Ok(AjoError::MaxMembersBelowMinimum)));
}

#[test]
fn test_max_members_above_limit() {
    let (_env, client, creator) = setup_test();

    let result = client.try_create_group(
        &creator, &1000, &86400, &101, // Invalid: exceeds limit of 100
    );

    assert_eq!(result, Err(Ok(AjoError::MaxMembersAboveLimit)));
}

#[test]
fn test_max_members_exceeded_on_join() {
    let (_env, client, creator) = setup_test();

    // Create group with max 2 members
    let group_id = client.create_group(&creator, &1000, &86400, &2);

    // Second member joins successfully
    let member2 = Address::generate(&_env);
    client.join_group(&member2, &group_id);

    // Third member tries to join - should fail
    let member3 = Address::generate(&_env);
    let result = client.try_join_group(&member3, &group_id);

    assert_eq!(result, Err(Ok(AjoError::MaxMembersExceeded)));
}

#[test]
fn test_valid_group_creation() {
    let (_env, client, creator) = setup_test();

    // All valid parameters
    let result = client.try_create_group(
        &creator, &1000,  // Valid: positive amount
        &86400, // Valid: positive duration
        &5,     // Valid: between 2 and 100
    );

    assert!(result.is_ok());
}
