#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env, String};
use soroban_ajo::{AjoContract, AjoContractClient, AjoError};

/// Helper function to create a test environment and contract
fn setup_test_env() -> (Env, AjoContractClient<'static>, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, AjoContract);
    let client = AjoContractClient::new(&env, &contract_id);
    
    // Generate test addresses
    let creator = Address::generate(&env);
    let member2 = Address::generate(&env);
    
    (env, client, creator, member2)
}

#[test]
fn test_set_and_get_metadata() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Create metadata
    let name = String::from_str(&env, "Savings Circle");
    let description = String::from_str(&env, "Monthly savings group for community members");
    let rules = String::from_str(&env, "1. Contribute on time\n2. Respect all members\n3. No late payments");
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name: name.clone(),
        description: description.clone(),
        rules: rules.clone(),
    };
    
    // Set metadata
    client.set_group_metadata(&creator, &group_id, &metadata);
    
    // Get metadata
    let retrieved = client.get_group_metadata(&group_id);
    assert!(retrieved.is_some());
    
    let retrieved_metadata = retrieved.unwrap();
    assert_eq!(retrieved_metadata.name, name);
    assert_eq!(retrieved_metadata.description, description);
    assert_eq!(retrieved_metadata.rules, rules);
}

#[test]
fn test_get_metadata_before_set() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Get metadata before setting - should return None
    let retrieved = client.get_group_metadata(&group_id);
    assert!(retrieved.is_none());
}

#[test]
fn test_update_metadata() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Set initial metadata
    let name1 = String::from_str(&env, "Initial Name");
    let description1 = String::from_str(&env, "Initial description");
    let rules1 = String::from_str(&env, "Initial rules");
    
    let metadata1 = soroban_ajo::types::GroupMetadata {
        name: name1,
        description: description1,
        rules: rules1,
    };
    
    client.set_group_metadata(&creator, &group_id, &metadata1);
    
    // Update metadata
    let name2 = String::from_str(&env, "Updated Name");
    let description2 = String::from_str(&env, "Updated description");
    let rules2 = String::from_str(&env, "Updated rules");
    
    let metadata2 = soroban_ajo::types::GroupMetadata {
        name: name2.clone(),
        description: description2.clone(),
        rules: rules2.clone(),
    };
    
    client.set_group_metadata(&creator, &group_id, &metadata2);
    
    // Verify updated metadata
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, name2);
    assert_eq!(retrieved.description, description2);
    assert_eq!(retrieved.rules, rules2);
}

#[test]
fn test_set_metadata_unauthorized() {
    let (env, client, creator, member2) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Try to set metadata as non-creator
    let name = String::from_str(&env, "Unauthorized");
    let description = String::from_str(&env, "Should fail");
    let rules = String::from_str(&env, "Not allowed");
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name,
        description,
        rules,
    };
    
    let result = client.try_set_group_metadata(&member2, &group_id, &metadata);
    assert_eq!(result, Err(Ok(AjoError::Unauthorized)));
}

#[test]
fn test_metadata_name_too_long() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Create metadata with name exceeding 64 characters
    let long_name = "A".repeat(65);
    let name = String::from_str(&env, &long_name);
    let description = String::from_str(&env, "Valid description");
    let rules = String::from_str(&env, "Valid rules");
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name,
        description,
        rules,
    };
    
    let result = client.try_set_group_metadata(&creator, &group_id, &metadata);
    assert_eq!(result, Err(Ok(AjoError::MetadataNameTooLong)));
}

#[test]
fn test_metadata_description_too_long() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Create metadata with description exceeding 256 characters
    let long_description = "A".repeat(257);
    let name = String::from_str(&env, "Valid name");
    let description = String::from_str(&env, &long_description);
    let rules = String::from_str(&env, "Valid rules");
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name,
        description,
        rules,
    };
    
    let result = client.try_set_group_metadata(&creator, &group_id, &metadata);
    assert_eq!(result, Err(Ok(AjoError::MetadataDescriptionTooLong)));
}

#[test]
fn test_metadata_rules_too_long() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Create metadata with rules exceeding 512 characters
    let long_rules = "A".repeat(513);
    let name = String::from_str(&env, "Valid name");
    let description = String::from_str(&env, "Valid description");
    let rules = String::from_str(&env, &long_rules);
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name,
        description,
        rules,
    };
    
    let result = client.try_set_group_metadata(&creator, &group_id, &metadata);
    assert_eq!(result, Err(Ok(AjoError::MetadataRulesTooLong)));
}

#[test]
fn test_metadata_at_max_lengths() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Create metadata at exactly max lengths (should succeed)
    let name = String::from_str(&env, &"A".repeat(64));
    let description = String::from_str(&env, &"B".repeat(256));
    let rules = String::from_str(&env, &"C".repeat(512));
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name: name.clone(),
        description: description.clone(),
        rules: rules.clone(),
    };
    
    client.set_group_metadata(&creator, &group_id, &metadata);
    
    // Verify it was stored correctly
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, name);
    assert_eq!(retrieved.description, description);
    assert_eq!(retrieved.rules, rules);
}

