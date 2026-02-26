# Ajo Contract - Complete Demo Walkthrough

This document provides a complete step-by-step walkthrough of deploying and testing the Ajo contract on Stellar testnet.

## Prerequisites

- Soroban CLI installed: `cargo install --locked soroban-cli --features opt`
- Rust 1.70+: `rustup update`
- Stellar testnet account with XLM funding
- Git repository cloned

## Part 1: Deploy Contract to Testnet

### Step 1.1: Automated Deployment (Recommended)

```bash
# Navigate to project root
cd /path/to/soroban-ajo

# Run deployment script
bash scripts/deploy_testnet.sh
```

The script will:
- Check prerequisites
- Configure testnet network
- Generate deployer identity (if needed)
- Build and optimize contract
- Deploy to testnet
- Save contract ID to `contract-id.txt`
- Verify deployment

**Expected Output:**
```
═══════════════════════════════════════════════════════
  Soroban Ajo - Testnet Deployment
═══════════════════════════════════════════════════════

ℹ Checking prerequisites...
✓ Soroban CLI found: soroban 21.0.0
✓ Cargo found: cargo 1.78.0

ℹ Checking network configuration...
✓ Testnet network already configured

ℹ Checking deployer identity...
ℹ Deployer address: GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

═══════════════════════════════════════════════════════
  Building Contract
═══════════════════════════════════════════════════════

ℹ Navigating to contract directory...
ℹ Building contract...
✓ Contract built successfully (Size: 245K)

ℹ Optimizing contract...
✓ Contract optimized (Size: 180K)

═══════════════════════════════════════════════════════
  Deploying to Testnet
═══════════════════════════════════════════════════════

ℹ Deploying contract to Stellar testnet...
✓ Contract deployed successfully!

Contract ID: CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSC4

═══════════════════════════════════════════════════════
  Deployment Summary
═══════════════════════════════════════════════════════

✓ Contract built and optimized
✓ Deployed to Stellar testnet
✓ Contract ID saved

Contract ID: CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSC4
Deployer: GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Network: Stellar Testnet
Explorer: https://stellar.expert/explorer/testnet/contract/CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFSC4
```

### Step 1.2: Manual Deployment (If Script Fails)

```bash
# Setup network
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate deployer key
soroban keys generate deployer --network testnet

# Get deployer address and fund it
DEPLOYER=$(soroban keys address deployer)
echo "Fund this address: $DEPLOYER"
# Go to https://friendbot.stellar.org?addr=$DEPLOYER
# Wait 30-60 seconds for funding

# Build
cd contracts/ajo
cargo build --target wasm32-unknown-unknown --release

# Optimize
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/soroban_ajo.wasm

# Deploy
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_ajo_optimized.wasm \
  --source deployer \
  --network testnet)

echo $CONTRACT_ID
echo $CONTRACT_ID > ../../contract-id.txt
```

### Step 1.3: Verify Deployment

```bash
# Load contract ID
CONTRACT_ID=$(cat contract-id.txt)

# Check contract exists
soroban contract inspect --id $CONTRACT_ID --network testnet

# View on Stellar Expert
echo "View at: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
```

## Part 2: Set Up Test Accounts

### Step 2.1: Create Test Users

```bash
# Generate test accounts
soroban keys generate alice --network testnet
soroban keys generate bob --network testnet
soroban keys generate charlie --network testnet

# Get addresses
ALICE=$(soroban keys address alice)
BOB=$(soroban keys address bob)
CHARLIE=$(soroban keys address charlie)

echo "Alice:   $ALICE"
echo "Bob:     $BOB"
echo "Charlie: $CHARLIE"

# Save for later use
export ALICE=$ALICE
export BOB=$BOB
export CHARLIE=$CHARLIE
```

### Step 2.2: Fund Test Accounts

Go to https://friendbot.stellar.org and fund each address:
- Alice
- Bob
- Charlie

This gives each account 10,000 XLM on testnet. Takes 30-60 seconds per account.

### Step 2.3: Verify Funding

```bash
# Check account info
soroban account info --source alice --network testnet
soroban account info --source bob --network testnet
soroban account info --source charlie --network testnet

# Should show balance: 10000 XLM
```

## Part 3: Contract Interactions

### Step 3.1: Create a Group

Alice creates a group with 3 members, 100 XLM contribution per cycle, 1-week cycles.

