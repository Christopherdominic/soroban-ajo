# CI/CD Quick Reference

## 🚀 Quick Checklist for PRs

### Before Creating PR

- [ ] Link issue in description: `Fixes #123`
- [ ] Write tests for changes
- [ ] Run tests locally: `npm test`
- [ ] Check coverage: `npm test -- --coverage`
- [ ] Remove console.log statements
- [ ] Update documentation
- [ ] Run lint: `npm run lint`
- [ ] Run type check: `npm run type-check`

### PR Title Format

```
<type>: <description>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
```

Examples:

- `feat: add user profile page`
- `fix: resolve login authentication bug`
- `docs: update API documentation`

### Issue Linking

```markdown
Fixes #123
Closes #456
Resolves #789
```

## 📊 CI/CD Checks

### Automatic Checks

| Check          | Threshold | Action            |
| -------------- | --------- | ----------------- |
| Issue Link     | Required  | Fails if missing  |
| Test Coverage  | ≥70%      | Fails if below    |
| Console.log    | None      | Fails if found    |
| Sensitive Data | None      | Fails if found    |
| Lint           | Pass      | Fails on errors   |
| Type Check     | Pass      | Fails on errors   |
| Build          | Success   | Fails on error    |
| Bundle Size    | <500KB    | Warns if exceeded |

### Performance Metrics

- FCP: < 1.8s
- LCP: < 2.5s
- TTI: < 3.8s
- CLS: < 0.1

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- ARIA attributes

## 🔧 Local Testing

### Run All Tests

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test

# Contracts
cd contracts/ajo
cargo test
```

### Check Coverage

```bash
cd frontend
npm test -- --coverage
open coverage/lcov-report/index.html
```

### Performance Check

```bash
cd frontend
npm run build
npm run analyze
```

### Accessibility Check

```bash
cd frontend
npx eslint . --ext .tsx,.jsx
```

## 🐛 Troubleshooting

### "No linked issue found"

**Fix:** Add `Fixes #123` to PR description

### "Coverage below threshold"

**Fix:** Add tests, check `coverage/lcov-report/index.html`

### "Console.log detected"

**Fix:** Remove all console.log statements (except in examples/)

### "Sensitive data detected"

**Fix:** Remove hardcoded secrets, use environment variables

### "Build failed"

**Fix:** Run `npm run build` locally, fix errors

### "Lint errors"

**Fix:** Run `npm run lint -- --fix`

### "Type errors"

**Fix:** Run `npm run type-check`, fix TypeScript errors

## 📝 PR Template Sections

1. **Description** - What changed and why
2. **Related Issue** - Link with `Fixes #123`
3. **Type of Change** - Bug fix, feature, etc.
4. **Changes Made** - Bullet list of changes
5. **Testing** - How you tested
6. **Screenshots** - Visual changes
7. **Performance** - Impact assessment
8. **Accessibility** - Compliance confirmation
9. **Documentation** - Updates made
10. **Checklist** - All items checked

## 🎯 Best Practices

### DO ✅

- Link issues in PR description
- Write tests for new code
- Update documentation
- Use semantic commit messages
- Keep PRs focused and small
- Respond to review comments
- Ensure all checks pass

### DON'T ❌

- Submit PRs without issue links
- Skip writing tests
- Leave console.log statements
- Hardcode sensitive data
- Create large PRs (>500 lines)
- Ignore failing checks
- Force push after review

## 📚 Documentation

- **Full Guide**: `documentation/CI_CD_CHECKS.md`
- **PR Template**: `.github/PULL_REQUEST_TEMPLATE.md`
- **Contributing**: `CONTRIBUTING.md`

## 🆘 Need Help?

1. Check the documentation
2. Review failed check logs
3. Ask in PR comments
4. Contact maintainers

---

**Remember**: All checks must pass before merge! 🎉
