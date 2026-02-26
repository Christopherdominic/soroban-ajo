# Architecture Overview

## System Design

The Soroban Ajo contract implements a decentralized rotational savings and credit association (ROSCA) system on the Stellar blockchain. This document describes the architecture, lifecycle, and design decisions.

## Core Concepts

### What is Ajo/Esusu?

Ajo (Nigeria) or Esusu (Yoruba) is a traditional savings system where:
- A fixed group of people contribute the same amount regularly
- Each cycle, one member receives the total pool
- The recipient rotates until everyone has received once
- The process builds trust and financial discipline

### Blockchain Benefits

Traditional Ajo requires a trusted coordinator. Our smart contract eliminates this need by:
- **Enforcing rules programmatically** - No coordinator can manipulate funds
- **Providing transparency** - All contributions and payouts are on-chain
- **Automating payouts** - When conditions are met, payout executes automatically
- **Recording history** - Immutable audit trail of all transactions

## Lifecycle Flow

### 1. Group Creation

```
Creator → create_group(amount, duration, max_members)
         ↓
    Group ID generated
         ↓
    Creator becomes first member
         ↓
    Cycle 1 begins
```

**State Changes:**
- Group counter increments
- Group stored with initial configuration
- Creator added to members list
- Current cycle = 1, payout_index = 0

### 2. Member Joining

```
Member → join_group(group_id)
        ↓
    Validate: not full, not duplicate, not complete
        ↓
    Add to members list
        ↓
    Emit member_joined event
```

**Validations:**
- Group exists
- Group not complete
- Address not already a member
- Group not at max capacity

### 3. Contribution Phase

```
Each Cycle:
    Member 1 → contribute(group_id)
    Member 2 → contribute(group_id)
    ...
    Member N → contribute(group_id)
         ↓
    All contributed?
         ↓
    Ready for payout
```

**State Tracking:**
- Each contribution recorded: `(group_id, cycle, member) → true`
- Prevents double contributions
- Enables verification before payout

### 4. Payout Execution

```
execute_payout(group_id)
    ↓
Verify all members contributed
    ↓
Calculate total: amount × member_count
    ↓
Transfer to members[payout_index]
    ↓
Record payout received
    ↓
Advance payout_index
    ↓
If all members paid → mark complete
Else → advance to next cycle
```

**Payout Logic:**
- Recipient determined by `payout_index` (0-based)
- First cycle: creator receives (index 0)
- Second cycle: second member (index 1)
- Continues until all members have received once

### 5. Completion

```
After final payout:
    is_complete = true
    ↓
No more contributions accepted
    ↓
Group enters read-only state
```

## Component Architecture

### Contract Module (`contract.rs`)

Main contract implementation with public API:
- `create_group` - Initialize new group
- `join_group` - Add member to group
- `contribute` - Record contribution for cycle
- `execute_payout` - Distribute funds and advance state
- Query functions for group info

### Storage Module (`storage.rs`)

Handles all persistent data operations:
- **Group Counter** - Sequential ID generation
- **Group Data** - Configuration and state
- **Contribution Records** - Per-cycle, per-member tracking
- **Payout Records** - Who has received payout

**Storage Keys:**
```
GCOUNTER → u64                           // Next group ID
(GROUP, group_id) → Group                // Group config/state
(CONTRIB, group_id, cycle, member) → bool // Contribution tracking
(PAYOUT, group_id, member) → bool        // Payout tracking
```

### Types Module (`types.rs`)

Data structures:
- **Group** - Core group configuration and state
- **ContributionRecord** - Contribution metadata (future use)
- **PayoutRecord** - Payout metadata (future use)

### Events Module (`events.rs`)

Emits blockchain events for:
- Group created
- Member joined
- Contribution made
- Payout executed
- Group completed

Events enable off-chain indexing and UI updates.

### Errors Module (`errors.rs`)

Comprehensive error handling with specific codes:
- Validation errors (invalid params)
- State errors (group full, complete)
- Authorization errors (not member)
- Business logic errors (incomplete contributions)

### Utils Module (`utils.rs`)

Helper functions:
- Member validation
- Contribution status checks
- Payout calculations
- Parameter validation

## Data Flow

