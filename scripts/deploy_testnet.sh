#!/bin/bash

# Soroban Ajo - Testnet Deployment Script
# This script automates the deployment of the Ajo contract to Stellar testnet

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main deployment function
main() {
    print_header "Soroban Ajo - Testnet Deployment"
    
    # Step 1: Check prerequisites
    print_info "Checking prerequisites..."
    
    if ! command_exists soroban; then
        print_error "Soroban CLI not found. Please install it first:"
        echo "  cargo install --locked soroban-cli --features opt"
        exit 1
    fi
    print_success "Soroban CLI found: $(soroban --version)"
    
    if ! command_exists cargo; then
        print_error "Cargo not found. Please install Rust first:"
        echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        exit 1
    fi
    print_success "Cargo found: $(cargo --version)"
    
    # Step 2: Check network configuration
    print_info "Checking network configuration..."
    
    if ! soroban network ls | grep -q "testnet"; then
        print_warning "Testnet network not configured. Adding it now..."
        soroban network add \
            --global testnet \
            --rpc-url https://soroban-testnet.stellar.org:443 \
            --network-passphrase "Test SDF Network ; September 2015"
        print_success "Testnet network added"
    else
        print_success "Testnet network already configured"
    fi
    
    # Step 3: Check/create deployer identity
    print_info "Checking deployer identity..."
    
    if ! soroban keys ls | grep -q "deployer"; then
        print_warning "Deployer identity not found. Creating it now..."
        soroban keys generate deployer --network testnet
        print_success "Deployer identity created"
        
        DEPLOYER_ADDRESS=$(soroban keys address deployer)
        print_info "Deployer address: $DEPLOYER_ADDRESS"
        
        print_warning "Please fund this address using the Stellar testnet faucet:"
        echo "  https://friendbot.stellar.org?addr=$DEPLOYER_ADDRESS"
        echo ""
        read -p "Press Enter after funding the account..."
    else
        print_success "Deployer identity found"
        DEPLOYER_ADDRESS=$(soroban keys address deployer)
        print_info "Deployer address: $DEPLOYER_ADDRESS"
    fi
    
    # Step 4: Build the contract
    print_header "Building Contract"
    
    print_info "Navigating to contract directory..."
    cd contracts/ajo || {
        print_error "Contract directory not found. Are you in the project root?"
        exit 1
    }
    
    print_info "Building contract..."
    cargo build --target wasm32-unknown-unknown --release
    
    WASM_PATH="target/wasm32-unknown-unknown/release/soroban_ajo.wasm"
    
    if [ ! -f "$WASM_PATH" ]; then
        print_error "Build failed. WASM file not found at $WASM_PATH"
        exit 1
    fi
    
    WASM_SIZE=$(du -h "$WASM_PATH" | cut -f1)
    print_success "Contract built successfully (Size: $WASM_SIZE)"
    
    # Step 5: Optimize the contract (optional)
    print_info "Optimizing contract..."
    soroban contract optimize --wasm "$WASM_PATH"
    
    OPTIMIZED_WASM="${WASM_PATH%.wasm}_optimized.wasm"
    if [ -f "$OPTIMIZED_WASM" ]; then
        OPTIMIZED_SIZE=$(du -h "$OPTIMIZED_WASM" | cut -f1)
        print_success "Contract optimized (Size: $OPTIMIZED_SIZE)"
        WASM_PATH="$OPTIMIZED_WASM"
    else
        print_warning "Optimization skipped or failed, using unoptimized WASM"
    fi
    
    # Step 6: Deploy the contract
    print_header "Deploying to Testnet"
    
    print_info "Deploying contract to Stellar testnet..."
    print_info "This may take a minute..."
    
    CONTRACT_ID=$(soroban contract deploy \
        --wasm "$WASM_PATH" \
        --source deployer \
        --network testnet 2>&1)
    
    if [ $? -ne 0 ]; then
        print_error "Deployment failed!"
        echo "$CONTRACT_ID"
        exit 1
    fi
    
    print_success "Contract deployed successfully!"
    echo ""
    echo -e "${GREEN}Contract ID: ${NC}$CONTRACT_ID"
    echo ""
    
    # Step 7: Save contract ID
    print_info "Saving contract ID..."
    echo "$CONTRACT_ID" > ../../contract-id.txt
    print_success "Contract ID saved to contract-id.txt"
    
    # Step 8: Verify deployment
    print_header "Verifying Deployment"
    
    print_info "Inspecting deployed contract..."
    soroban contract inspect --id "$CONTRACT_ID" --network testnet
    
    # Step 9: Display summary
    print_header "Deployment Summary"
    
    echo -e "${GREEN}✓${NC} Contract built and optimized"
    echo -e "${GREEN}✓${NC} Deployed to Stellar testnet"
    echo -e "${GREEN}✓${NC} Contract ID saved"
    echo ""
    echo -e "${BLUE}Contract ID:${NC} $CONTRACT_ID"
    echo -e "${BLUE}Deployer:${NC} $DEPLOYER_ADDRESS"
    echo -e "${BLUE}Network:${NC} Stellar Testnet"
    echo -e "${BLUE}Explorer:${NC} https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
    echo ""
    
    # Step 10: Next steps
    print_header "Next Steps"
    
    echo "1. Test the contract:"
    echo "   cd contracts/ajo && cargo test"
    echo ""
    echo "2. Interact with the contract:"
    echo "   soroban contract invoke --id $CONTRACT_ID --source deployer --network testnet -- create_group ..."
    echo ""
    echo "3. Follow the demo script:"
    echo "   See demo/demo-script.md for a complete walkthrough"
    echo ""
    echo "4. Create test users:"
    echo "   soroban keys generate alice --network testnet"
    echo "   soroban keys generate bob --network testnet"
    echo ""
    
    print_success "Deployment complete! 🎉"
}

# Run main function
main "$@"
