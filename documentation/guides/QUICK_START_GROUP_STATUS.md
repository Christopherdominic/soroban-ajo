# Quick Start: Using get_group_status

## Basic Usage

```rust
// Get comprehensive group status
let status = client.get_group_status(&group_id);

// Check if group is complete
if status.is_complete {
    println!("Group finished!");
    return;
}

// Display current state
println!("Cycle: {}", status.current_cycle);
println!("Contributions: {}/{}", 
    status.contributions_received, 
    status.total_members
);
```

## Common Patterns

### Check if User Needs to Contribute

```rust
let status = client.get_group_status(&group_id);

if !status.is_cycle_active {
    println!("Cycle has ended. Waiting for payout.");
} else if status.pending_contributors.contains(&user_address) {
    println!("You need to contribute!");
} else {
    println!("You've already contributed this cycle.");
}
```

### Display Next Recipient

```rust
let status = client.get_group_status(&group_id);

if status.has_next_recipient {
    println!("Next payout goes to: {}", status.next_recipient);
} else {
    println!("Group is complete - no more payouts.");
}
```

### Show Time Remaining

```rust
let status = client.get_group_status(&group_id);

if status.is_cycle_active {
    let remaining = status.cycle_end_time - status.current_time;
    let hours = remaining / 3600;
    let minutes = (remaining % 3600) / 60;
    println!("Time remaining: {}h {}m", hours, minutes);
}
```

### List Pending Contributors

```rust
let status = client.get_group_status(&group_id);

println!("Waiting for {} members:", status.pending_contributors.len());
for member in status.pending_contributors.iter() {
    println!("  - {}", member);
}
```

### Check if Ready for Payout

```rust
let status = client.get_group_status(&group_id);

let ready_for_payout = 
    status.contributions_received == status.total_members &&
    !status.is_complete;

if ready_for_payout {
    println!("All contributions received! Ready to execute payout.");
}
```

## Error Handling

```rust
match client.try_get_group_status(&group_id) {
    Ok(status) => {
        // Use status
    },
    Err(Ok(AjoError::GroupNotFound)) => {
        println!("Group doesn't exist");
    },
    Err(e) => {
        println!("Error: {:?}", e);
    }
}
```

## Important Notes

1. **Always check `has_next_recipient`** before using `next_recipient`
2. **Use `is_cycle_active`** to determine if contributions are still accepted
3. **Compare `contributions_received` with `total_members`** to check completion
4. **The `pending_contributors` list** is computed fresh each call
5. **All timestamps are in seconds** since Unix epoch

## Testing

```bash
# Run group status tests
cargo test --test group_status_tests

# Run specific test
cargo test test_group_status_initial_state

# Run all tests
cargo test
```
