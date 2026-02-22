# Group Metadata Feature

## Overview

The Group Metadata feature allows group creators to add optional human-readable information to their Ajo groups, improving discoverability and user experience in the frontend.

## Feature Details

### Data Structure

```rust
pub struct GroupMetadata {
    pub name: String,        // max 64 characters
    pub description: String, // max 256 characters
    pub rules: String,       // max 512 characters
}
```

### Size Limits

To ensure efficient storage and prevent abuse, the following limits are enforced:

- **Name**: Maximum 64 characters
- **Description**: Maximum 256 characters
- **Rules**: Maximum 512 characters

These limits are defined as constants in `types.rs`:
```rust
pub const MAX_NAME_LENGTH: u32 = 64;
pub const MAX_DESCRIPTION_LENGTH: u32 = 256;
pub const MAX_RULES_LENGTH: u32 = 512;
```

### Contract Functions

#### `set_group_metadata`

Sets or updates metadata for a group. Only the group creator can set metadata.

**Parameters:**
- `creator: Address` - The group creator (must match group creator)
- `group_id: u64` - The group to set metadata for
- `metadata: GroupMetadata` - The metadata to store

**Errors:**
- `GroupNotFound` - If the group does not exist
- `Unauthorized` - If caller is not the group creator
- `MetadataNameTooLong` - If name exceeds 64 characters
- `MetadataDescriptionTooLong` - If description exceeds 256 characters
- `MetadataRulesTooLong` - If rules exceed 512 characters

**Example:**
```rust
let metadata = GroupMetadata {
    name: String::from_str(&env, "Community Savings Circle"),
    description: String::from_str(&env, "Monthly savings group for local community members"),
    rules: String::from_str(&env, "1. Contribute on time\n2. Respect all members\n3. No late payments"),
};

client.set_group_metadata(&creator, &group_id, &metadata);
```

#### `get_group_metadata`

Retrieves metadata for a group if it has been set.

**Parameters:**
- `group_id: u64` - The group to get metadata for

**Returns:**
- `Option<GroupMetadata>` - The metadata if set, None otherwise

**Errors:**
- `GroupNotFound` - If the group does not exist

**Example:**
```rust
let metadata = client.get_group_metadata(&group_id);
if let Some(meta) = metadata {
    println!("Group name: {}", meta.name);
}
```

## Storage Implementation

Metadata is stored separately from the main Group struct using a dedicated storage key:

```rust
StorageKey::Metadata(group_id) -> GroupMetadata
```

This design:
- Keeps the core Group struct lean
- Allows metadata to be optional
- Enables independent updates without affecting group state
- Uses persistent storage for durability

## Security Considerations

### Authorization
- Only the group creator can set or update metadata
- `require_auth()` is called to verify the caller's identity
- Unauthorized attempts return `AjoError::Unauthorized`

### Input Validation
- All metadata fields are validated against size limits before storage
- Validation occurs in `utils::validate_metadata()`
- Exceeding limits returns specific error codes

### Storage Safety
- Metadata is stored in persistent storage (survives contract upgrades)
- Each group's metadata is isolated using unique keys
- No risk of metadata collision between groups

## Events

When metadata is set, an event is emitted:

```rust
emit_metadata_set(env, group_id, &metadata.name);
```

This allows frontends to:
- Track metadata changes
- Update UI in real-time
- Build search indexes

## Testing

Comprehensive test coverage includes:

### Basic Operations
- ✅ Set and retrieve metadata
- ✅ Get metadata before setting (returns None)
- ✅ Update existing metadata

### Authorization
- ✅ Non-creator cannot set metadata (Unauthorized error)

### Validation
- ✅ Name exceeding 64 chars fails
- ✅ Description exceeding 256 chars fails
- ✅ Rules exceeding 512 chars fails
- ✅ Metadata at exact max lengths succeeds

### Edge Cases
- ✅ Empty strings are valid
- ✅ Special characters and emojis work
- ✅ Metadata for nonexistent group fails
- ✅ Metadata persists across group lifecycle
- ✅ Multiple groups have independent metadata

## Frontend Integration

### Display Group Information

```typescript
// Fetch group metadata
const metadata = await contract.get_group_metadata({ group_id });

if (metadata) {
  console.log(`Group: ${metadata.name}`);
  console.log(`Description: ${metadata.description}`);
  console.log(`Rules: ${metadata.rules}`);
}
```

### Create Group with Metadata

```typescript
// Create group
const group_id = await contract.create_group({
  creator,
  contribution_amount,
  cycle_duration,
  max_members
});

// Set metadata
await contract.set_group_metadata({
  creator,
  group_id,
  metadata: {
    name: "Savings Circle",
    description: "Monthly community savings",
    rules: "Be respectful and contribute on time"
  }
});
```

### Search and Discovery

Metadata enables:
- Group name search
- Category filtering (via description)
- Rule-based filtering
- Enhanced group listings

## Performance Considerations

### Storage Costs
- Metadata is optional - groups without metadata incur no extra cost
- Separate storage key allows lazy loading
- Size limits prevent excessive storage usage

### Gas Optimization
- Validation happens before storage write
- Single storage operation per metadata update
- No impact on core group operations

## Migration Path

Existing groups:
- Continue to work without metadata
- Can add metadata at any time
- No breaking changes to existing functionality

## Best Practices

### For Group Creators

1. **Name**: Keep it short and descriptive (< 64 chars)
   - ✅ "Community Savings Circle"
   - ❌ "This is a very long name that describes everything about our group..."

2. **Description**: Provide clear purpose (< 256 chars)
   - ✅ "Monthly savings group for local community members to build emergency funds"
   - ❌ Entire group history and member biographies

3. **Rules**: Be concise and clear (< 512 chars)
   - ✅ "1. Contribute by the 5th\n2. Respect all members\n3. No late payments"
   - ❌ Legal document with every possible scenario

### For Frontend Developers

1. **Validate before submission**: Check lengths client-side
2. **Handle None gracefully**: Not all groups have metadata
3. **Cache metadata**: Reduce contract calls
4. **Show character counts**: Help users stay within limits

## Error Handling

```typescript
try {
  await contract.set_group_metadata({ creator, group_id, metadata });
} catch (error) {
  if (error.includes('MetadataNameTooLong')) {
    alert('Name must be 64 characters or less');
  } else if (error.includes('Unauthorized')) {
    alert('Only the group creator can set metadata');
  }
}
```

## Future Enhancements

Potential additions:
- Tags/categories for better discovery
- Image URLs for group avatars
- Social media links
- Multilingual support
- Metadata versioning/history

## Files Modified

- `src/types.rs` - Added GroupMetadata struct and constants
- `src/errors.rs` - Added metadata validation errors
- `src/storage.rs` - Added metadata storage functions
- `src/contract.rs` - Added set/get metadata functions
- `src/utils.rs` - Added metadata validation
- `src/events.rs` - Added metadata event emission
- `tests/metadata_tests.rs` - Comprehensive test suite
- `tests/mod.rs` - Registered metadata tests

## Conclusion

The Group Metadata feature enhances the Ajo contract by enabling rich, user-facing information while maintaining:
- Security through authorization checks
- Efficiency through size limits
- Flexibility through optional storage
- Reliability through comprehensive testing
