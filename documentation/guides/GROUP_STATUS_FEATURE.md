# Group Status Feature

## Overview

The `get_group_status` function provides a comprehensive view of a group's current state in a single contract call. This eliminates the need for clients to make multiple separate calls to compute the group's status, reducing complexity and potential for errors.

## Function Signature

```rust
pub fn get_group_status(env: Env, group_id: u64) -> Result<GroupStatus, AjoError>
```

## GroupStatus Structure

```rust
pub struct GroupStatus {
    /// The group ID
    pub group_id: u64,
    
    /// Current cycle number
    pub current_cycle: u32,
    
    /// Address of the next recipient (check has_next_recipient first)
    pub next_recipient: Address,
    
    /// Whether there is a next recipient (false if group is complete)
    pub has_next_recipient: bool,
    
    /// Number of members who have contributed this cycle
    pub contributions_received: u32,
    
    /// Total number of members in the group
    pub total_members: u32,
    
    /// List of members who haven't contributed yet this cycle
    pub pending_contributors: Vec<Address>,
    
    /// Whether the group has completed all cycles
    pub is_complete: bool,
    
    /// Timestamp when current cycle started
    pub cycle_start_time: u64,
    
    /// Timestamp when current cycle ends
    pub cycle_end_time: u64,
    
    /// Current timestamp for reference
    pub current_time: u64,
    
    /// Whether the cycle window is still active
    pub is_cycle_active: bool,
}
```

## Use Cases

### 1. Dashboard Display
Clients can display comprehensive group information with a single call:
```rust
let status = client.get_group_status(&group_id);

println!("Group {} - Cycle {}/{}", 
    status.group_id, 
    status.current_cycle, 
    status.total_members
);

println!("Contributions: {}/{}", 
    status.contributions_received, 
    status.total_members
);

if status.has_next_recipient {
    println!("Next recipient: {}", status.next_recipient);
}
```

### 2. Contribution Progress Tracking
```rust
let status = client.get_group_status(&group_id);

if status.is_cycle_active {
    println!("Cycle active until: {}", status.cycle_end_time);
    println!("Pending contributors: {}", status.pending_contributors.len());
} else {
    println!("Cycle has ended. Waiting for payout execution.");
}
```

### 3. Group Completion Check
```rust
let status = client.get_group_status(&group_id);

if status.is_complete {
    println!("Group has completed all cycles!");
} else {
    println!("Current cycle: {}", status.current_cycle);
    println!("Progress: {}/{} contributions", 
        status.contributions_received, 
        status.total_members
    );
}
```

### 4. Member Notification System
```rust
let status = client.get_group_status(&group_id);

// Notify pending contributors
for member in status.pending_contributors.iter() {
    if status.is_cycle_active {
        let time_remaining = status.cycle_end_time - status.current_time;
        notify_member(member, format!(
            "Please contribute! {} seconds remaining", 
            time_remaining
        ));
    }
}
```

## Benefits

1. **Reduced Network Calls**: Single call instead of multiple separate queries
2. **Atomic State View**: All information is from the same ledger state
3. **Error Prevention**: Eliminates client-side computation errors
4. **Simplified Client Code**: Less complex state management logic needed
5. **Better UX**: Faster response times for dashboard updates

## Error Handling

The function returns `AjoError::GroupNotFound` if the group doesn't exist:

```rust
match client.try_get_group_status(&group_id) {
    Ok(status) => {
        // Process status
    },
    Err(Ok(AjoError::GroupNotFound)) => {
        println!("Group not found");
    },
    Err(e) => {
        println!("Unexpected error: {:?}", e);
    }
}
```

## Testing

Comprehensive tests cover:
- Initial group state
- Partial contributions
- Complete contributions
- After payout execution
- Mid-lifecycle states
- Completed groups
- Cycle timing and expiration
- Edge cases (single member, large groups)
- Consistency with other contract functions

Run tests with:
```bash
cargo test --test group_status_tests
```

## Implementation Notes

- The `next_recipient` field contains a placeholder address when `has_next_recipient` is false
- Always check `has_next_recipient` before using `next_recipient`
- The `pending_contributors` list is computed on-demand from storage
- Cycle timing is calculated using the group's `cycle_start_time` and `cycle_duration`
- The function is read-only and doesn't modify any state
