#!/bin/bash
# Script to create pull request for emergency withdrawal feature

echo "Creating Pull Request..."
echo ""
echo "Authenticating with GitHub CLI..."
gh auth login

echo ""
echo "Creating pull request..."
gh pr create \
  --title "feat: Add emergency withdrawal mechanism for stalled groups" \
  --body-file PULL_REQUEST.md \
  --base master \
  --label enhancement \
  --label smart-contract

echo ""
echo "Pull request created successfully!"
