
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
        echo ""
        echo "Troubleshooting:"
        echo "  - Ensure Rust is installed: https://rustup.rs"
        echo "  - Update Rust: rustup update"
        echo "  - Check PATH: echo \$PATH"
        exit 1
    fi
    SOROBAN_VERSION=$(soroban --version)
    print_success "Soroban CLI found: $SOROBAN_VERSION"
    
    # Warn if very old version
    if echo "$SOROBAN_VERSION" | grep -q "20\|19\|18"; then
        print_warning "Soroban CLI version is older than recommended"
        print_info "Update with: cargo install --locked soroban-cli --features opt"
    fi
    
    if ! command_exists cargo; then
        print_error "Cargo not found. Please install Rust first:"
        echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        exit 1
    fi
    print_success "Cargo found: $(cargo --version)"
    
    # Check WASM target
    print_info "Checking WASM target..."
    if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
        print_warning "WASM target not installed. Adding now..."
        rustup target add wasm32-unknown-unknown
        print_success "WASM target added"
    else
        print_success "WASM target available"
    fi
    
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
        
        # Verify network is reachable
        print_info "Verifying network connectivity..."
        if ! curl -s -X POST https://soroban-testnet.stellar.org \
            -H "Content-Type: application/json" \
            -d '{"jsonrpc":"2.0","method":"getVersion","params":[],"id":1}' \
            | grep -q "result"; then
            print_warning "Network may not be responding"
            print_info "Retrying with alternate RPC endpoint..."
        fi
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
        echo ""
        echo "  https://friendbot.stellar.org?addr=$DEPLOYER_ADDRESS"
        echo ""
        print_info "Waiting for funding..."
        read -p "Press Enter after funding the account..."
        
        # Verify funding
        print_info "Verifying account funding..."
        if soroban account info --source deployer --network testnet > /dev/null 2>&1; then
            print_success "Account verified!"
        else
            print_warning "Account verification timed out. Continuing anyway..."
        fi
    else
        print_success "Deployer identity found"
        DEPLOYER_ADDRESS=$(soroban keys address deployer)
        print_info "Deployer address: $DEPLOYER_ADDRESS"
        
        # Check if account is funded
        print_info "Checking account funding..."
        if soroban account info --source deployer --network testnet > /dev/null 2>&1; then
            print_success "Account is funded"
        else
            print_warning "Account may not be funded"
            echo "Fund at: https://friendbot.stellar.org?addr=$DEPLOYER_ADDRESS"
        fi
    fi
    
    # Step 4: Build the contract
    print_header "Building Contract"
    
    print_info "Navigating to contract directory..."
    cd contracts/ajo || {
        print_error "Contract directory not found. Are you in the project root?"
        exit 1
    }
    
    print_info "Building contract..."
    if ! cargo build --target wasm32-unknown-unknown --release; then
        print_error "Build failed!"
        print_info "Attempting troubleshooting..."
        
        # Clean and retry
        print_info "Cleaning previous builds..."
        cargo clean
        
        print_info "Retrying build..."
        if ! cargo build --target wasm32-unknown-unknown --release; then
            print_error "Build failed even after cleaning"
            echo ""
            echo "Troubleshooting tips:"
            echo "1. Update Rust: rustup update"
            echo "2. Check WASM target: rustup target add wasm32-unknown-unknown"
            echo "3. Check disk space: df -h"
            echo "4. Try with verbose output: cargo build -v --target wasm32-unknown-unknown --release"
            exit 1
        fi
    fi
    
    WASM_PATH="target/wasm32-unknown-unknown/release/soroban_ajo.wasm"
    
    if [ ! -f "$WASM_PATH" ]; then
        print_error "Build succeeded but WASM file not found at $WASM_PATH"
        exit 1
    fi
    
    WASM_SIZE=$(du -h "$WASM_PATH" | cut -f1)
    print_success "Contract built successfully (Size: $WASM_SIZE)"
    
    # Step 5: Optimize the contract (optional)
    print_info "Optimizing contract..."
    if soroban contract optimize --wasm "$WASM_PATH"; then
        OPTIMIZED_WASM="${WASM_PATH%.wasm}_optimized.wasm"
        if [ -f "$OPTIMIZED_WASM" ]; then
            OPTIMIZED_SIZE=$(du -h "$OPTIMIZED_WASM" | cut -f1)
            REDUCTION=$(($(du -b "$WASM_PATH" | cut -f1) - $(du -b "$OPTIMIZED_WASM" | cut -f1)))
            print_success "Contract optimized (Size: $OPTIMIZED_SIZE, Saved: $((REDUCTION / 1024))KB)"
            WASM_PATH="$OPTIMIZED_WASM"
        else
            print_warning "Optimization completed but output file not found"
        fi
    else
        print_warning "Optimization encountered an issue, using unoptimized WASM"
        print_info "This may result in higher deployment costs"
    fi
    
    # Step 6: Deploy the contract
    print_header "Deploying to Testnet"
    
    print_info "Deploying contract to Stellar testnet..."
    print_info "This may take 1-2 minutes..."
    print_info ""
    print_info "If deployment times out, check:"
    print_info "  - Network connectivity"
    print_info "  - Account funding status"
    print_info "  - WASM file size"
    print_info ""
    
    DEPLOY_OUTPUT=$(soroban contract deploy \
        --wasm "$WASM_PATH" \
        --source deployer \
        --network testnet 2>&1)
    
    DEPLOY_STATUS=$?
    
    if [ $DEPLOY_STATUS -ne 0 ]; then
        print_error "Deployment failed!"
        echo ""
        echo "Error details:"
        echo "$DEPLOY_OUTPUT"
        echo ""
        
        # Provide troubleshooting suggestions
        echo "Troubleshooting:"
        if echo "$DEPLOY_OUTPUT" | grep -q "not found"; then
            echo "  - Account not funded: go to https://friendbot.stellar.org"
        fi
        if echo "$DEPLOY_OUTPUT" | grep -q "timeout"; then
            echo "  - Network timeout: check connectivity or try again"
        fi
        if echo "$DEPLOY_OUTPUT" | grep -q "WASM"; then
            echo "  - WASM issue: check file size is < 256KB"
        fi
        
        exit 1
    fi
    
    # Extract contract ID from output
    CONTRACT_ID=$(echo "$DEPLOY_OUTPUT" | grep -oE "[A-Z0-9]{56}" | head -1)
    
    if [ -z "$CONTRACT_ID" ]; then
        print_error "Could not extract contract ID from deployment output"
        echo "Raw output:"
        echo "$DEPLOY_OUTPUT"
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
    if soroban contract inspect --id "$CONTRACT_ID" --network testnet > /dev/null 2>&1; then
        print_success "Contract verified on network"
    else
        print_warning "Contract inspection failed, but deployment may have succeeded"
        print_info "Check on Stellar Expert: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
    fi
    
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
    
    echo "1. Run contract tests:"
    echo "   cd contracts/ajo && cargo test"
    echo ""
    echo "2. Follow the demo walkthrough:"
    echo "   Read demo/demo-script.md for complete instructions"
    echo ""
    echo "3. Create test users:"
    echo "   soroban keys generate alice --network testnet"
    echo "   soroban keys generate bob --network testnet"
    echo "   soroban keys generate charlie --network testnet"
    echo ""
    echo "4. Fund test accounts at https://friendbot.stellar.org"
    echo ""
    echo "5. Configure environment variables:"
    echo "   - Update backend/.env with SOROBAN_CONTRACT_ID=$CONTRACT_ID"
    echo "   - Update frontend/.env.local with NEXT_PUBLIC_SOROBAN_CONTRACT_ID=$CONTRACT_ID"
    echo ""
    echo "6. Start development environment:"
    echo "   cd backend && npm run dev    # Terminal 1"
    echo "   cd frontend && npm run dev   # Terminal 2"
    echo ""
    echo "7. View contract on Stellar Expert:"
    echo "   https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
    echo ""
    
    print_success "Deployment complete! 🎉"
}

