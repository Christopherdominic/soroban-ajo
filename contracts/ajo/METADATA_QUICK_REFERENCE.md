# Group Metadata - Quick Reference

## 🚀 Quick Start

### Setting Metadata

```rust
use soroban_sdk::String;
use soroban_ajo::GroupMetadata;

// Create metadata
let metadata = GroupMetadata {
    name: Some(String::from_str(&env, "My Savings Group")),
    description: Some(String::from_str(&env, "Monthly savings for emergencies")),
    rules: Some(String::from_str(&env, "Contribute by the 1st of each month")),
};

// Set metadata (only creator can do this)
client.set_group_metadata(&group_id, &metadata)?;
```

### Getting Metadata

```rust
// Get metadata
match client.get_group_metadata(&group_id)? {
    Some(metadata) => {
        // Metadata exists
        if let Some(name) = metadata.name {
            println!("Group: {}", name);
        }
    },
    None => {
        // No metadata set
        println!("No metadata");
    }
}
```

## 📏 Size Limits

| Field | Max Length | Error Code |
|-------|-----------|------------|
| Name | 64 chars | `MetadataNameTooLong` (21) |
| Description | 256 chars | `MetadataDescriptionTooLong` (22) |
| Rules | 512 chars | `MetadataRulesTooLong` (23) |

## 🔒 Authorization

- ✅ **Set**: Only group creator
- ✅ **Get**: Anyone (public read)

## ⚠️ Error Codes

```rust
GroupNotFound = 1                    // Group doesn't exist
Unauthorized = 15                    // Not the creator
MetadataNameTooLong = 21            // Name > 64 chars
MetadataDescriptionTooLong = 22     // Description > 256 chars
MetadataRulesTooLong = 23           // Rules > 512 chars
```

## 📝 Common Patterns

### Minimal Metadata (Name Only)
```rust
let metadata = GroupMetadata {
    name: Some(String::from_str(&env, "Quick Group")),
    description: None,
    rules: None,
};
```

### Full Metadata
```rust
let metadata = GroupMetadata {
    name: Some(String::from_str(&env, "Professional Savings Circle")),
    description: Some(String::from_str(&env, "For tech professionals building emergency funds")),
    rules: Some(String::from_str(&env, 
        "1. Contribute by the 1st\n\
         2. No late payments\n\
         3. Respect payout order"
    )),
};
```

### Updating Metadata
```rust
// Get existing metadata
let mut metadata = client.get_group_metadata(&group_id)?.unwrap_or_default();

// Update specific field
metadata.description = Some(String::from_str(&env, "Updated description"));

// Save
client.set_group_metadata(&group_id, &metadata)?;
```

## 🧪 Testing

```bash
# Run metadata tests
cargo test metadata

# Run all tests
cargo test

# Run specific test
cargo test test_set_and_get_metadata
```

## 🎯 Best Practices

### ✅ DO
- Keep names short and descriptive
- Use description for detailed information
- Use rules for member expectations
- Validate length before setting
- Handle None cases gracefully

### ❌ DON'T
- Don't exceed size limits
- Don't store sensitive information
- Don't use metadata for critical data
- Don't assume metadata always exists

## 🔍 Debugging

### Check if metadata exists
```rust
let has_metadata = client.get_group_metadata(&group_id)?.is_some();
```

### Validate before setting
```rust
let name = String::from_str(&env, "My Group");
if name.len() > 64 {
    return Err(AjoError::MetadataNameTooLong);
}
```

### Handle errors
```rust
match client.set_group_metadata(&group_id, &metadata) {
    Ok(_) => println!("Metadata set successfully"),
    Err(AjoError::MetadataNameTooLong) => println!("Name too long"),
    Err(AjoError::Unauthorized) => println!("Not the creator"),
    Err(e) => println!("Error: {:?}", e),
}
```

## 📊 Storage

- **Key**: `("METADATA", group_id)`
- **Type**: `GroupMetadata`
- **Location**: Persistent storage
- **Optional**: Yes (groups work without it)

## 🎪 Events

When metadata is set/updated:
```rust
Event {
    topics: ("metadata", group_id),
    data: (updater_address)
}
```

## 💡 Tips

1. **Start Simple**: Begin with just a name
2. **Be Concise**: Shorter is better for gas costs
3. **Update Anytime**: Metadata can be changed by creator
4. **Optional Fields**: Use only what you need
5. **Unicode Support**: Emojis and special chars work

## 🔗 Related Functions

- `create_group()` - Create a group (metadata can be added later)
- `get_group()` - Get group details (doesn't include metadata)
- `get_group_status()` - Get group status (doesn't include metadata)

## 📚 More Information

- Full documentation: `METADATA_FEATURE.md`
- Implementation details: `GROUP_METADATA_IMPLEMENTATION_SUMMARY.md`
- Contract source: `src/contract.rs`
