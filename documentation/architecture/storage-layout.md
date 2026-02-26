# Storage Layout

This document details the persistent storage structure of the Soroban Ajo contract.

## Overview

The contract uses Soroban's persistent storage to maintain:
- Group configurations
- Member lists
- Contribution tracking
- Payout records

## Storage Keys

### 1. Group Counter

**Key:** `GCOUNTER`  
**Type:** `u64`  
**Purpose:** Sequential ID generator for groups  

```rust
Symbol: "GCOUNTER"
Value: u64 (next available group ID)
```

**Operations:**
- Read when creating new group
- Increment after group creation
- Initialized to 0 (first group gets ID 1)

### 2. Group Data

**Key:** `(GROUP, group_id)`  
**Type:** `Group` struct  
**Purpose:** Store complete group configuration and state  

```rust
Key: (Symbol("GROUP"), u64)
Value: Group {
    id: u64,
    creator: Address,
    contribution_amount: i128,
    cycle_duration: u64,
    max_members: u32,
    members: Vec<Address>,
    current_cycle: u32,
    payout_index: u32,
    created_at: u64,
    cycle_start_time: u64,
    is_complete: bool,
}
```

**Operations:**
- Created when group is initialized
- Updated when:
  - Members join (members list grows)
  - Payout executes (cycle advances, payout_index increments)
  - Group completes (is_complete = true)

### 3. Contribution Records

**Key:** `(CONTRIB, group_id, cycle, member)`  
**Type:** `bool`  
**Purpose:** Track whether a member has contributed for a specific cycle  

```rust
Key: (Symbol("CONTRIB"), u64, u32, Address)
Value: bool (true = contributed, false/missing = not contributed)
```

**Operations:**
- Set to `true` when member contributes
- Read to verify contribution status before:
  - Additional contributions (prevent double-pay)
  - Payout execution (verify all contributed)
- Remains `true` permanently (historical record)

**Example keys for group 1, cycle 1:**
```
(CONTRIB, 1, 1, member1_addr) → true
(CONTRIB, 1, 1, member2_addr) → true
(CONTRIB, 1, 1, member3_addr) → false  // not yet contributed
```

### 4. Payout Records

**Key:** `(PAYOUT, group_id, member)`  
**Type:** `bool`  
**Purpose:** Track whether a member has received their payout  

```rust
Key: (Symbol("PAYOUT"), u64, Address)
Value: bool (true = received payout, false/missing = not received)
```

**Operations:**
- Set to `true` when payout is executed for a member
- Read to verify payout history
- Prevents duplicate payouts (safety check)

**Example keys for group 1:**
```
(PAYOUT, 1, member1_addr) → true   // received payout cycle 1
(PAYOUT, 1, member2_addr) → true   // received payout cycle 2
(PAYOUT, 1, member3_addr) → false  // not yet received
```

## Storage Patterns

### Group Creation Pattern

```
1. Read GCOUNTER → get next_id
2. Write GCOUNTER → next_id + 1
3. Write (GROUP, next_id) → new Group
4. Write (PAYOUT, next_id, creator) → false (implicit, for tracking)
```

### Join Group Pattern

```
1. Read (GROUP, group_id) → existing Group
2. Modify Group.members (add new member)
3. Write (GROUP, group_id) → updated Group
```

### Contribute Pattern

```
1. Read (GROUP, group_id) → get Group
2. Read (CONTRIB, group_id, current_cycle, member) → check if already contributed
3. [Perform payment]
4. Write (CONTRIB, group_id, current_cycle, member) → true
```

### Execute Payout Pattern

```
1. Read (GROUP, group_id) → get Group
2. For each member in Group.members:
   - Read (CONTRIB, group_id, current_cycle, member) → verify all true
3. Get recipient = Group.members[Group.payout_index]
4. [Perform payout]
5. Write (PAYOUT, group_id, recipient) → true
6. Modify Group (increment payout_index, cycle, or mark complete)
7. Write (GROUP, group_id) → updated Group
```

## Storage Cost Analysis

### Per Group

**Base Group Data:**
- Group struct: ~450 bytes
  - Addresses: 32 bytes × (1 creator + N members)
  - Numbers: 8-16 bytes each
  - Vectors: overhead + member addresses

**Example (10 members):**
- Group data: ~450 bytes
- Contribution records: 10 members × 10 cycles × ~80 bytes = ~8 KB
- Payout records: 10 members × ~80 bytes = ~800 bytes
- **Total: ~9.3 KB per completed 10-member group**

### Scaling Considerations

**100 Groups:**
- If each has 10 members: ~930 KB
- Soroban storage is persistent and paid for upfront
- Cost scales linearly with group count

**Optimization Strategies:**
1. Use compact keys (short symbols)
2. Store only essential data on-chain
3. Archive completed groups (future feature)
4. Consider off-chain indexing for historical data

## Data Lifecycle

### Active Group States