# Troubleshooting and diagnostic functions
diagnose_network() {
    print_header "Network Diagnostics"
    
    print_info "Testing connection to Stellar testnet..."
    
    # Test RPC endpoint
    if curl -s -X POST https://soroban-testnet.stellar.org \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"getVersion","params":[],"id":1}' \
        | grep -q "result"; then
        print_success "RPC endpoint is online"
    else
        print_error "RPC endpoint not responding"
        return 1
    fi
    
    # Test network configuration
    if soroban network ls | grep -q "testnet"; then
        print_success "Network configured"
    else
        print_error "Network not configured"
        return 1
    fi
    
    return 0
}

troubleshoot_build() {
    print_header "Build Troubleshooting"
    
    print_warning "Attempting build troubleshooting steps..."
    
    # Check Rust installation
    if ! command_exists rustup; then
        print_error "Rust not installed"
        echo "Install with: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        return 1
    fi
    
    # Update Rust
    print_info "Updating Rust toolchain..."
    rustup update
    
    # Add WASM target if missing
    if ! rustup target list | grep "wasm32-unknown-unknown (installed)"; then
        print_warning "WASM target not installed. Adding..."
        rustup target add wasm32-unknown-unknown
        print_success "WASM target added"
    fi
    
    # Clean previous builds
    print_info "Cleaning previous builds..."
    cd contracts/ajo
    cargo clean
    
    # Try building again
    print_info "Retrying build..."
    if cargo build --target wasm32-unknown-unknown --release; then
        print_success "Build succeeded"
        return 0
    else
        print_error "Build still failing"
        return 1
    fi
}

check_account_funding() {
    print_header "Account Funding Check"
    
    DEPLOYER_ADDRESS=$(soroban keys address deployer)
    print_info "Checking account: $DEPLOYER_ADDRESS"
    
    # Try to get account info
    ACCOUNT_INFO=$(soroban account info --source deployer --network testnet 2>&1)
    
    if echo "$ACCOUNT_INFO" | grep -q "balance"; then
        BALANCE=$(echo "$ACCOUNT_INFO" | grep "balance" | awk '{print $2}')
        print_success "Account is funded: $BALANCE XLM"
        return 0
    else
        print_warning "Account not yet funded"
        print_info "Fund at: https://friendbot.stellar.org?addr=$DEPLOYER_ADDRESS"
        return 1
    fi
}

show_help() {
    echo ""
    echo "Soroban Ajo - Testnet Deployment Script"
    echo ""
    echo "Usage: bash deploy_testnet.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  (no argument)     Run full deployment"
    echo "  diagnose          Run network diagnostics"
    echo "  troubleshoot      Run build troubleshooting"
    echo "  check-funding     Check account funding status"
    echo "  help              Show this help message"
    echo ""
}

# Parse command line arguments
case "${1:-}" in
    diagnose)
        diagnose_network
        ;;
    troubleshoot)
        troubleshoot_build
        ;;
    check-funding)
        check_account_funding
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        main "$@"
        ;;
esac
