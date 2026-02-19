# Soroban Ajo QA Testing Framework

## Overview

Welcome to the comprehensive Quality Assurance Testing Framework for the Soroban Ajo project. This framework provides standardized processes, templates, and guidelines to ensure quality across smart contracts, frontend components, and end-to-end user flows.

**Version**: 1.0
**Last Updated**: 2024-01-15
**Maintained By**: QA Team

---

## What's Included

This QA framework provides everything you need to ensure quality in the Soroban Ajo project:

### 📋 Templates
- Test Case Template
- Bug Report Template
- Test Execution Report Template

### 📚 Guidelines
- Test Case Management
- Bug Reporting and Triage
- Test Automation Strategy
- Performance Testing Guide

### ✅ Checklists
- Regression Test Checklist
- Security Testing Checklist
- Cross-Browser Testing Matrix
- Mobile Testing Guidelines

### 📊 Reports
- Quality Metrics Dashboard Template

### 🧪 Test Cases
- 52 comprehensive test cases covering:
  - Smart Contract functionality (15 test cases)
  - Frontend components (18 test cases)
  - Integration testing (8 test cases)
  - End-to-End flows (6 test cases)
  - Performance testing (3 test cases)
  - Security testing (2 test cases)

---

## Quick Start

### For QA Engineers

1. **Familiarize yourself with the framework**
   ```bash
   # Read the core guidelines
   cat .qa-framework/guidelines/test-case-management.md
   cat .qa-framework/guidelines/bug-reporting-and-triage.md
   ```

2. **Review existing test cases**
   ```bash
   # Browse test case index
   cat .qa-framework/test-cases/TEST-SUITE-INDEX.md
   ```

3. **Run automated tests**
   ```bash
   # Smart contract tests
   cd contracts/ajo
   cargo test
   
   # Frontend tests
   cd frontend
   npm test
   ```

4. **Create new test cases**
   - Use the test case template: `.qa-framework/templates/test-case-template.md`
   - Follow naming convention: `TC-[CATEGORY]-[NUMBER]-[description].md`
   - Update the test suite index

### For Developers

1. **Write tests for new features**
   - Smart contracts: Add tests to `contracts/ajo/tests/`
   - Frontend: Add tests co-located with components

2. **Run tests before committing**
   ```bash
   # Run all tests
   ./scripts/test.sh
   ```

3. **Check test coverage**
   ```bash
   # Smart contract coverage
   cd contracts/ajo
   cargo tarpaulin --out Html
   
   # Frontend coverage
   cd frontend
   npm run test:coverage
   ```

### For Project Managers

1. **Review quality metrics**
   - Check latest test execution report in `.qa-framework/reports/`
   - Review quality dashboard for trends

2. **Monitor quality gates**
   - Pass rate > 95%
   - Critical defects = 0
   - Test coverage > 80%

3. **Make release decisions**
   - Review regression test results
   - Check security testing status
   - Verify performance benchmarks met

---

## Directory Structure

```
.qa-framework/
├── README.md                          # This file
├── templates/                         # Document templates
│   ├── test-case-template.md
│   ├── bug-report-template.md
│   └── test-execution-report-template.md
├── guidelines/                        # Testing guidelines
│   ├── test-case-management.md
│   ├── bug-reporting-and-triage.md
│   ├── test-automation-strategy.md
│   └── performance-testing-guide.md
├── checklists/                        # Testing checklists
│   ├── regression-test-checklist.md
│   ├── security-testing-checklist.md
│   ├── cross-browser-testing-matrix.md
│   └── mobile-testing-guidelines.md
├── test-cases/                        # Test case repository
│   ├── TEST-SUITE-INDEX.md
│   ├── smart-contract/
│   │   ├── TC-SC-001-create-group-valid-parameters.md
│   │   ├── TC-SC-002-create-group-invalid-amount.md
│   │   └── [13 more test cases...]
│   ├── frontend/
│   │   └── [18 test cases...]
│   ├── integration/
│   │   └── [8 test cases...]
│   ├── e2e/
│   │   └── [6 test cases...]
│   ├── performance/
│   │   └── [3 test cases...]
│   └── security/
│       └── [2 test cases...]
└── reports/                           # Quality reports
    └── quality-metrics-dashboard-template.md
```

---

## Key Concepts

### Test Categories

1. **Smart_Contract (SC)**: Tests for Soroban smart contract functionality
2. **Frontend (FE)**: Tests for React/TypeScript UI components
3. **Integration (INT)**: Tests for frontend-blockchain communication
4. **End_to_End (E2E)**: Tests for complete user workflows
5. **Performance (PERF)**: Tests for performance benchmarks
6. **Security (SEC)**: Tests for security vulnerabilities

### Test Priorities

- **Critical**: Must work for system to be usable
- **High**: Important functionality with significant impact
- **Medium**: Standard functionality with moderate impact
- **Low**: Minor functionality with minimal impact

### Test Statuses

- **Not_Run**: Test not yet executed
- **Passed**: Test executed successfully
- **Failed**: Test did not produce expected results
- **Blocked**: Test cannot be executed due to dependencies
- **Skipped**: Test intentionally not executed

---

## Testing Workflows

### Creating a New Test Case

