# Group Metadata - Quick Start Guide

## 🚀 5-Minute Quick Start

### What is Group Metadata?

Optional human-readable information (name, description, rules) that group creators can add to their Ajo groups.

### Key Features
- ✅ Optional (no cost if not used)
- ✅ Only creator can set/update
- ✅ Size limits enforced
- ✅ Persists across group lifecycle

## 📝 Basic Usage

### 1. Set Metadata (Creator Only)

```rust
use soroban_sdk::String;

// Create metadata
let metadata = GroupMetadata {
    name: String::from_str(&env, "Savings Circle"),
    description: String::from_str(&env, "Monthly community savings group"),
    rules: String::from_str(&env, "1. Contribute on time\n2. Be respectful"),
};

// Set metadata (only creator can do this)
client.set_group_metadata(&creator, &group_id, &metadata);
```

### 2. Get Metadata (Anyone)

```rust
// Get metadata
let metadata = client.get_group_metadata(&group_id);

// Check if metadata exists
if let Some(meta) = metadata {
    println!("Group: {}", meta.name);
    println!("Description: {}", meta.description);
    println!("Rules: {}", meta.rules);
} else {
    println!("No metadata set for this group");
}
```

## 📏 Size Limits

| Field | Maximum Length |
|-------|----------------|
| Name | 64 characters |
| Description | 256 characters |
| Rules | 512 characters |

**Tip**: Validate lengths client-side before submitting!

## ⚠️ Common Errors

### MetadataNameTooLong
```rust
// ❌ Too long (65 chars)
name: String::from_str(&env, &"A".repeat(65))

// ✅ Valid (64 chars)
name: String::from_str(&env, &"A".repeat(64))
```

### Unauthorized
```rust
// ❌ Non-creator trying to set metadata
client.set_group_metadata(&member, &group_id, &metadata);
// Error: Unauthorized

// ✅ Creator setting metadata
client.set_group_metadata(&creator, &group_id, &metadata);
```

### GroupNotFound
```rust
// ❌ Invalid group ID
client.get_group_metadata(&999);
// Error: GroupNotFound

// ✅ Valid group ID
client.get_group_metadata(&group_id);
```

## 🎯 Best Practices

### 1. Keep It Concise
```rust
// ✅ Good
name: "Community Savings"
description: "Monthly savings for emergencies"
rules: "1. Pay on time\n2. Be respectful"

// ❌ Too verbose
name: "The Official Community Savings Circle Group for..."
description: "This is a group that was created in 2024 for the purpose of..."
rules: "Rule number one is that all members must..."
```

### 2. Validate Client-Side
```typescript
// Frontend validation
if (name.length > 64) {
  alert('Name must be 64 characters or less');
  return;
}
```

### 3. Handle Missing Metadata
```rust
// Always check for None
match client.get_group_metadata(&group_id) {
    Some(meta) => display_metadata(meta),
    None => display_default_ui(),
}
```

### 4. Update Carefully
```rust
// Metadata updates overwrite previous values
// Make sure you want to replace, not append
client.set_group_metadata(&creator, &group_id, &new_metadata);
```

## 🧪 Testing

### Run Metadata Tests
```bash
cd contracts/ajo
cargo test --test metadata_tests
```

### Expected Output
```
running 13 tests
test result: ok. 13 passed; 0 failed
```

## 📚 Examples

### Example 1: Simple Group
```rust
let metadata = GroupMetadata {
    name: String::from_str(&env, "Friends Savings"),
    description: String::from_str(&env, "Saving for vacation"),
    rules: String::from_str(&env, "Contribute monthly"),
};
```

### Example 2: Detailed Group
```rust
let metadata = GroupMetadata {
    name: String::from_str(&env, "Community Emergency Fund"),
    description: String::from_str(&env, "Building a shared emergency fund for unexpected expenses. Open to all community members."),
    rules: String::from_str(&env, "1. Contribute by the 5th of each month\n2. Respect all members\n3. No late payments without notice\n4. Emergency use only"),
};
```

### Example 3: Minimal Group
```rust
let metadata = GroupMetadata {
    name: String::from_str(&env, "Quick Save"),
    description: String::from_str(&env, ""),
    rules: String::from_str(&env, ""),
};
```

## 🔧 Frontend Integration

