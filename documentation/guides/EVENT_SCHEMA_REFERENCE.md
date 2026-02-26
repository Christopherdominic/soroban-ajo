# Event Schema Quick Reference

## Event Structure

All Ajo contract events follow this pattern:

```rust
env.events().publish(
    (event_symbol, group_id, [optional_cycle]),  // Topics
    (data_fields...)                              // Payload
);
```

## Event Catalog

### 📝 Group Created
```rust
Topics:  ("created", group_id: u64)
Payload: (creator: Address, contribution_amount: i128, max_members: u32)
```
**When**: New group is created  
**Use**: Track group formation, initial parameters

---

### 👥 Member Joined
```rust
Topics:  ("joined", group_id: u64)
Payload: (member: Address)
```
**When**: Member joins existing group  
**Use**: Track membership changes, group growth

---

### 💰 Contribution Made
```rust
Topics:  ("contrib", group_id: u64, cycle: u32)
Payload: (member: Address, amount: i128)
```
**When**: Member contributes to current cycle  
**Use**: Track individual contributions, payment history

---

### 💸 Payout Executed
```rust
Topics:  ("payout", group_id: u64, cycle: u32)
Payload: (recipient: Address, amount: i128)
```
**When**: Payout distributed to member  
**Use**: Track fund distribution, verify payouts

---

### 🔄 Cycle Advanced
```rust
Topics:  ("cycle", group_id: u64)
Payload: (new_cycle: u32, cycle_start_time: u64)
```
**When**: Group moves to next cycle after payout  
**Use**: Track cycle progression, timing

---

### ✅ Group Completed
```rust
Topics:  ("complete", group_id: u64)
Payload: ()
```
**When**: All members received payout, group finished  
**Use**: Track group lifecycle completion

---

## Field Reference

| Field | Type | Events | Description |
|-------|------|--------|-------------|
| `group_id` | `u64` | ALL | Unique group identifier (always in topics) |
| `creator` | `Address` | created | Group creator address |
| `member` | `Address` | joined, contrib | Member performing action |
| `recipient` | `Address` | payout | Payout recipient address |
| `contribution_amount` | `i128` | created | Fixed contribution per cycle |
| `amount` | `i128` | contrib, payout | Transaction amount |
| `max_members` | `u32` | created | Maximum group size |
| `cycle` | `u32` | contrib, payout | Cycle number (in topics) |
| `new_cycle` | `u32` | cycle | New cycle number after advancement |
| `cycle_start_time` | `u64` | cycle | Timestamp when cycle started |

## Event Filtering Examples

### Get All Events for a Group
```rust
let group_events: Vec<_> = env.events().all()
    .iter()
    .filter(|e| {
        let topics: Vec<Val> = e.topics.clone().into_val(&env);
        if topics.len() >= 2 {
            let gid: u64 = topics.get(1).unwrap().into_val(&env);
            gid == target_group_id
        } else {
            false
        }
    })
    .collect();
```

### Get Contributions for a Cycle
```rust
let cycle_contribs: Vec<_> = env.events().all()
    .iter()
    .filter(|e| {
        let topics: Vec<Val> = e.topics.clone().into_val(&env);
        if topics.len() >= 3 {
            let symbol: Symbol = topics.get(0).unwrap().into_val(&env);
            let gid: u64 = topics.get(1).unwrap().into_val(&env);
            let cyc: u32 = topics.get(2).unwrap().into_val(&env);
            symbol == symbol_short!("contrib") && 
            gid == group_id && 
            cyc == cycle_number
        } else {
            false
        }
    })
    .collect();
```

### Get All Payouts
```rust
let payouts: Vec<_> = env.events().all()
    .iter()
    .filter(|e| {
        let topics: Vec<Val> = e.topics.clone().into_val(&env);
        if topics.len() > 0 {
            let symbol: Symbol = topics.get(0).unwrap().into_val(&env);
            symbol == symbol_short!("payout")
        } else {
            false
        }
    })
    .collect();
```