#[test]
fn test_metadata_empty_strings() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Create metadata with empty strings (should be valid)
    let name = String::from_str(&env, "");
    let description = String::from_str(&env, "");
    let rules = String::from_str(&env, "");
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name: name.clone(),
        description: description.clone(),
        rules: rules.clone(),
    };
    
    client.set_group_metadata(&creator, &group_id, &metadata);
    
    // Verify it was stored correctly
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, name);
    assert_eq!(retrieved.description, description);
    assert_eq!(retrieved.rules, rules);
}

#[test]
fn test_metadata_with_special_characters() {
    let (env, client, creator, _) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    
    // Create metadata with special characters
    let name = String::from_str(&env, "Savings 💰 Circle");
    let description = String::from_str(&env, "Group for: savings, loans & investments!");
    let rules = String::from_str(&env, "Rule #1: Be respectful\nRule #2: Pay on time");
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name: name.clone(),
        description: description.clone(),
        rules: rules.clone(),
    };
    
    client.set_group_metadata(&creator, &group_id, &metadata);
    
    // Verify it was stored correctly
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, name);
    assert_eq!(retrieved.description, description);
    assert_eq!(retrieved.rules, rules);
}

#[test]
fn test_metadata_for_nonexistent_group() {
    let (env, client, creator, _) = setup_test_env();
    
    let nonexistent_group_id = 999u64;
    
    // Try to get metadata for nonexistent group
    let result = client.try_get_group_metadata(&nonexistent_group_id);
    assert_eq!(result, Err(Ok(AjoError::GroupNotFound)));
    
    // Try to set metadata for nonexistent group
    let name = String::from_str(&env, "Test");
    let description = String::from_str(&env, "Test");
    let rules = String::from_str(&env, "Test");
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name,
        description,
        rules,
    };
    
    let result = client.try_set_group_metadata(&creator, &nonexistent_group_id, &metadata);
    assert_eq!(result, Err(Ok(AjoError::GroupNotFound)));
}

#[test]
fn test_metadata_persists_across_group_lifecycle() {
    let (env, client, creator, member2) = setup_test_env();
    
    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &2u32);
    client.join_group(&member2, &group_id);
    
    // Set metadata
    let name = String::from_str(&env, "Persistent Group");
    let description = String::from_str(&env, "This metadata should persist");
    let rules = String::from_str(&env, "Follow the rules");
    
    let metadata = soroban_ajo::types::GroupMetadata {
        name: name.clone(),
        description: description.clone(),
        rules: rules.clone(),
    };
    
    client.set_group_metadata(&creator, &group_id, &metadata);
    
    // Complete a cycle
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.execute_payout(&group_id);
    
    // Verify metadata still exists
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, name);
    assert_eq!(retrieved.description, description);
    assert_eq!(retrieved.rules, rules);
    
    // Complete the group
    client.contribute(&creator, &group_id);
    client.contribute(&member2, &group_id);
    client.execute_payout(&group_id);
    
    // Verify metadata still exists after completion
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, name);
    assert_eq!(retrieved.description, description);
    assert_eq!(retrieved.rules, rules);
}

#[test]
fn test_multiple_groups_independent_metadata() {
    let (env, client, creator1, creator2) = setup_test_env();
    
    // Create two groups
    let group_id1 = client.create_group(&creator1, &100_000_000i128, &604_800u64, &5u32);
    let group_id2 = client.create_group(&creator2, &200_000_000i128, &1_209_600u64, &3u32);
    
    // Set different metadata for each group
    let name1 = String::from_str(&env, "Group One");
    let description1 = String::from_str(&env, "First group description");
    let rules1 = String::from_str(&env, "Rules for group one");
    
    let metadata1 = soroban_ajo::types::GroupMetadata {
        name: name1.clone(),
        description: description1.clone(),
        rules: rules1.clone(),
    };
    
    let name2 = String::from_str(&env, "Group Two");
    let description2 = String::from_str(&env, "Second group description");
    let rules2 = String::from_str(&env, "Rules for group two");
    
    let metadata2 = soroban_ajo::types::GroupMetadata {
        name: name2.clone(),
        description: description2.clone(),
        rules: rules2.clone(),
    };
    
    client.set_group_metadata(&creator1, &group_id1, &metadata1);
    client.set_group_metadata(&creator2, &group_id2, &metadata2);
    
    // Verify each group has its own metadata
    let retrieved1 = client.get_group_metadata(&group_id1).unwrap();
    assert_eq!(retrieved1.name, name1);
    assert_eq!(retrieved1.description, description1);
    assert_eq!(retrieved1.rules, rules1);
    
    let retrieved2 = client.get_group_metadata(&group_id2).unwrap();
    assert_eq!(retrieved2.name, name2);
    assert_eq!(retrieved2.description, description2);
    assert_eq!(retrieved2.rules, rules2);
}
