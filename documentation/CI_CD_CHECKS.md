# CI/CD Pipeline Documentation

## Overview

Comprehensive CI/CD pipeline with issue resolution verification, test coverage checks, performance benchmarks, and accessibility tests.

## Workflows

### 1. Main CI Pipeline (`ci.yml`)

Runs on: Push to main/develop, Pull Requests

**Jobs:**

#### Lint & Type Check

- ESLint validation
- TypeScript type checking
- Frontend and backend code quality

#### Build Verification

- Frontend Next.js build
- Backend TypeScript compilation
- Artifact upload for deployment

#### Smart Contract Build

- Rust/Soroban contract compilation
- Contract tests
- WASM artifact generation

#### Security Audit

- npm audit for vulnerabilities
- Dependency security scanning

#### PR Validation (PR only)

- Semantic PR title validation
- Issue link verification
- Merge conflict detection
- Test file verification
- Code complexity checks

### 2. PR Quality Checks (`pr-checks.yml`)

Runs on: PR opened, synchronized, reopened, edited

**Jobs:**

#### Issue Resolution Verification ✨ NEW

- **Verifies linked issue exists**
- **Checks issue is open**
- **Validates closure keywords** (fixes, closes, resolves)
- **Fails if no issue linked**

Example:

```markdown
Fixes #123
Closes #456
Resolves #789
```

#### Test Coverage Check ✨ NEW

- **Runs tests with coverage**
- **Enforces minimum 70% coverage**
- **Uploads to Codecov**
- **Fails if below threshold**

Coverage metrics:

- Line coverage
- Statement coverage
- Function coverage
- Branch coverage

#### Performance Benchmarks ✨ NEW

- **Bundle size analysis**
- **Lighthouse CI scores**
- **Detects large bundles (>500KB)**
- **Performance regression detection**

Metrics tracked:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

#### Accessibility Tests ✨ NEW

- **ARIA attribute validation**
- **Semantic HTML checks**
- **Keyboard navigation support**
- **Screen reader compatibility**

Checks:

- `jsx-a11y/alt-text`
- `jsx-a11y/aria-props`
- `jsx-a11y/role-has-required-aria-props`
- ARIA labels and roles

#### Code Quality Checks

- Console.log detection (excludes examples/)
- File size validation
- TODO/FIXME tracking
- Sensitive data detection
- Error handling verification

#### Dependency Review

- Security vulnerability scanning
- License compliance (denies GPL-3.0, AGPL-3.0)
- Outdated dependency detection

#### Documentation Check ✨ NEW

- **README update verification**
- **JSDoc/TSDoc comment checks**
- **Inline documentation validation**

#### PR Summary

- Aggregates all check results
- Posts summary comment
- Provides improvement tips

### 3. Issue Resolution Tracking (`issue-resolution.yml`) ✨ NEW

Runs on: PR events, Issue events

**Jobs:**

#### Track Resolution

- **Extracts linked issues from PR**
- **Verifies issue details**
- **Checks acceptance criteria**
- **Posts resolution report**

Report includes:

- Issue state (open/closed)
- Labels and assignees
- Creation/update dates
- Acceptance criteria presence
- Verification checklist

#### Validate Closure

- **Ensures issues closed by merged PRs**
- **Warns if closed without PR**
- **Tracks closure patterns**

#### Resolution Metrics

- **Calculates resolution time**
- **Adds time-based labels**:
  - `resolved-quickly` (≤1 day)
  - `resolved-normal` (≤7 days)
  - `resolved-slowly` (>7 days)
- **Posts resolution summary**

## Required Checks

### For All PRs

1. ✅ **Issue Link** - Must reference an issue
2. ✅ **Semantic Title** - Must follow conventional commits
3. ✅ **No Console Logs** - Remove debug statements
4. ✅ **No Sensitive Data** - No hardcoded secrets
5. ✅ **Lint Passing** - Code style compliance
6. ✅ **Type Check Passing** - No TypeScript errors
7. ✅ **Build Success** - All builds complete
8. ✅ **Tests Passing** - All tests pass

### For Feature PRs

9. ✅ **Test Coverage** - Minimum 70% coverage
10. ✅ **Test Files Added** - New tests for new features
11. ✅ **Documentation Updated** - README or docs updated
12. ✅ **No Breaking Changes** - Or clearly documented

### For Bug Fix PRs

13. ✅ **Issue Linked** - References bug report
14. ✅ **Regression Tests** - Tests prevent recurrence
15. ✅ **Root Cause Documented** - In PR description

## Configuration

### Coverage Thresholds

```json
{
  "lines": 70,
  "statements": 70,
  "functions": 70,
  "branches": 70
}
```

### Performance Budgets

- Bundle size: < 500KB per chunk
- FCP: < 1.8s
- LCP: < 2.5s
- TTI: < 3.8s
- CLS: < 0.1

### Accessibility Standards

- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes

## Issue Linking

### Supported Keywords

