# Cycle Timing Validation Implementation

## Summary
Implemented cycle timing validation to reject contributions outside the active cycle window.

## Changes Made

### 1. Error Handling (`contracts/ajo/src/errors.rs`)
- Added `OutsideCycleWindow = 16` error variant
- Used when contributions are attempted outside the active cycle window

### 2. Helper Functions (`contracts/ajo/src/utils.rs`)
Added two new helper functions:

#### `get_cycle_window(group: &Group, current_time: u64) -> (u64, u64)`
- Computes cycle start and end timestamps
- Returns tuple of (cycle_start, cycle_end)
- Uses `group.cycle_start_time` and `group.cycle_duration`

#### `is_within_cycle_window(group: &Group, current_time: u64) -> bool`
- Validates if current time is within active cycle
- Returns true if: `current_time >= cycle_start && current_time < cycle_end`
- Note: Cycle end is exclusive (contributions at exact boundary are rejected)

### 3. Contract Logic (`contracts/ajo/src/contract.rs`)
Modified `contribute()` function:
- Added cycle window validation before accepting contributions
- Gets current timestamp using `utils::get_current_timestamp(&env)`
- Checks `utils::is_within_cycle_window(&group, current_time)`
- Returns `OutsideCycleWindow` error if validation fails
- Validation occurs after group completion and membership checks, but before contribution recording

### 4. Tests (`contracts/ajo/tests/ajo_flow.rs`)
Added 5 comprehensive test cases:

#### `test_contribution_within_cycle_window()`
- Verifies contributions work within the cycle window
- Tests immediate contribution and contribution after time advancement (5 days into 1-week cycle)

#### `test_contribution_after_cycle_ends()`
- Verifies contributions are rejected after cycle ends
- Advances time past cycle duration + 1 second
- Expects `OutsideCycleWindow` panic

#### `test_contribution_late()`
- Tests late contribution scenario
- Uses 1-day cycle, advances 1 day + 1 hour
- Expects `OutsideCycleWindow` panic

#### `test_contribution_at_cycle_boundary()`
- Tests exact boundary condition
- Advances to exactly cycle_duration seconds
- Verifies contribution fails (boundary is exclusive)

#### `test_new_cycle_resets_window()`
- Verifies cycle window resets after payout
- Completes first cycle, then tests contributions in second cycle
- Confirms new cycle has fresh timing window

## Validation Logic

```rust
// Cycle window calculation
cycle_start = group.cycle_start_time
cycle_end = cycle_start + group.cycle_duration

// Validation check
valid = current_time >= cycle_start && current_time < cycle_end
```

## Edge Cases Handled

1. **Exact boundary**: Contributions at `cycle_start + cycle_duration` are rejected (exclusive end)
2. **New cycle**: After `execute_payout()`, `cycle_start_time` is updated, resetting the window
3. **First cycle**: Window starts from group creation timestamp
4. **Time advancement**: Tests use `env.ledger().with_mut()` to simulate time passage

## Testing Strategy

- ✅ Valid contributions within window
- ✅ Invalid contributions after cycle ends
- ✅ Invalid contributions at exact boundary
- ✅ Late contributions (well past deadline)
- ✅ Cycle window reset after payout

## Wave Points: 150 (Medium - 5-7 hours)

## Files Modified
1. `contracts/ajo/src/errors.rs` - Added error variant
2. `contracts/ajo/src/utils.rs` - Added helper functions
3. `contracts/ajo/src/contract.rs` - Added validation logic
4. `contracts/ajo/tests/ajo_flow.rs` - Added comprehensive tests

## How to Test

```bash
cd contracts/ajo
cargo test
```

Expected output: All tests pass, including the 5 new cycle timing tests.

## Integration Notes

- The validation is minimal and efficient (2 simple comparisons)
- No breaking changes to existing API
- Backward compatible with existing groups
- Cycle window is automatically managed by the contract
