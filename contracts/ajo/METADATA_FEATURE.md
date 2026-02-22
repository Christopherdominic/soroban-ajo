# Group Metadata Feature

## Overview

The Group Metadata feature allows group creators to add optional human-readable information to their Ajo groups. This enhances group discoverability, provides context for members, and improves the overall user experience.

## Features

### GroupMetadata Struct

The `GroupMetadata` struct contains three optional fields:

```rust
pub struct GroupMetadata {
    pub name: Option<String>,        // Max 64 characters
    pub description: Option<String>, // Max 256 characters
    pub rules: Option<String>,       // Max 512 characters
}
```

### Size Limits

To prevent storage abuse and ensure reasonable gas costs:

- **Name**: Maximum 64 characters
- **Description**: Maximum 256 characters
- **Rules**: Maximum 512 characters

These limits are enforced at the contract level and will return specific errors if exceeded.

## Contract Functions

### set_group_metadata

Sets or updates metadata for a group.

**Signature:**
```rust
pub fn set_group_metadata(
    env: Env,
    group_id: u64,
    metadata: GroupMetadata,
) -> Result<(), AjoError>
```

**Authorization:**
- Only the group creator can set or update metadata
- Requires authentication via `require_auth()`

**Errors:**
- `GroupNotFound` - If the group does not exist
- `Unauthorized` - If caller is not the group creator
- `MetadataNameTooLong` - If name exceeds 64 characters
- `MetadataDescriptionTooLong` - If description exceeds 256 characters
- `MetadataRulesTooLong` - If rules exceed 512 characters

**Example:**
```rust
let metadata = GroupMetadata {
    name: Some(String::from_str(&env, "Monthly Savings Circle")),
    description: Some(String::from_str(&env, "A group for monthly savings")),
    rules: Some(String::from_str(&env, "Contribute by the 1st of each month")),
};

client.set_group_metadata(&group_id, &metadata)?;
```

### get_group_metadata

Retrieves metadata for a group.

**Signature:**
```rust
pub fn get_group_metadata(
    env: Env,
    group_id: u64,
) -> Result<Option<GroupMetadata>, AjoError>
```

**Returns:**
- `Some(GroupMetadata)` if metadata has been set
- `None` if no metadata has been set (this is not an error)

**Errors:**
- `GroupNotFound` - If the group does not exist

**Example:**
```rust
match client.get_group_metadata(&group_id)? {
    Some(metadata) => {
        // Use metadata
        if let Some(name) = metadata.name {
            println!("Group name: {}", name);
        }
    },
    None => {
        println!("No metadata set for this group");
    }
}
```

## Storage

Metadata is stored separately from the core group data using the storage key pattern:

```rust
("METADATA", group_id) -> GroupMetadata
```

This separation keeps the main `Group` struct lean and allows metadata to be truly optional.

## Events

When metadata is set or updated, a `metadata` event is emitted:

```rust
topics: ("metadata", group_id)
data: (updater_address)
```

## Error Codes

Three new error codes were added:

- `MetadataNameTooLong = 21` - Name exceeds 64 characters
- `MetadataDescriptionTooLong = 22` - Description exceeds 256 characters
- `MetadataRulesTooLong = 23` - Rules exceed 512 characters

## Use Cases

### 1. Group Discovery
```rust
let metadata = GroupMetadata {
    name: Some(String::from_str(&env, "Tech Workers Savings")),
    description: Some(String::from_str(&env, "For software engineers and tech professionals")),
    rules: None,
};
```

### 2. Setting Expectations
```rust
let metadata = GroupMetadata {
    name: Some(String::from_str(&env, "Strict Monthly Ajo")),
    description: None,
    rules: Some(String::from_str(&env, 
        "1. Contribute by the 1st of each month\n\
         2. No late payments accepted\n\
         3. Respect payout order"
    )),
};
```

### 3. Partial Metadata
```rust
// Only set a name
let metadata = GroupMetadata {
    name: Some(String::from_str(&env, "Quick Savings")),
    description: None,
    rules: None,
};
```

## Testing

The feature includes comprehensive tests covering:

- ✅ Setting and retrieving metadata
- ✅ Partial field updates
- ✅ Metadata updates (overwriting)
- ✅ Size limit validation (all three fields)
- ✅ Empty strings
- ✅ Special characters and Unicode
- ✅ Multiple groups with different metadata
- ✅ Metadata persistence across group operations
- ✅ Error cases (group not found, size limits)

Run tests with:
```bash
cargo test metadata
```

## Security Considerations

1. **Authorization**: Only the group creator can set metadata, enforced by `require_auth()`
2. **Size Limits**: Strict limits prevent storage abuse and DoS attacks
3. **Validation**: All inputs are validated before storage
4. **Separation**: Metadata is stored separately from critical group data
5. **Optional**: Groups can function perfectly without metadata

## Performance

- **Storage**: Minimal overhead - only stored when explicitly set
- **Gas Cost**: Validation is O(1) for each field
- **Retrieval**: Single storage read operation

## Migration

This feature is backward compatible:
- Existing groups continue to work without metadata
- No migration required for existing groups
- Metadata can be added to any group at any time by the creator

## Future Enhancements

Potential future improvements:
- Allow metadata updates by group admins (if admin system is added)
- Add more fields (tags, category, image URL, etc.)
- Implement metadata search/filtering
- Add metadata versioning/history