### TypeScript/JavaScript Example
```typescript
// Set metadata
await contract.set_group_metadata({
  creator: creatorAddress,
  group_id: groupId,
  metadata: {
    name: "Savings Circle",
    description: "Monthly community savings",
    rules: "1. Contribute on time\n2. Be respectful"
  }
});

// Get metadata
const metadata = await contract.get_group_metadata({
  group_id: groupId
});

if (metadata) {
  console.log(`Group: ${metadata.name}`);
} else {
  console.log('No metadata available');
}
```

### React Component Example
```tsx
function GroupMetadata({ groupId }) {
  const [metadata, setMetadata] = useState(null);
  
  useEffect(() => {
    async function fetchMetadata() {
      const meta = await contract.get_group_metadata({ group_id: groupId });
      setMetadata(meta);
    }
    fetchMetadata();
  }, [groupId]);
  
  if (!metadata) {
    return <div>No group information available</div>;
  }
  
  return (
    <div>
      <h2>{metadata.name}</h2>
      <p>{metadata.description}</p>
      <pre>{metadata.rules}</pre>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Problem: "Unauthorized" error
**Solution**: Only the group creator can set metadata. Verify you're using the creator's address.

### Problem: "MetadataNameTooLong" error
**Solution**: Name must be 64 characters or less. Trim your string.

### Problem: Metadata returns None
**Solution**: Metadata hasn't been set yet. It's optional - not all groups have it.

### Problem: Can't update metadata
**Solution**: Updates overwrite previous values. Make sure you're the creator and the group exists.

## 📖 Further Reading

- **Full Documentation**: See `METADATA_FEATURE.md`
- **Security Review**: See `METADATA_SECURITY_REVIEW.md`
- **Implementation Details**: See `METADATA_IMPLEMENTATION_SUMMARY.md`
- **Complete Report**: See `METADATA_FINAL_REPORT.md`

## 💡 Tips & Tricks

1. **Empty strings are valid**: You can set empty description or rules if not needed
2. **Special characters work**: Emojis, newlines, etc. are all supported
3. **Metadata is optional**: Don't force users to set it
4. **Updates are atomic**: Either all fields update or none do
5. **Events are emitted**: Listen for metadata_set events to track changes

## ✅ Checklist for Implementation

- [ ] Understand size limits (64/256/512)
- [ ] Validate input client-side
- [ ] Handle None case gracefully
- [ ] Only allow creator to set metadata
- [ ] Sanitize for display (XSS prevention)
- [ ] Test with edge cases
- [ ] Monitor metadata_set events

## 🎓 Common Patterns

### Pattern 1: Set Metadata After Group Creation
```rust
// Create group
let group_id = client.create_group(&creator, &amount, &duration, &max_members);

// Set metadata
let metadata = GroupMetadata { /* ... */ };
client.set_group_metadata(&creator, &group_id, &metadata);
```

### Pattern 2: Update Metadata
```rust
// Get current metadata
let current = client.get_group_metadata(&group_id);

// Create updated metadata
let updated = GroupMetadata {
    name: String::from_str(&env, "New Name"),
    description: current.unwrap().description, // Keep old description
    rules: String::from_str(&env, "Updated rules"),
};

// Update
client.set_group_metadata(&creator, &group_id, &updated);
```

### Pattern 3: Display with Fallback
```rust
let metadata = client.get_group_metadata(&group_id);
let display_name = metadata
    .as_ref()
    .map(|m| m.name.clone())
    .unwrap_or_else(|| String::from_str(&env, "Unnamed Group"));
```

## 🚦 Quick Reference

| Action | Function | Who Can Call |
|--------|----------|--------------|
| Set metadata | `set_group_metadata` | Creator only |
| Get metadata | `get_group_metadata` | Anyone |
| Update metadata | `set_group_metadata` | Creator only |

| Error | Meaning | Solution |
|-------|---------|----------|
| `Unauthorized` | Not the creator | Use creator address |
| `MetadataNameTooLong` | Name > 64 chars | Shorten name |
| `MetadataDescriptionTooLong` | Description > 256 chars | Shorten description |
| `MetadataRulesTooLong` | Rules > 512 chars | Shorten rules |
| `GroupNotFound` | Invalid group ID | Check group exists |

---

**Need Help?** Check the full documentation in `METADATA_FEATURE.md`
