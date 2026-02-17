# 🪙 Soroban Ajo (Esusu) — Rotational Savings on Stellar

[![CI](https://github.com/yourusername/soroban-ajo/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/soroban-ajo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A decentralized rotational savings and credit association (ROSCA) built on Stellar Soroban smart contracts.**

Ajo (also known as Esusu in West Africa) is a traditional community-based savings system where members contribute a fixed amount regularly, and each member receives the total pool on a rotating basis. This project brings this time-tested financial mechanism to the blockchain, making it transparent, trustless, and accessible globally.

## 🎯 What is Ajo?

Ajo is a rotating savings and credit association (ROSCA) common in Nigeria and across Africa. Members:
- Form a group with a fixed contribution amount
- Contribute the same amount each cycle (e.g., weekly or monthly)
- Take turns receiving the full pool of contributions
- Build trust and financial discipline within communities

**This Soroban implementation makes Ajo:**
- ✅ Trustless (no central coordinator needed)
- ✅ Transparent (all transactions on-chain)
- ✅ Accessible (anyone with a Stellar wallet can join)
- ✅ Programmable (automated payouts, no manual coordination)

## 🚀 Features

- **Create Groups**: Set contribution amount, cycle duration, and max members
- **Join & Participate**: Members join and contribute each cycle
- **Automatic Payouts**: When all members contribute, payout executes automatically to the next recipient
- **Native XLM Support**: Built-in support for Stellar Lumens (XLM)
- **Token Ready**: Architecture supports custom Stellar tokens (roadmap item)
- **Transparent**: All contributions and payouts are verifiable on-chain

## 📁 Repository Structure

```
soroban-ajo/
├── contracts/ajo/          # Core Soroban smart contract
├── docs/                   # Architecture, storage, threat model
├── grants/                 # Drips Wave proposal & milestones
├── demo/                   # Demo scripts and video outline
├── scripts/                # Build, test, deploy scripts
├── frontend/               # Future UI (placeholder)
└── .github/                # CI/CD and issue templates
```

## 🛠️ Quick Start

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (1.70+)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli)

### Build

```bash
./scripts/build.sh
```

### Test

```bash
./scripts/test.sh
```

### Deploy to Testnet

```bash
# Configure your testnet identity first
stellar keys generate deployer --network testnet

# Deploy
./scripts/deploy_testnet.sh
```

## 📖 Testnet Deployment Guide

### Prerequisites

Before deploying to Stellar Testnet, ensure you have:

1. **Rust** (1.70+) - [Installation Guide](https://www.rust-lang.org/tools/install)
2. **Soroban CLI** - Install with:
   ```bash
   cargo install --locked soroban-cli --features opt
   ```
3. **Stellar CLI** (optional, for advanced operations)

### Step-by-Step Deployment

#### 1. Build the Contract

First, build the optimized WASM binary:

```bash
./scripts/build.sh
```

This will:
- Run all tests to ensure contract works correctly
- Compile the contract to WebAssembly
- Produce an optimized `.wasm` file in `contracts/ajo/target/wasm32-unknown-unknown/release/`

#### 2. Configure Testnet Network

The deployment script will automatically configure the Stellar testnet, but you can do it manually:

```bash
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

#### 3. Create and Fund Deployer Account

Generate a new identity for deploying:

```bash
soroban keys generate deployer --network testnet
```

Get the account address:

```bash
soroban keys address deployer
```

Fund the account with testnet XLM using Friendbot:

```bash
# Replace YOUR_ADDRESS with the output from the previous command
curl "https://friendbot.stellar.org?addr=YOUR_ADDRESS"
```

#### 4. Deploy the Contract

Run the deployment script:

```bash
./scripts/deploy_testnet.sh
```

The script will:
- Verify prerequisites (Soroban CLI, built WASM)
- Configure testnet if needed
- Create/use deployer identity
- Deploy the contract
- Save the contract ID to `.soroban/contract-id-testnet.txt`
- Display next steps and example invocation

#### 5. Verify Deployment

After successful deployment, you can:

**View on Stellar Expert:**
```
https://stellar.expert/explorer/testnet/contract/YOUR_CONTRACT_ID
```

**Test with a simple invocation:**
```bash
# Get the contract ID
CONTRACT_ID=$(cat .soroban/contract-id-testnet.txt)

# Create a test group
soroban contract invoke \
  --id $CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  create_group \
  --creator $(soroban keys address deployer) \
  --contribution_amount 10000000 \
  --cycle_duration 604800 \
  --max_members 10
```

### Troubleshooting

#### Error: "WASM not found"
**Solution:** Build the contract first with `./scripts/build.sh`

#### Error: "Insufficient balance"
**Solution:** Fund your deployer account using Friendbot:
```bash
ADDR=$(soroban keys address deployer)
curl "https://friendbot.stellar.org?addr=$ADDR"
```

#### Error: "Network not configured"
**Solution:** Add the testnet network manually (see Step 2 above)

#### Error: "soroban command not found"
**Solution:** Install Soroban CLI:
```bash
cargo install --locked soroban-cli --features opt
```

#### Deployment succeeds but invocation fails
**Possible causes:**
- Wrong argument types (use `--help` flag to see expected types)
- Insufficient authorization (ensure you're using the correct `--source`)
- Network issues (check Stellar testnet status)

**Debug with:**
```bash
# Add --very-verbose flag to see detailed logs
soroban contract invoke --very-verbose ...
```

### Advanced: Manual Deployment

If you prefer manual control over deployment:

```bash
# Build optimized WASM
cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/ajo/Cargo.toml

# Deploy
soroban contract deploy \
  --wasm contracts/ajo/target/wasm32-unknown-unknown/release/soroban_ajo.wasm \
  --source deployer \
  --network testnet
```

### Next Steps After Deployment

1. **Run the demo**: Follow [`demo/demo-script.md`](demo/demo-script.md) for a complete walkthrough
2. **Integration**: Use the contract ID in your frontend or CLI application
3. **Monitor**: Track contract activity on [Stellar Expert](https://stellar.expert/explorer/testnet)

### Deploy to Mainnet

⚠️ **Warning:** Deploying to mainnet requires real XLM and should only be done after thorough testing.

```bash
# Configure mainnet
soroban network add \
  --global mainnet \
  --rpc-url https://soroban-mainnet.stellar.org:443 \
  --network-passphrase "Public Global Stellar Network ; September 2015"

# Create mainnet deployer (use a secure method for production)
soroban keys generate mainnet-deployer --network mainnet

# Deploy (requires real XLM for fees)
soroban contract deploy \
  --wasm contracts/ajo/target/wasm32-unknown-unknown/release/soroban_ajo.wasm \
  --source mainnet-deployer \
  --network mainnet
```

### Run Demo

Follow the step-by-step guide in [demo/demo-script.md](demo/demo-script.md)

## 📖 Documentation

- [Architecture Overview](docs/architecture.md)
- [Storage Layout](docs/storage-layout.md)
- [Threat Model & Security](docs/threat-model.md)
- [Roadmap](docs/roadmap.md)

## 🎓 Smart Contract API

### Group Management
```rust
create_group(contribution_amount, cycle_duration, max_members) -> u64
get_group(group_id) -> Group
list_members(group_id) -> Vec<Address>
```

### Membership
```rust
join_group(group_id)
is_member(group_id, address) -> bool
```

### Contributions
```rust
contribute(group_id)
get_contribution_status(group_id, cycle_number) -> Vec<(Address, bool)>
```

### Payouts
```rust
execute_payout(group_id)
is_complete(group_id) -> bool
```

## 🧪 Testing

Comprehensive test suite covering:
- ✅ Group creation and configuration
- ✅ Member joining and validation
- ✅ Contribution flow and tracking
- ✅ Payout rotation and distribution
- ✅ Group completion lifecycle
- ✅ Error handling and edge cases

Run tests:
```bash
cargo test
```

## 🌍 Why This Matters

**Financial Inclusion**: Over 1.7 billion adults globally are unbanked. Ajo/Esusu has served African communities for generations as a trusted savings mechanism.

**Blockchain Benefits**:
- No need for a trusted coordinator
- Transparent contribution and payout history
- Programmable rules enforced by smart contracts
- Accessible to anyone with a Stellar wallet

**Target Users**:
- African diaspora communities
- Unbanked/underbanked populations
- Small business owners needing working capital
- Communities building financial discipline


## 🗺️ Roadmap

- **v1.0** (Current): XLM-only groups, basic functionality
- **v1.1**: Custom token support (USDC, EURC, etc.)
- **v2.0**: Flexible payout schedules, penalty mechanisms
- **v3.0**: Frontend UI with wallet integration
- **v4.0**: Mobile app, fiat on/off-ramps

See [docs/roadmap.md](docs/roadmap.md) for details.

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guidelines](CONTRIBUTING.md).

### 🌊 Drips Wave Contributors

This project participates in **Drips Wave** - a contributor funding program! Check out:
- **[Wave Contributor Guide](docs/wave-guide.md)** - How to earn funding for contributions
- **[Wave-Ready Issues](docs/wave-ready-issues.md)** - 12 funded issues ready to tackle
- **GitHub Issues** labeled with `wave-ready` - Earn 100-200 points per issue

Issues are categorized as:
- `trivial` (100 points) - Documentation, simple tests, minor fixes
- `medium` (150 points) - Helper functions, validation logic, moderate features  
- `high` (200 points) - Core features, complex integrations, security enhancements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Stellar Development Foundation for Soroban
- African communities that have practiced Ajo/Esusu for centuries
- Drips Wave for supporting public goods funding

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/Christopherdominic/soroban-ajo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Christopherdominic/soroban-ajo/discussions)
- **Email**: [your-email@example.com](mailto:Chriseze0@gmail.com)

---

**Built with ❤️ for financial inclusion on Stellar**