```bash
CONTRACT_ID=$(cat contract-id.txt)
ALICE=$(soroban keys address alice)

# Create group
GROUP_ID=$(soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  create_group \
  --creator $ALICE \
  --contribution_amount 100000000 \
  --cycle_duration 604800 \
  --max_members 3)

echo "Group ID: $GROUP_ID"
export GROUP_ID=$GROUP_ID
```

**Expected Output:** Group ID (usually 1 for first group)

### Step 3.2: Get Group Information

```bash
CONTRACT_ID=$(cat contract-id.txt)
GROUP_ID=$(cat group-id.txt)

# Get group data
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_group \
  --group_id $GROUP_ID

# List members
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  list_members \
  --group_id $GROUP_ID
```

**Expected Output:**
```
{
  "id": 1,
  "creator": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "contribution_amount": 100000000,
  "cycle_duration": 604800,
  "max_members": 3,
  "members": [
    "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  ],
  "current_cycle": 1,
  "payout_index": 0,
  "created_at": 1708459200,
  "cycle_start_time": 1708459200,
  "is_complete": false
}
```

### Step 3.3: Other Members Join Group

Bob and Charlie join the group:

```bash
CONTRACT_ID=$(cat contract-id.txt)
GROUP_ID=$(cat group-id.txt)
BOB=$(soroban keys address bob)
CHARLIE=$(soroban keys address charlie)

# Bob joins
soroban contract invoke \
  --id $CONTRACT_ID \
  --source bob \
  --network testnet \
  -- \
  join_group \
  --member $BOB \
  --group_id $GROUP_ID

# Charlie joins
soroban contract invoke \
  --id $CONTRACT_ID \
  --source charlie \
  --network testnet \
  -- \
  join_group \
  --member $CHARLIE \
  --group_id $GROUP_ID
```

**Verify they joined:**
```bash
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  list_members \
  --group_id $GROUP_ID

# Should list 3 members: Alice, Bob, Charlie
```

### Step 3.4: Get Group Status

```bash
CONTRACT_ID=$(cat contract-id.txt)
GROUP_ID=$(cat group-id.txt)

# Get comprehensive status
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_group_status \
  --group_id $GROUP_ID
```

**Expected Output:**
```
{
  "group_id": 1,
  "current_cycle": 1,
  "has_next_recipient": true,
  "next_recipient": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "contributions_received": 0,
  "total_members": 3,
  "pending_contributors": [
    "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  ],
  "is_complete": false,
  "is_cycle_active": true,
  "cycle_start_time": 1708459200,
  "cycle_end_time": 1709064000,
  "current_time": 1708459200
}
```

### Step 3.5: Members Contribute

All members contribute their share for cycle 1:

```bash
CONTRACT_ID=$(cat contract-id.txt)
GROUP_ID=$(cat group-id.txt)

# Alice contributes
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  contribute \
  --member $(soroban keys address alice) \
  --group_id $GROUP_ID

# Bob contributes
soroban contract invoke \
  --id $CONTRACT_ID \
  --source bob \
  --network testnet \
  -- \
  contribute \
  --member $(soroban keys address bob) \
  --group_id $GROUP_ID

# Charlie contributes
soroban contract invoke \
  --id $CONTRACT_ID \
  --source charlie \
  --network testnet \
  -- \
  contribute \
  --member $(soroban keys address charlie) \
  --group_id $GROUP_ID
```

### Step 3.6: Check Contribution Status

```bash
CONTRACT_ID=$(cat contract-id.txt)
GROUP_ID=$(cat group-id.txt)

# Get contribution status for current cycle
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_contribution_status \
  --group_id $GROUP_ID \
  --cycle_number 1

# Updated group status
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_group_status \
  --group_id $GROUP_ID
```

**Expected Output:**
```
Status shows contributions_received: 3, pending_contributors: []
```

### Step 3.7: Execute Payout

All members have contributed, so Alice receives the payout:

```bash
CONTRACT_ID=$(cat contract-id.txt)
GROUP_ID=$(cat group-id.txt)

# Execute payout
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  execute_payout \
  --group_id $GROUP_ID
```

### Step 3.8: Verify Cycle Advancement

