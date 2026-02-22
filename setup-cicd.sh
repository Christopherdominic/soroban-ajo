#!/bin/bash

echo "🚀 Setting up CI/CD for Drips Repository"
echo "========================================"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --save-dev husky@8.0.3 lint-staged@15.2.0 prettier@3.2.0

# Initialize Husky
echo "🪝 Initializing Husky..."
npx husky install

# Make hooks executable
echo "🔐 Making hooks executable..."
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

echo ""
echo "✅ CI/CD setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure branch protection rules on GitHub (see documentation/CI_CD_SETUP.md)"
echo "2. Test pre-commit hook: Try committing code with console.log"
echo "3. Test commit-msg hook: Try an invalid commit message"
echo ""
echo "To test locally:"
echo "  npm run lint        # Run linting"
echo "  npm run type-check  # Run type checking"
echo "  npm run build       # Build all packages"
echo ""
