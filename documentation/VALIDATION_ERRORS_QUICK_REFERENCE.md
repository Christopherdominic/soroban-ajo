# Validation Errors Quick Reference

## For Contributors & Developers

### When Creating a Group

The `create_group` function validates three parameters:

#### 1. Contribution Amount
```rust
// ❌ INVALID
contribution_amount: 0      // Error: ContributionAmountZero
contribution_amount: -100   // Error: ContributionAmountNegative

// ✅ VALID
contribution_amount: 1000   // Any positive i128 value
```

#### 2. Cycle Duration
```rust
// ❌ INVALID
cycle_duration: 0           // Error: CycleDurationZero

// ✅ VALID
cycle_duration: 86400       // Any positive u64 (seconds)
cycle_duration: 604800      // 1 week
```

#### 3. Max Members
```rust
// ❌ INVALID
max_members: 0              // Error: MaxMembersBelowMinimum
max_members: 1              // Error: MaxMembersBelowMinimum
max_members: 101            // Error: MaxMembersAboveLimit

// ✅ VALID
max_members: 2              // Minimum (2-100)
max_members: 10             // Typical small group
max_members: 100            // Maximum allowed
```

### When Joining a Group

```rust
// ❌ INVALID
// Trying to join when group already has max_members
join_group(group_id)        // Error: MaxMembersExceeded

// ✅ VALID
// Join when group has space
join_group(group_id)        // Success if members.len() < max_members
```

## Error Handling in Frontend

```typescript
// Example error handling
try {
  await contract.create_group(creator, amount, duration, maxMembers);
} catch (error) {
  switch (error.code) {
    case 9:  // ContributionAmountZero
      showError("Contribution amount must be greater than zero");
      break;
    case 17: // ContributionAmountNegative
      showError("Contribution amount cannot be negative");
      break;
    case 10: // CycleDurationZero
      showError("Cycle duration must be greater than zero");
      break;
    case 11: // MaxMembersBelowMinimum
      showError("Group must have at least 2 members");
      break;
    case 18: // MaxMembersAboveLimit
      showError("Group cannot exceed 100 members");
      break;
    case 2:  // MaxMembersExceeded
      showError("This group is full");
      break;
  }
}
```

## Testing Your Changes

```bash
# Test specific validation
cargo test test_invalid_contribution_amount_zero
cargo test test_invalid_cycle_duration_zero
cargo test test_max_members_below_minimum

# Test all validation errors
cargo test --test validation_tests

# Test entire contract
cargo test --package ajo
```

## Common Validation Patterns

### Validating User Input (Frontend)
```typescript
function validateGroupParams(amount, duration, maxMembers) {
  const errors = [];
  
  if (amount <= 0) {
    errors.push("Amount must be positive");
  }
  
  if (duration <= 0) {
    errors.push("Duration must be positive");
  }
  
  if (maxMembers < 2) {
    errors.push("Need at least 2 members");
  }
  
  if (maxMembers > 100) {
    errors.push("Cannot exceed 100 members");
  }
  
  return errors;
}
```

### Adding New Validation Rules

1. Add error variant to `errors.rs`:
```rust
pub enum AjoError {
    // ...
    YourNewError = 19,
}
```

2. Add validation logic to `utils.rs`:
```rust
pub fn validate_group_params(...) -> Result<(), AjoError> {
    if invalid_condition {
        return Err(AjoError::YourNewError);
    }
    Ok(())
}
```

3. Add test in `validation_tests.rs`:
```rust
#[test]
fn test_your_new_error() {
    let result = client.try_create_group(...);
    assert_eq!(result, Err(Ok(AjoError::YourNewError)));
}
```

## Why These Limits?

- **Min 2 members**: ROSCA requires rotation between multiple people
- **Max 100 members**: Prevents gas exhaustion from iterating over large member lists
- **Positive amounts**: Negative/zero contributions don't make economic sense
- **Positive duration**: Zero duration would cause immediate cycle completion
