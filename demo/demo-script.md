# Soroban Ajo — Testnet Deployment Walkthrough

Step-by-step guide for deploying the Ajo contract to Stellar testnet using the provided helper script.

## Prerequisites
- Rust toolchain (`cargo`)
- Soroban CLI: `cargo install --locked soroban-cli --features opt`
- Fundable testnet account (friendbot)

## Steps
1. From the repo root, run:
   ```bash
   scripts/deploy_testnet.sh
   ```
2. When prompted, fund the generated `deployer` address via friendbot:
   ```
   https://friendbot.stellar.org?addr=<deployer_address>
   ```
3. Let the script:
   - configure the `testnet` network (if missing)
   - build and optimize the contract
   - deploy to testnet
4. Note the outputs:
   - `contract-id.txt` contains the deployed contract ID
   - Explorer link printed at the end: `https://stellar.expert/explorer/testnet/contract/<contract_id>`

## Quick invokes
After deployment, you can interact with the contract. Examples:
```bash
CONTRACT_ID=$(cat contract-id.txt)

# Create test users
soroban keys generate alice --network testnet
soroban keys generate bob --network testnet

# Inspect contract
soroban contract inspect --id "$CONTRACT_ID" --network testnet
```

## Troubleshooting
- **Funding error**: Re-run friendbot for the `deployer` address, wait a few seconds, then re-run the script.
- **Missing testnet**: Add it manually  
  `soroban network add --global testnet --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"`
- **Build issues**: Ensure Rust target is installed  
  `rustup target add wasm32-unknown-unknown`
