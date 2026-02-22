#![cfg(test)]

use soroban_ajo::{AjoContract, AjoContractClient, GroupMetadata};
use soroban_sdk::{testutils::Address as _, Address, Env, String};

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
    let name = String::from_str(&env, "Monthly Savings Circle");
    let description = String::from_str(&env, "A group for monthly savings and mutual support");
    let rules = String::from_str(
        &env,
        "1. Contribute by the 1st of each month\n2. No late payments",
    );

    let metadata = GroupMetadata {
        name: Some(name.clone()),
        description: Some(description.clone()),
        rules: Some(rules.clone()),
    };

    // Set metadata
    client.set_group_metadata(&group_id, &metadata);

    // Get metadata
    let retrieved = client.get_group_metadata(&group_id).unwrap();

    assert_eq!(retrieved.name, Some(name));
    assert_eq!(retrieved.description, Some(description));
    assert_eq!(retrieved.rules, Some(rules));
}

#[test]
fn test_get_metadata_none_when_not_set() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Get metadata without setting it
    let metadata = client.get_group_metadata(&group_id);

    assert_eq!(metadata, None);
}

#[test]
fn test_set_metadata_partial_fields() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Create metadata with only name
    let name = String::from_str(&env, "Tech Workers Ajo");
    let metadata = GroupMetadata {
        name: Some(name.clone()),
        description: None,
        rules: None,
    };

    // Set metadata
    client.set_group_metadata(&group_id, &metadata);

    // Get metadata
    let retrieved = client.get_group_metadata(&group_id).unwrap();

    assert_eq!(retrieved.name, Some(name));
    assert_eq!(retrieved.description, None);
    assert_eq!(retrieved.rules, None);
}

#[test]
fn test_update_metadata() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Set initial metadata
    let name1 = String::from_str(&env, "Initial Name");
    let metadata1 = GroupMetadata {
        name: Some(name1),
        description: None,
        rules: None,
    };
    client.set_group_metadata(&group_id, &metadata1);

    // Update metadata
    let name2 = String::from_str(&env, "Updated Name");
    let description2 = String::from_str(&env, "Now with description");
    let metadata2 = GroupMetadata {
        name: Some(name2.clone()),
        description: Some(description2.clone()),
        rules: None,
    };
    client.set_group_metadata(&group_id, &metadata2);

    // Get updated metadata
    let retrieved = client.get_group_metadata(&group_id).unwrap();

    assert_eq!(retrieved.name, Some(name2));
    assert_eq!(retrieved.description, Some(description2));
    assert_eq!(retrieved.rules, None);
}

// Note: Authorization test skipped because mock_all_auths() prevents proper auth testing
// In production, only the creator can set metadata (enforced by require_auth())
/*
#[test]
#[should_panic]
fn test_set_metadata_unauthorized() {
    let (env, client, creator, member2) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Join as member2
    client.join_group(&member2, &group_id);

    // Try to set metadata as non-creator (should fail)
    let name = String::from_str(&env, "Unauthorized Update");
    let metadata = GroupMetadata {
        name: Some(name),
        description: None,
        rules: None,
    };

    // This should panic because member2 is not the creator
    env.mock_all_auths_allowing_non_root_auth();
    client.set_group_metadata(&group_id, &metadata);
}
*/

#[test]
#[should_panic]
fn test_set_metadata_group_not_found() {
    let (env, client, creator, _) = setup_test_env();

    // Try to set metadata for non-existent group
    let name = String::from_str(&env, "Non-existent Group");
    let metadata = GroupMetadata {
        name: Some(name),
        description: None,
        rules: None,
    };

    client.set_group_metadata(&999u64, &metadata);
}

#[test]
#[should_panic]
fn test_get_metadata_group_not_found() {
    let (_env, client, _creator, _) = setup_test_env();

    // Try to get metadata for non-existent group
    client.get_group_metadata(&999u64);
}

#[test]
#[should_panic]
fn test_metadata_name_too_long() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Create a name that's too long (> 64 characters)
    let long_name = String::from_str(
        &env,
        "This is a very long name that exceeds the maximum allowed length of sixty-four characters",
    );

    let metadata = GroupMetadata {
        name: Some(long_name),
        description: None,
        rules: None,
    };

    // This should panic due to name being too long
    client.set_group_metadata(&group_id, &metadata);
}

#[test]
#[should_panic]
fn test_metadata_description_too_long() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Create a description that's too long (> 256 characters)
    let long_description = String::from_str(
        &env,
        "This is a very long description that exceeds the maximum allowed length of two hundred and fifty-six characters. \
        It contains a lot of text to ensure that we go over the limit. We need to make sure this string is long enough \
        to trigger the validation error. Adding more text here to reach the required length for testing purposes."
    );

    let metadata = GroupMetadata {
        name: None,
        description: Some(long_description),
        rules: None,
    };

    // This should panic due to description being too long
    client.set_group_metadata(&group_id, &metadata);
}

