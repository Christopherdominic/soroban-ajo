# Cycle Timing Validation - Quick Reference

## Overview
The contract now enforces cycle timing windows. Contributions are only accepted during the active cycle period.

## Cycle Window Rules

### Valid Contribution Window
```
cycle_start <= current_time < cycle_end
```

Where:
- `cycle_start` = `group.cycle_start_time`
- `cycle_end` = `cycle_start + group.cycle_duration`

### Important Notes
- The cycle end is **exclusive** (contributions at exact end time are rejected)
- Each new cycle resets the window (starts fresh after `execute_payout()`)
- First cycle starts at group creation time

## Error Handling

### New Error: `OutsideCycleWindow`
Returned when a contribution is attempted outside the active cycle window.

```rust
// Example error scenario
let result = client.try_contribute(&member, &group_id);
match result {
    Ok(_) => println!("Contribution accepted"),
    Err(AjoError::OutsideCycleWindow) => println!("Contribution rejected - outside cycle window"),
    Err(e) => println!("Other error: {:?}", e),
}
```

## Helper Functions

### `get_cycle_window(group: &Group, current_time: u64) -> (u64, u64)`
Returns the start and end timestamps for the current cycle.

```rust
let (start, end) = utils::get_cycle_window(&group, current_time);
println!("Cycle window: {} to {}", start, end);
```

### `is_within_cycle_window(group: &Group, current_time: u64) -> bool`
Checks if the current time is within the active cycle window.

```rust
if utils::is_within_cycle_window(&group, current_time) {
    // Contribution will be accepted
} else {
    // Contribution will be rejected
}
```

## Example Scenarios

### Scenario 1: Valid Contribution
```rust
// Group created at timestamp 1000, cycle duration 604800 (1 week)
// Current time: 1000 + 300000 (within 1 week)
client.contribute(&member, &group_id); // ✅ Success
```

### Scenario 2: Late Contribution
```rust
// Group created at timestamp 1000, cycle duration 604800 (1 week)
// Current time: 1000 + 604801 (1 second past deadline)
client.contribute(&member, &group_id); // ❌ OutsideCycleWindow
```

### Scenario 3: Boundary Condition
```rust
// Group created at timestamp 1000, cycle duration 604800
// Current time: 1000 + 604800 (exactly at end)
client.contribute(&member, &group_id); // ❌ OutsideCycleWindow (exclusive end)
```

### Scenario 4: New Cycle
```rust
// Complete first cycle
client.contribute(&member1, &group_id);
client.contribute(&member2, &group_id);
client.execute_payout(&group_id); // Resets cycle_start_time

// New cycle starts immediately
client.contribute(&member1, &group_id); // ✅ Success (new window)
```

## Testing

Run the test suite to verify cycle timing validation:

```bash
cd contracts/ajo
cargo test test_contribution_within_cycle_window
cargo test test_contribution_after_cycle_ends
cargo test test_contribution_late
cargo test test_contribution_at_cycle_boundary
cargo test test_new_cycle_resets_window
```

## Integration Checklist

When integrating this feature:

- [ ] Handle `OutsideCycleWindow` error in your UI/client
- [ ] Display cycle end time to users
- [ ] Show time remaining in current cycle
- [ ] Warn users when cycle is about to end
- [ ] Consider time zones when displaying deadlines
- [ ] Test with various cycle durations (daily, weekly, monthly)

## Common Questions

**Q: What happens if I try to contribute after the cycle ends?**  
A: The transaction will fail with `OutsideCycleWindow` error.

**Q: Can I contribute at the exact cycle end time?**  
A: No, the cycle end is exclusive. You must contribute before `cycle_start + cycle_duration`.

**Q: Does the cycle window reset after payout?**  
A: Yes, `execute_payout()` updates `cycle_start_time` to the current timestamp, starting a fresh window.

**Q: What if not all members contribute before the cycle ends?**  
A: The cycle window is enforced, but payout execution is separate. If the cycle ends with incomplete contributions, payout cannot be executed until the next cycle (this may require additional logic in future versions).

## Future Enhancements

Potential improvements for future versions:
- Grace period after cycle ends
- Penalty for late contributions
- Automatic cycle advancement
- Configurable cycle windows per group
