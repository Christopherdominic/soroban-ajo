#!/bin/bash

# Drips Monorepo Quick Start Script
# This script sets up the entire development environment

set -e

echo "🚀 Drips Monorepo Setup"
echo "======================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -f ".env.local" ]; then
    echo "📝 Creating frontend/.env.local from example..."
    cp .env.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your configuration"
fi
npm install
cd ..

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
    echo "📝 Creating backend/.env from example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Configure environment variables:"
echo "   - Edit frontend/.env.local"
echo "   - Edit backend/.env"
echo ""
echo "2. Deploy smart contract (if not done):"
echo "   cd contracts/ajo"
echo "   stellar contract build"
echo "   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/ajo.wasm --network testnet"
echo ""
echo "3. Start development:"
echo "   npm run dev"
echo ""
echo "   Or separately:"
echo "   npm run dev:frontend  # http://localhost:3000"
echo "   npm run dev:backend   # http://localhost:3001"
echo ""
echo "Happy coding! 🎉"