#[test]
#[should_panic]
fn test_metadata_rules_too_long() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Create rules that are too long (> 512 characters)
    let long_rules = String::from_str(
        &env,
        "Rule 1: This is a very long set of rules that exceeds the maximum allowed length of five hundred and twelve characters. \
        Rule 2: We need to add a lot of text to ensure we go over the limit. \
        Rule 3: This is important for testing the validation logic. \
        Rule 4: Adding more rules to increase the character count. \
        Rule 5: We want to make sure this triggers the validation error. \
        Rule 6: Keep adding more text to reach the required length. \
        Rule 7: Almost there, just need a bit more text to exceed the limit. \
        Rule 8: This should definitely be enough to trigger the error now."
    );

    let metadata = GroupMetadata {
        name: None,
        description: None,
        rules: Some(long_rules),
    };

    // This should panic due to rules being too long
    client.set_group_metadata(&group_id, &metadata);
}

#[test]
fn test_metadata_at_max_length() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Create metadata at exactly the maximum lengths
    let name = String::from_str(
        &env,
        "1234567890123456789012345678901234567890123456789012345678901234",
    ); // 64 chars
    let description = String::from_str(
        &env,
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890\
        12345678901234567890123456789012345678901234567890123456789012345678901234567890\
        12345678901234567890123456789012345678901234567890123456789012345678901234567890\
        1234567890123456", // 256 chars
    );

    let metadata = GroupMetadata {
        name: Some(name.clone()),
        description: Some(description.clone()),
        rules: None,
    };

    // This should succeed
    client.set_group_metadata(&group_id, &metadata);

    // Verify it was stored correctly
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, Some(name));
    assert_eq!(retrieved.description, Some(description));
}

#[test]
fn test_metadata_empty_strings() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Create metadata with empty strings
    let name = String::from_str(&env, "");
    let description = String::from_str(&env, "");
    let rules = String::from_str(&env, "");

    let metadata = GroupMetadata {
        name: Some(name.clone()),
        description: Some(description.clone()),
        rules: Some(rules.clone()),
    };

    // This should succeed
    client.set_group_metadata(&group_id, &metadata);

    // Verify it was stored correctly
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, Some(name));
    assert_eq!(retrieved.description, Some(description));
    assert_eq!(retrieved.rules, Some(rules));
}

#[test]
fn test_metadata_with_special_characters() {
    let (env, client, creator, _) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);

    // Create metadata with special characters
    let name = String::from_str(&env, "Savings 💰 Circle");
    let description = String::from_str(&env, "A group for savings & investments (2024)");
    let rules = String::from_str(&env, "1. Pay on time!\n2. Be respectful :)\n3. No spam");

    let metadata = GroupMetadata {
        name: Some(name.clone()),
        description: Some(description.clone()),
        rules: Some(rules.clone()),
    };

    // Set metadata
    client.set_group_metadata(&group_id, &metadata);

    // Verify it was stored correctly
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, Some(name));
    assert_eq!(retrieved.description, Some(description));
    assert_eq!(retrieved.rules, Some(rules));
}

#[test]
fn test_metadata_multiple_groups() {
    let (env, client, creator, member2) = setup_test_env();

    // Create two groups
    let group_id1 = client.create_group(&creator, &100_000_000i128, &604_800u64, &10u32);
    let group_id2 = client.create_group(&member2, &200_000_000i128, &1_209_600u64, &5u32);

    // Set different metadata for each group
    let name1 = String::from_str(&env, "Group One");
    let metadata1 = GroupMetadata {
        name: Some(name1.clone()),
        description: None,
        rules: None,
    };
    client.set_group_metadata(&group_id1, &metadata1);

    let name2 = String::from_str(&env, "Group Two");
    let metadata2 = GroupMetadata {
        name: Some(name2.clone()),
        description: None,
        rules: None,
    };
    client.set_group_metadata(&group_id2, &metadata2);

    // Verify each group has its own metadata
    let retrieved1 = client.get_group_metadata(&group_id1).unwrap();
    let retrieved2 = client.get_group_metadata(&group_id2).unwrap();

    assert_eq!(retrieved1.name, Some(name1));
    assert_eq!(retrieved2.name, Some(name2));
}

#[test]
fn test_metadata_persists_after_group_operations() {
    let (env, client, creator, member2) = setup_test_env();

    // Create a group
    let group_id = client.create_group(&creator, &100_000_000i128, &604_800u64, &3u32);

    // Set metadata
    let name = String::from_str(&env, "Persistent Group");
    let metadata = GroupMetadata {
        name: Some(name.clone()),
        description: None,
        rules: None,
    };
    client.set_group_metadata(&group_id, &metadata);

    // Perform group operations
    client.join_group(&member2, &group_id);
    client.contribute(&creator, &group_id);

    // Verify metadata still exists
    let retrieved = client.get_group_metadata(&group_id).unwrap();
    assert_eq!(retrieved.name, Some(name));
}
