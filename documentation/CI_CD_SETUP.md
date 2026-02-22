# CI/CD Setup Guide

## Overview

This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD) to ensure code quality, prevent breaking changes, and automate deployments.

## 🔒 Branch Protection Rules

### Setting Up Branch Protection

To prevent unapproved changes from breaking the repository, configure the following branch protection rules on GitHub:

1. Go to **Settings** → **Branches** → **Add rule**
2. Apply to: `main`

#### Required Settings:

- ✅ **Require a pull request before merging**
  - Require approvals: **1** (increase to 2 for production)
  - Dismiss stale pull request approvals when new commits are pushed
  - Require review from Code Owners

- ✅ **Require status checks to pass before merging**
  - Require branches to be up to date before merging
  - Required status checks:
    - `Lint & Type Check`
    - `Build Verification`
    - `Build Smart Contracts`
    - `Security Audit`
    - `Code Quality Checks`

- ✅ **Require conversation resolution before merging**

- ✅ **Require signed commits** (recommended)

- ✅ **Require linear history** (prevents merge commits)

- ✅ **Do not allow bypassing the above settings**
  - Include administrators (prevents even admins from bypassing rules)

- ✅ **Restrict who can push to matching branches**
  - Add specific users/teams who can approve

### For `develop` branch:

Apply similar rules but with slightly relaxed requirements:
- Require approvals: **1**
- Allow force pushes for maintainers only

## 🚀 CI/CD Workflows

### 1. Main CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main` and `develop`.

**Jobs:**
- **Lint & Type Check**: ESLint + TypeScript validation
- **Build Verification**: Frontend (Next.js) + Backend (Express)
- **Smart Contracts**: Rust/Soroban contract build + tests
- **Security Audit**: npm audit for vulnerabilities
- **PR Validation**: Conventional commits, merge conflicts check
- **Deploy Preview**: Preview deployment info for PRs

### 2. PR Quality Checks (`.github/workflows/pr-checks.yml`)

Additional checks specifically for pull requests:

- Console.log detection
- Large file warnings
- TODO/FIXME tracking
- Dependency validation
- Sensitive data scanning
- Code statistics

### 3. Auto-Merge (`.github/workflows/auto-merge.yml`)

Automatically merges Dependabot PRs for:
- Patch version updates
- Minor version updates

Major version updates require manual review.

## 🪝 Git Hooks (Husky)

Pre-commit and commit-msg hooks prevent bad code from being committed.

### Setup Husky

```bash
# Install dependencies (includes husky)
npm install

# Enable Git hooks
npx husky install

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Pre-commit Hook

Runs before each commit:
- ❌ Blocks console.log statements
- ❌ Blocks merge conflict markers
- ⚠️ Warns about large files (>1MB)
- 🔎 Runs lint-staged (ESLint + Prettier on staged files)

### Commit Message Hook

Enforces conventional commit format:

```
type(scope): subject

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
```

**Examples:**
```bash
git commit -m "feat(auth): add wallet connection"
git commit -m "fix(dashboard): resolve loading state"
git commit -m "docs: update README"
```

## 📝 Pull Request Template

When creating a PR, you'll see a template that requires:

- **Description** of changes
- **Type of change** (feature, bug fix, etc.)
- **Related issues** (links)
- **Testing checklist** (local tests, UI tests, etc.)
- **Code quality checklist** (style, self-review, documentation)
- **Smart contract checklist** (if applicable)

**All checklist items must be marked before approval.**

## 🔐 Required Checks Before Merge

A PR cannot be merged unless:

1. ✅ All CI jobs pass (lint, build, tests)
2. ✅ At least 1 approval from a reviewer
3. ✅ All conversations resolved
4. ✅ Branch is up-to-date with base branch
5. ✅ No merge conflicts
6. ✅ Commit messages follow conventional format
7. ✅ PR template filled out completely

## 🚨 What Gets Blocked

The following will **prevent commits/PRs**:

- ❌ `console.log()` statements
- ❌ ESLint errors
- ❌ TypeScript errors
- ❌ Build failures
- ❌ Test failures
- ❌ Merge conflicts
- ❌ Invalid commit messages
- ❌ Unapproved PRs to `main`
- ❌ High/critical security vulnerabilities

## ⚠️ What Gets Warned

The following generate **warnings** but don't block:

- ⚠️ Large files (>1MB)
- ⚠️ TODO/FIXME comments
- ⚠️ Dependency issues
- ⚠️ Moderate security vulnerabilities (reviewed manually)

## 🎯 Workflow for Contributors

### 1. Create a Feature Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

Write your code following the style guide.

### 3. Commit with Conventional Format

```bash
git add .
git commit -m "feat(component): add new feature"
```

Pre-commit hooks will automatically:
- Check for console.log
- Run ESLint
- Run Prettier
- Validate commit message format

### 4. Push and Create PR

```bash
git push origin feat/your-feature-name
```

Then create a PR on GitHub.

### 5. Fill Out PR Template

Complete all sections of the PR template.

### 6. Wait for CI Checks

All CI checks must pass before requesting review.

### 7. Request Review

Tag reviewers once CI passes.

### 8. Address Feedback

Make requested changes and push new commits.

### 9. Merge

Once approved and all checks pass, the PR can be merged.

## 🛠️ Local Development Commands

```bash
# Run linting
npm run lint

# Fix lint issues
npm run lint -- --fix

# Type check
npm run type-check

# Run all checks locally
npm run lint && npm run type-check && npm run build
```

## 🔧 Troubleshooting

### Husky hooks not running?

```bash
npx husky install
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Commit message rejected?

Use conventional commits format:
```bash
git commit -m "type(scope): description"
```

### CI failing but works locally?

- Clear caches: Delete `node_modules`, run `npm ci`
- Check Node version matches CI (18.x)
- Ensure all tests pass locally

### Need to bypass hooks temporarily?

**Not recommended**, but:
```bash
git commit --no-verify -m "message"
```

⚠️ **Warning**: This will still fail in CI!

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)

## 🎖️ Best Practices

1. **Always pull before creating a new branch**
2. **Keep PRs small and focused** (< 500 lines changed)
3. **Write descriptive commit messages**
4. **Add tests for new features**
5. **Update documentation** when changing functionality
6. **Respond to review comments promptly**
7. **Squash commits** before merging for clean history
8. **Delete branches** after merging

---

## Setup Checklist

- [ ] Configure branch protection rules on GitHub
- [ ] Install Husky hooks: `npx husky install`
- [ ] Make hooks executable: `chmod +x .husky/*`
- [ ] Test pre-commit hook: Try committing with `console.log`
- [ ] Test commit-msg hook: Try invalid commit message
- [ ] Create a test PR to verify CI pipeline
- [ ] Add required reviewers/code owners
- [ ] Enable required status checks
- [ ] Configure deployment secrets (if needed)

**Protection Status**: Once configured, no contributor can push directly to `main` or merge unapproved code. ✅