1. Determine test category (SC, FE, INT, E2E, PERF, SEC)
2. Assign next available test ID (check TEST-SUITE-INDEX.md)
3. Copy test case template
4. Fill in all required fields
5. Save to appropriate category folder
6. Update TEST-SUITE-INDEX.md
7. Implement automated test (if applicable)

### Reporting a Bug

1. Copy bug report template
2. Assign next available bug ID (check bug ID registry)
3. Fill in all required fields
4. Determine severity and priority
5. Attach screenshots/logs
6. Submit to bug tracking system
7. Link to failed test case (if applicable)

### Executing Regression Tests

1. Review regression test checklist
2. Prepare test environment
3. Execute tests in specified order
4. Record results
5. Create bug reports for failures
6. Generate test execution report
7. Assess quality gates
8. Make release recommendation

---

## Quality Metrics

### Key Performance Indicators (KPIs)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Test Pass Rate | > 95% | [TBD] | [TBD] |
| Test Coverage | > 80% | [TBD] | [TBD] |
| Automation Rate | > 85% | [TBD] | [TBD] |
| Critical Defects | 0 | [TBD] | [TBD] |
| Defect Density | < 2/KLOC | [TBD] | [TBD] |

### Quality Gates

Before release, verify:
- ✓ All Critical tests pass (100%)
- ✓ Overall pass rate > 95%
- ✓ No Critical or High severity bugs open
- ✓ Test coverage > 80%
- ✓ All security tests pass
- ✓ Performance benchmarks met

---

## Testing Tools

### Smart Contract Testing
- **Framework**: Rust built-in test framework
- **Coverage**: cargo-tarpaulin
- **Execution**: `cargo test`

### Frontend Testing
- **Framework**: Vitest + React Testing Library
- **Coverage**: Vitest coverage
- **Execution**: `npm test`

### Performance Testing
- **Smart Contracts**: Soroban profiling tools
- **Frontend**: Lighthouse, Chrome DevTools
- **Load Testing**: Artillery, k6

### Security Testing
- **Static Analysis**: cargo clippy, cargo audit, npm audit
- **Dynamic Analysis**: OWASP ZAP, Burp Suite
- **Penetration Testing**: Manual security testing

### Cross-Browser Testing
- **Manual**: Chrome, Firefox, Safari, Edge
- **Automated**: Playwright, BrowserStack

### Mobile Testing
- **Devices**: iOS Simulator, Android Emulator, Real devices
- **Tools**: Chrome DevTools Device Mode, BrowserStack

---

## Best Practices

### Test Case Writing
✓ Write clear, concise test cases
✓ Use descriptive test IDs and titles
✓ Include both positive and negative tests
✓ Test edge cases and boundaries
✓ Link tests to requirements
✓ Keep tests independent and isolated

### Test Automation
✓ Automate repetitive tests
✓ Prioritize Critical and High priority tests
✓ Maintain test code quality
✓ Run tests in CI/CD pipeline
✓ Monitor test execution time
✓ Fix flaky tests immediately

### Bug Reporting
✓ Provide clear reproduction steps
✓ Include screenshots and logs
✓ Assign appropriate severity/priority
✓ Link to failed test cases
✓ Follow up on bug fixes
✓ Verify fixes before closing

### Quality Monitoring
✓ Track metrics over time
✓ Identify trends early
✓ Address quality issues promptly
✓ Communicate status regularly
✓ Continuously improve processes

---

## Common Tasks

### Running All Tests

```bash
# Smart contract tests
cd contracts/ajo
cargo test --verbose

# Frontend tests
cd frontend
npm test -- --run

# With coverage
cd contracts/ajo
cargo tarpaulin --out Html

cd frontend
npm run test:coverage
```

### Creating a Test Execution Report

1. Copy template: `.qa-framework/templates/test-execution-report-template.md`
2. Fill in test results
3. Calculate metrics
4. Assess quality gates
5. Make release recommendation
6. Save to `.qa-framework/reports/`
7. Distribute to stakeholders

### Updating Test Cases

1. Locate test case file
2. Update test steps or expected results
3. Update "Last Updated" date
4. Document changes in execution history
5. Re-execute test to verify changes
6. Update TEST-SUITE-INDEX.md if needed

---

## Continuous Improvement

### Framework Maintenance

- **Monthly**: Review test case coverage, update test cases
- **Quarterly**: Review framework effectiveness, update guidelines
- **Annually**: Major framework review and updates

### Feedback

We welcome feedback on the QA framework:
- Suggest improvements via GitHub issues
- Propose new test cases
- Report framework issues
- Share best practices

---

## Support and Resources

### Documentation
- Requirements: `.kiro/specs/qa-testing-framework/requirements.md`
- Design: `.kiro/specs/qa-testing-framework/design.md`
- Tasks: `.kiro/specs/qa-testing-framework/tasks.md`

### External Resources
- [Soroban Testing Docs](https://soroban.stellar.org/docs/getting-started/testing)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

### Contact
- QA Team Lead: [Name]
- Email: [Email]
- Slack: #qa-testing

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024-01-15 | Initial framework release | QA Team |

---

## License

This QA framework is part of the Soroban Ajo project and follows the same MIT license.

---

**Happy Testing! 🧪**

For questions or support, contact the QA team or refer to the documentation in this framework.