### Track Member Activity
```rust
let member_events: Vec<_> = env.events().all()
    .iter()
    .filter(|e| {
        let topics: Vec<Val> = e.topics.clone().into_val(&env);
        let symbol: Symbol = topics.get(0).unwrap().into_val(&env);
        
        match symbol {
            s if s == symbol_short!("joined") => {
                let addr: Address = e.data.clone().into_val(&env);
                addr == target_member
            },
            s if s == symbol_short!("contrib") => {
                let (addr, _): (Address, i128) = e.data.clone().into_val(&env);
                addr == target_member
            },
            s if s == symbol_short!("payout") => {
                let (addr, _): (Address, i128) = e.data.clone().into_val(&env);
                addr == target_member
            },
            _ => false
        }
    })
    .collect();
```

## Event Lifecycle Example

For a 3-member group completing one full cycle:

```
1. created   → (creator, 100_000_000, 3)
2. joined    → (member2)
3. joined    → (member3)
4. contrib   → (creator, 100_000_000)     [cycle 1]
5. contrib   → (member2, 100_000_000)     [cycle 1]
6. contrib   → (member3, 100_000_000)     [cycle 1]
7. payout    → (creator, 300_000_000)     [cycle 1]
8. cycle     → (2, timestamp)
9. contrib   → (creator, 100_000_000)     [cycle 2]
10. contrib  → (member2, 100_000_000)     [cycle 2]
11. contrib  → (member3, 100_000_000)     [cycle 2]
12. payout   → (member2, 300_000_000)     [cycle 2]
13. cycle    → (3, timestamp)
14. contrib  → (creator, 100_000_000)     [cycle 3]
15. contrib  → (member2, 100_000_000)     [cycle 3]
16. contrib  → (member3, 100_000_000)     [cycle 3]
17. payout   → (member3, 300_000_000)     [cycle 3]
18. complete → ()
```

## Integration Checklist

When integrating event monitoring:

- [ ] Subscribe to relevant event types
- [ ] Filter by group_id for group-specific tracking
- [ ] Parse event payloads according to schema
- [ ] Handle all event types in your listener
- [ ] Store events for audit trail
- [ ] Update UI based on events
- [ ] Handle event ordering (use timestamps)
- [ ] Test event parsing with all event types

## Common Patterns

### Calculate Total Contributions
```rust
let total: i128 = env.events().all()
    .iter()
    .filter(|e| matches_contrib_event(e, group_id))
    .map(|e| {
        let (_, amount): (Address, i128) = e.data.clone().into_val(&env);
        amount
    })
    .sum();
```

### Verify All Members Contributed
```rust
let contributors: HashSet<Address> = env.events().all()
    .iter()
    .filter(|e| matches_contrib_event(e, group_id, cycle))
    .map(|e| {
        let (member, _): (Address, i128) = e.data.clone().into_val(&env);
        member
    })
    .collect();

let all_contributed = contributors.len() == expected_member_count;
```

### Build Payout History
```rust
let payout_history: Vec<(Address, i128, u32)> = env.events().all()
    .iter()
    .filter(|e| matches_payout_event(e, group_id))
    .map(|e| {
        let topics: Vec<Val> = e.topics.clone().into_val(&env);
        let cycle: u32 = topics.get(2).unwrap().into_val(&env);
        let (recipient, amount): (Address, i128) = e.data.clone().into_val(&env);
        (recipient, amount, cycle)
    })
    .collect();
```

## Testing Events

```rust
#[test]
fn test_event_emission() {
    let (env, client, member, _, _) = setup_test_env();
    
    // Perform action
    let group_id = client.create_group(&member, &100_000_000, &604_800, &10);
    
    // Get events
    let events = env.events().all();
    let last_event = events.last().unwrap();
    
    // Verify topics
    assert_eq!(
        last_event.topics,
        (symbol_short!("created"), group_id).into_val(&env)
    );
    
    // Verify payload
    let (creator, amount, max): (Address, i128, u32) = 
        last_event.data.into_val(&env);
    assert_eq!(creator, member);
    assert_eq!(amount, 100_000_000);
    assert_eq!(max, 10);
}
```

## Best Practices

1. **Always include group_id** in topics for easy filtering
2. **Use consistent field ordering** in payloads
3. **Include amounts** for all financial events
4. **Add cycle info** to cycle-specific events
5. **Emit events after state changes** to ensure consistency
6. **Test event emission** for all state mutations
7. **Document event schemas** for integrators
8. **Version events** if schema changes in future