```
Created → Accepting Members → Cycle 1 Active → Payout 1 → Cycle 2 Active → ... → Complete
```

**Storage Operations by State:**

| State | Read Operations | Write Operations |
|-------|----------------|------------------|
| Created | Group counter | Group data, counter |
| Accepting | Group data | Group data (members) |
| Cycle Active | Group, contributions | Contributions |
| Payout Ready | Group, all contributions | Payout record, group state |
| Complete | Group data | None (read-only) |

### Completed Groups

Once `is_complete = true`:
- No further writes to group
- Historical contributions remain
- Payout records preserved
- Group data accessible for queries

## Query Patterns

### Efficient Queries

✅ **Good:** Direct key lookups
```rust
// O(1) - Single storage read
get_group(group_id) → Read (GROUP, group_id)
```

✅ **Good:** Member validation
```rust
// O(1) - Single read, O(N) in-memory scan
is_member(group_id, member) → Read (GROUP, group_id), scan members list
```

✅ **Good:** Contribution check
```rust
// O(1) - Single storage read
has_contributed(group_id, cycle, member) → Read (CONTRIB, group_id, cycle, member)
```

❌ **Inefficient:** Listing all groups
```rust
// Requires external indexing
list_all_groups() → Not supported (no iteration over storage keys)
```

### Recommended Query Strategies

1. **For UI:** Use events to build off-chain index
2. **For Validation:** Direct key lookups in contract
3. **For Analytics:** Index events in separate database

## Migration & Upgrades

### Version 1 (Current)

Simple key structure, optimal for MVP.

### Future Versions (Potential Changes)

**V2: Token Support**
```rust
Group {
    // ... existing fields
    token_address: Option<Address>,  // NEW
}
```
**Migration:** Existing groups have `None` (native XLM).

**V3: Advanced Tracking**
```rust
// New storage key for detailed history
(HISTORY, group_id, cycle) → CycleHistory
```
**Migration:** Only new groups use extended tracking.

### Backward Compatibility Strategy

1. Never change existing key structures
2. Add new optional fields with defaults
3. New keys for new features
4. Old contracts remain readable

## Storage Best Practices

### DO ✅

- Use short symbol names (10 chars max)
- Combine related data in structs
- Validate before writing
- Use persistent storage for permanent data
- Clean up temporary data

### DON'T ❌

- Store redundant data
- Use very long keys
- Perform unnecessary reads
- Store what can be computed
- Use storage for temporary state

## Example Storage State

### Complete 3-Member Group (After Completion)

```
Storage Contents:

GCOUNTER → 2  // (group 1 complete, ready for group 2)

(GROUP, 1) → Group {
    id: 1,
    creator: GAAAA...,
    contribution_amount: 100_000_000,
    cycle_duration: 604_800,
    max_members: 3,
    members: [GAAAA..., GBBBB..., GCCCC...],
    current_cycle: 3,
    payout_index: 3,
    created_at: 1234567890,
    cycle_start_time: 1234567890,
    is_complete: true,
}

// Cycle 1 contributions
(CONTRIB, 1, 1, GAAAA...) → true
(CONTRIB, 1, 1, GBBBB...) → true
(CONTRIB, 1, 1, GCCCC...) → true

// Cycle 2 contributions
(CONTRIB, 1, 2, GAAAA...) → true
(CONTRIB, 1, 2, GBBBB...) → true
(CONTRIB, 1, 2, GCCCC...) → true

// Cycle 3 contributions
(CONTRIB, 1, 3, GAAAA...) → true
(CONTRIB, 1, 3, GBBBB...) → true
(CONTRIB, 1, 3, GCCCC...) → true

// Payout records
(PAYOUT, 1, GAAAA...) → true  // received cycle 1
(PAYOUT, 1, GBBBB...) → true  // received cycle 2
(PAYOUT, 1, GCCCC...) → true  // received cycle 3
```

**Total Storage Entries:** 14  
**Estimated Size:** ~2-3 KB

## Monitoring & Debugging

### Useful Queries for Operations

1. **Check group status:**
   ```
   get_group(group_id)
   ```

2. **Verify cycle completion:**
   ```
   get_contribution_status(group_id, cycle)
   ```

3. **Audit payout history:**
   ```
   For each member: has_received_payout(group_id, member)
   ```

### Event-Based Monitoring

All storage modifications emit events:
- `group_created` → New group in storage
- `member_joined` → Group data updated
- `contribution_made` → New contribution record
- `payout_executed` → Payout record + group update
- `group_completed` → Final group state

Use events to maintain external index for efficient querying.

## Conclusion

The storage layout is designed for:
- **Efficiency:** O(1) lookups for all operations
- **Simplicity:** Minimal key types
- **Scalability:** Linear cost with usage
- **Safety:** Immutable historical records
- **Extensibility:** Easy to add new features

This design balances on-chain storage costs with query performance and maintains data integrity throughout the group lifecycle.