**Closes an issue:**

- `Fixes #123`
- `Closes #456`
- `Resolves #789`

**References an issue:**

- `Relates to #123`
- `See #456`
- `Part of #789`

### Best Practices

1. **Link in PR Description:**

   ```markdown
   ## Description

   This PR fixes the login bug.

   Fixes #123
   ```

2. **Multiple Issues:**

   ```markdown
   Fixes #123, #456
   Closes #789
   ```

3. **Full URL:**
   ```markdown
   Fixes https://github.com/owner/repo/issues/123
   ```

## Test Coverage

### Running Locally

```bash
# Frontend
cd frontend
npm test -- --coverage

# Backend
cd backend
npm test -- --coverage

# Contracts
cd contracts/ajo
cargo test
```

### Coverage Reports

- HTML report: `coverage/lcov-report/index.html`
- JSON summary: `coverage/coverage-summary.json`
- LCOV format: `coverage/lcov.info`

### Improving Coverage

1. Add unit tests for new functions
2. Add integration tests for features
3. Add E2E tests for user flows
4. Test error cases and edge cases

## Performance Benchmarks

### Running Locally

```bash
# Build and analyze
cd frontend
npm run build
npm run analyze

# Lighthouse
npx lighthouse http://localhost:3000 --view
```

### Optimization Tips

1. Code splitting
2. Lazy loading
3. Image optimization
4. Tree shaking
5. Minification

## Accessibility Testing

### Running Locally

```bash
# ESLint a11y rules
cd frontend
npx eslint . --ext .tsx,.jsx

# axe-core
npm install -D @axe-core/react
```

### Manual Testing

1. Keyboard navigation (Tab, Enter, Esc)
2. Screen reader (NVDA, JAWS, VoiceOver)
3. Color contrast (4.5:1 minimum)
4. Focus indicators
5. Alt text for images

## Troubleshooting

### Issue Link Not Found

**Problem:** "No linked issue found"

**Solution:**

1. Add `Fixes #123` to PR description
2. Ensure issue number is correct
3. Check issue exists and is open

### Coverage Below Threshold

**Problem:** "Coverage 65% is below threshold 70%"

**Solution:**

1. Add tests for uncovered code
2. Run `npm test -- --coverage` locally
3. Check coverage report for gaps

### Performance Budget Exceeded

**Problem:** "Large bundle detected"

**Solution:**

1. Use dynamic imports
2. Optimize images
3. Remove unused dependencies
4. Enable tree shaking

### Accessibility Violations

**Problem:** "Missing alt text"

**Solution:**

1. Add `alt` attribute to images
2. Use semantic HTML
3. Add ARIA labels
4. Test with keyboard

## CI/CD Status Badges

Add to README.md:

```markdown
![CI](https://github.com/owner/repo/workflows/CI%2FCD%20Pipeline/badge.svg)
![PR Checks](https://github.com/owner/repo/workflows/PR%20Quality%20Checks/badge.svg)
![Coverage](https://codecov.io/gh/owner/repo/branch/main/graph/badge.svg)
```

## Workflow Triggers

### Push Events

- `ci.yml` - All jobs except PR-specific

### Pull Request Events

- `ci.yml` - All jobs
- `pr-checks.yml` - All jobs
- `issue-resolution.yml` - Track resolution

### Issue Events

- `issue-resolution.yml` - Validate closure

## Environment Variables

### Required

- `GITHUB_TOKEN` - Automatic (provided by GitHub)

### Optional

- `CODECOV_TOKEN` - For coverage uploads
- `LIGHTHOUSE_TOKEN` - For Lighthouse CI

## Best Practices

### For Contributors

1. ✅ Link issues in PR description
2. ✅ Write tests for new code
3. ✅ Update documentation
4. ✅ Remove console.log statements
5. ✅ Follow semantic commit messages
6. ✅ Keep PRs focused and small
7. ✅ Respond to review comments
8. ✅ Ensure all checks pass

### For Reviewers

1. ✅ Verify issue is addressed
2. ✅ Check test coverage
3. ✅ Review performance impact
4. ✅ Validate accessibility
5. ✅ Ensure documentation updated
6. ✅ Check for breaking changes
7. ✅ Verify security implications

## Metrics Dashboard

Track these metrics:

- **Issue Resolution Time** - Average days to close
- **Test Coverage** - Percentage over time
- **Build Success Rate** - Percentage of passing builds
- **Performance Scores** - Lighthouse scores trend
- **Accessibility Score** - Violations over time

## Future Enhancements

- [ ] Visual regression testing
- [ ] E2E test automation
- [ ] Automated dependency updates
- [ ] Security scanning (SAST/DAST)
- [ ] Container scanning
- [ ] Infrastructure as Code validation
- [ ] Automated changelog generation
- [ ] Release automation

---

**Status**: ✅ Fully Implemented and Active

All CI/CD checks are now enforced on every PR to ensure code quality, test coverage, performance, and accessibility standards.
