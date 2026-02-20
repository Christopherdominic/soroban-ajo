#!/bin/bash

# CI/CD Pipeline Verification Script
# This script runs the same checks as the GitHub Actions CI/CD pipeline

set -e  # Exit on any error

echo "========================================="
echo "CI/CD Pipeline Verification"
echo "========================================="
echo ""

cd contracts/ajo

echo "✓ Step 1: Check Formatting"
echo "-----------------------------------------"
cargo fmt -- --check
echo "✅ Formatting check PASSED"
echo ""

echo "✓ Step 2: Run Clippy (Linting)"
echo "-----------------------------------------"
cargo clippy -- -D warnings
echo "✅ Clippy check PASSED"
echo ""

echo "✓ Step 3: Build Contract (wasm32)"
echo "-----------------------------------------"
cargo build --target wasm32-unknown-unknown --release
echo "✅ Build PASSED"
echo ""

echo "========================================="
echo "✅ ALL CI/CD CHECKS PASSED!"
echo "========================================="
echo ""
echo "The codebase is ready for deployment."
