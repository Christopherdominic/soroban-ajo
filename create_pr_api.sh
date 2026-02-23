#!/bin/bash

# GitHub PR Creation Script
# This script will guide you through creating a PR via GitHub API

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          GitHub Pull Request Creation                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if gh is authenticated
if gh auth status &>/dev/null; then
    echo "✅ GitHub CLI is authenticated!"
    echo ""
    echo "Creating pull request..."
    
    gh pr create \
        --title "feat: Add emergency withdrawal mechanism for stalled groups" \
        --body-file PULL_REQUEST.md \
        --base master \
        --head feature/emergency-withdrawal-mechanism \
        --label enhancement \
        --label smart-contract
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Pull request created successfully!"
        gh pr view --web
    else
        echo ""
        echo "❌ Failed to create PR via CLI"
        echo "Opening browser for manual creation..."
        xdg-open "https://github.com/Markadrian6399/soroban-ajo/pull/new/feature/emergency-withdrawal-mechanism"
    fi
else
    echo "⚠️  GitHub CLI not authenticated"
    echo ""
    echo "Option 1: Authenticate now"
    echo "  gh auth login"
    echo ""
    echo "Option 2: Use web interface (opening browser...)"
    sleep 2
    xdg-open "https://github.com/Markadrian6399/soroban-ajo/pull/new/feature/emergency-withdrawal-mechanism"
    echo ""
    echo "📋 PR Description is in: PULL_REQUEST.md"
    echo "Copy and paste it into the GitHub PR form"
fi