### Create Group Flow
```
User → Contract.create_group()
         ↓
    Validate parameters
         ↓
    Authenticate creator
         ↓
    Generate group_id
         ↓
    Initialize Group struct
         ↓
    Storage.store_group()
         ↓
    Emit group_created event
         ↓
    Return group_id
```

### Contribute & Payout Flow
```
Member → Contract.contribute()
         ↓
    Validate: member, not contributed
         ↓
    Transfer funds to contract
         ↓
    Storage.store_contribution()
         ↓
    Emit contribution_made event
         ↓
    [All contributed?]
         ↓
Coordinator → Contract.execute_payout()
         ↓
    Verify all contributed
         ↓
    Calculate payout amount
         ↓
    Transfer to recipient
         ↓
    Update group state
         ↓
    Storage.store_group()
         ↓
    Emit payout_executed event
```

## Security Considerations

### Reentrancy Protection

Soroban's execution model prevents reentrancy attacks. All state changes are atomic.

### Access Control

- **Group Creation** - Anyone can create
- **Joining** - Requires member authentication
- **Contributing** - Only members, once per cycle
- **Payout** - Anyone can trigger (permissionless), but strict validation

### Fund Safety

**Current Implementation (MVP):**
- Contributions and payouts are recorded but not enforced
- Assumes off-chain coordination or future token integration

**Production Implementation:**
- Integrate Stellar Asset Contract for token transfers
- Lock funds in contract during cycle
- Atomic payout on condition satisfaction

### State Consistency

- All state changes are validated before execution
- No partial state updates
- Events emitted after successful state changes

## Token Support (Roadmap)

### Current: XLM Only (Conceptual)

The MVP tracks contributions but doesn't enforce token transfers. This is intentional to simplify initial development and testing.

### Future: Full Token Support

```rust
pub struct Group {
    // ... existing fields
    pub token_address: Option<Address>,  // None = native XLM
}

impl Contract {
    pub fn contribute(&self, env: Env, member: Address, group_id: u64) {
        // ... validation
        
        // Transfer tokens
        if let Some(token_addr) = &group.token_address {
            let token = TokenClient::new(&env, token_addr);
            token.transfer(&member, &env.current_contract_address(), &group.contribution_amount);
        } else {
            // Transfer native XLM
            env.transfer_native(&member, &env.current_contract_address(), group.contribution_amount);
        }
        
        // ... record contribution
    }
}
```

## Scalability Considerations

### Storage Costs

- Each group: ~500 bytes
- Each contribution record: ~100 bytes
- For 10 members × 10 cycles = ~1KB additional per group

### Gas/Fee Optimization

- Batch operations where possible
- Efficient storage key design
- Minimal event data

### Multiple Groups

- Groups are independent
- No cross-group dependencies
- Linear scaling with group count

## Testing Strategy

### Unit Tests

- Individual function validation
- Error case coverage
- Edge case handling

### Integration Tests

- Full lifecycle simulation
- Multi-member scenarios
- State consistency verification

### Invariant Testing

Key invariants:
1. Total contributed = Total paid out (per cycle)
2. Each member contributes once per cycle
3. Each member receives payout exactly once
4. Payout order follows member join order

## Future Enhancements

### Phase 1: Production Readiness
- Real token transfers
- Enhanced events with indexing metadata
- Admin functions (pause/unpause)

### Phase 2: Advanced Features
- Flexible payout schedules (not strict rotation)
- Penalty mechanisms for late contributions
- Multiple token support per group
- Collateral requirements

### Phase 3: Social Features
- Group reputation scoring
- Member history tracking
- Referral mechanisms
- Dispute resolution

## Comparison to Alternatives

### vs. Traditional Ajo
| Feature | Traditional | Soroban Ajo |
|---------|------------|-------------|
| Trust | Coordinator needed | Trustless |
| Transparency | Limited | Full on-chain |
| Accessibility | Local only | Global |
| Records | Manual | Immutable |

### vs. DeFi Lending
| Feature | DeFi Lending | Soroban Ajo |
|---------|--------------|-------------|
| Collateral | Required | None |
| Interest | Yes | No |
| Accessibility | Medium | High |
| Community | Individual | Group-based |

## Conclusion

The Soroban Ajo contract brings a time-tested community financial mechanism to the blockchain, making it more transparent, accessible, and trustworthy while preserving its social and community-building aspects.