```bash
CONTRACT_ID=$(cat contract-id.txt)
GROUP_ID=$(cat group-id.txt)

# Check updated status
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_group_status \
  --group_id $GROUP_ID

# Should show:
# - current_cycle: 2
# - next_recipient: Bob (changing from Alice)
# - contributions_received: 0 (reset for new cycle)
# - pending_contributors: [Alice, Bob, Charlie] (all pending again)
```

## Part 4: Complete Cycle 2 and 3

### Repeat for Cycle 2:

```bash
# All contribute again
soroban contract invoke --id $CONTRACT_ID --source bob --network testnet -- contribute --member $(soroban keys address bob) --group_id $GROUP_ID
soroban contract invoke --id $CONTRACT_ID --source charlie --network testnet -- contribute --member $(soroban keys address charlie) --group_id $GROUP_ID
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- contribute --member $(soroban keys address alice) --group_id $GROUP_ID

# Bob gets payout
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- execute_payout --group_id $GROUP_ID
```

### Repeat for Cycle 3:

```bash
# All contribute again
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- contribute --member $(soroban keys address alice) --group_id $GROUP_ID
soroban contract invoke --id $CONTRACT_ID --source bob --network testnet -- contribute --member $(soroban keys address bob) --group_id $GROUP_ID
soroban contract invoke --id $CONTRACT_ID --source charlie --network testnet -- contribute --member $(soroban keys address charlie) --group_id $GROUP_ID

# Charlie gets payout
soroban contract invoke --id $CONTRACT_ID --source alice --network testnet -- execute_payout --group_id $GROUP_ID
```

### Step 4.1: Verify Completion

```bash
CONTRACT_ID=$(cat contract-id.txt)
GROUP_ID=$(cat group-id.txt)

# Check final status
soroban contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  get_group_status \
  --group_id $GROUP_ID

# Should show: is_complete: true
```

## Part 5: Configure and Run Full Stack

### Step 5.1: Update Environment Files

**Backend (`backend/.env`):**
```bash
cd backend
cp .env.example .env

# Edit .env with:
SOROBAN_CONTRACT_ID=$(cat ../contract-id.txt)
```

**Frontend (`frontend/.env.local`):**
```bash
cd frontend
cp .env.example .env.local

# Edit .env.local with:
NEXT_PUBLIC_SOROBAN_CONTRACT_ID=$(cat ../contract-id.txt)
```

### Step 5.2: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 5.3: Start Development Environment

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Listen on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

## Part 6: Contract Testing (Optional)

### Run Contract Tests:

```bash
cd contracts/ajo

# Run all tests
cargo test

# Run specific test suite
cargo test test_group_status

# Show output
cargo test test_group_status_initial_state -- --nocapture
```

## Troubleshooting Common Issues

### Contract Deployment Failed

1. **Check network connectivity:**
   ```bash
   curl -X POST https://soroban-testnet.stellar.org \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"getVersion","params":[],"id":1}'
   ```

2. **Verify deployer account is funded:**
   ```bash
   DEPLOYER=$(soroban keys address deployer)
   soroban account info --source deployer --network testnet
   ```

3. **Check WASM file size:**
   ```bash
   ls -lh contracts/ajo/target/wasm32-unknown-unknown/release/*.wasm
   # Should be <256KB (either optimize or reduce features)
   ```

### Invoke Failed

1. **Verify contract ID:**
   ```bash
   CONTRACT_ID=$(cat contract-id.txt)
   soroban contract inspect --id $CONTRACT_ID --network testnet
   ```

2. **Check account has XLM:**
   ```bash
   soroban account info --source alice --network testnet
   ```

3. **Try with explicit network:**
   ```bash
   soroban contract invoke \
     --id $CONTRACT_ID \
     --source alice \
     --network testnet \
     -- \
     get_group \
     --group_id 1
   ```

### Keys Not Found

1. **List existing keys:**
   ```bash
   soroban keys ls
   ```

2. **Import existing key:**
   ```bash
   soroban keys add alice --seed "your seed here"
   ```

## Next Steps

1. **Connect Freighter Wallet:** Use extension to sign transactions
2. **Deploy Frontend:** Use Vercel or Netlify
3. **Deploy Backend:** Use Railway or Render
4. **Monitor Contract:** Check on Stellar Expert
5. **Add More Features:** Extend contract functionality

## Useful Resources

- [Stellar Testnet Faucet](https://friendbot.stellar.org)
- [Stellar Expert Explorer](https://stellar.expert/explorer/testnet)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Documentation](https://developers.stellar.org/)
