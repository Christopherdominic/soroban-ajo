# Test Suite Index

## Overview
This document provides an index of all test cases in the Soroban Ajo QA Testing Framework, organized by category. Each test case is documented in detail in its respective file.

**Total Test Cases**: 52
**Last Updated**: 2024-01-15

---

## Test Case Summary by Category

| Category | Total | Critical | High | Medium | Low | Automated |
|----------|-------|----------|------|--------|-----|-----------|
| Smart Contract | 15 | 5 | 7 | 2 | 1 | 14 |
| Frontend | 18 | 4 | 8 | 4 | 2 | 16 |
| Integration | 8 | 4 | 3 | 1 | 0 | 6 |
| End-to-End | 6 | 6 | 0 | 0 | 0 | 4 |
| Performance | 3 | 2 | 1 | 0 | 0 | 3 |
| Security | 2 | 2 | 0 | 0 | 0 | 0 |
| **TOTAL** | **52** | **23** | **19** | **7** | **3** | **43** |

---

## Smart Contract Test Cases (15)

### Group Creation (6 test cases)
- **TC-SC-001**: Create Group with Valid Parameters [Critical] [Automated]
- **TC-SC-002**: Create Group with Invalid Amount (Zero) [High] [Automated]
- **TC-SC-003**: Create Group with Invalid Cycle Duration [High] [Automated]
- **TC-SC-004**: Create Group with Invalid Max Members [High] [Automated]
- **TC-SC-005**: Create Group with Maximum Values [Medium] [Manual]
- **TC-SC-006**: Create Multiple Groups [High] [Automated]

### Member Joining (4 test cases)
- **TC-SC-007**: Join Group with Valid Member [Critical] [Automated]
- **TC-SC-008**: Join Group - Duplicate Member Prevention [High] [Automated]
- **TC-SC-009**: Join Group - Capacity Limit Enforcement [High] [Automated]
- **TC-SC-010**: Join Group - Already Complete Group [Medium] [Automated]

### Contributions (3 test cases)
- **TC-SC-011**: Contribute to Group - Valid Contribution [Critical] [Automated]
- **TC-SC-012**: Contribute - Double Contribution Prevention [High] [Automated]
- **TC-SC-013**: Contribute - Non-Member Rejection [High] [Automated]

### Payouts (2 test cases)
- **TC-SC-014**: Execute Payout - All Contributed [Critical] [Automated]
- **TC-SC-015**: Execute Payout - Incomplete Contributions [High] [Automated]

---

## Frontend Test Cases (18)

### Component Rendering (5 test cases)
- **TC-FE-001**: GroupCreationForm Renders Correctly [Critical] [Automated]
- **TC-FE-002**: GroupList Displays Groups [High] [Automated]
- **TC-FE-003**: WalletConnector Renders Connection Button [Critical] [Automated]
- **TC-FE-004**: ContributionForm Renders Input Fields [High] [Automated]
- **TC-FE-005**: GroupCard Displays Group Information [Medium] [Automated]

### User Interactions (4 test cases)
- **TC-FE-006**: Create Group Button Click [High] [Automated]
- **TC-FE-007**: Form Submission with Valid Data [Critical] [Automated]
- **TC-FE-008**: Navigation Between Pages [Medium] [Automated]
- **TC-FE-009**: Modal Open and Close [Low] [Automated]

### Form Validation (4 test cases)
- **TC-FE-010**: Contribution Amount Validation [High] [Automated]
- **TC-FE-011**: Cycle Duration Validation [High] [Automated]
- **TC-FE-012**: Max Members Validation [Medium] [Automated]
- **TC-FE-013**: Error Message Display [High] [Automated]

### Wallet Integration (3 test cases)
- **TC-FE-014**: Wallet Connection Flow [Critical] [Automated]
- **TC-FE-015**: Wallet Disconnection [High] [Automated]
- **TC-FE-016**: Account Switching [Medium] [Automated]

### UI States (2 test cases)
- **TC-FE-017**: Loading State Display [High] [Automated]
- **TC-FE-018**: Error State Display [Low] [Automated]

---

## Integration Test Cases (8)

### Frontend-Blockchain Communication (4 test cases)
- **TC-INT-001**: Create Group Integration [Critical] [Automated]
- **TC-INT-002**: Join Group Integration [Critical] [Automated]
- **TC-INT-003**: Contribute Integration [Critical] [Automated]
- **TC-INT-004**: Payout Integration [Critical] [Automated]

### Data Synchronization (2 test cases)
- **TC-INT-005**: UI Updates After Transaction [High] [Automated]
- **TC-INT-006**: Event Handling and Display [High] [Automated]

### Error Handling (2 test cases)
- **TC-INT-007**: Transaction Failure Handling [High] [Automated]
- **TC-INT-008**: Network Error Recovery [Medium] [Manual]

---

## End-to-End Test Cases (6)

### Complete User Flows (6 test cases)
- **TC-E2E-001**: Complete Group Creation Flow [Critical] [Automated]
- **TC-E2E-002**: Complete Contribution Flow [Critical] [Automated]
- **TC-E2E-003**: Complete Payout Flow [Critical] [Automated]
- **TC-E2E-004**: Full Lifecycle - 3 Members [Critical] [Automated]
- **TC-E2E-005**: Concurrent Contributions [Critical] [Manual]
- **TC-E2E-006**: Sequential Payouts [Critical] [Manual]

---

## Performance Test Cases (3)

### Smart Contract Performance (2 test cases)
- **TC-PERF-001**: Group Creation Gas Consumption [Critical] [Automated]
- **TC-PERF-002**: Contribution Gas Consumption [Critical] [Automated]

### Frontend Performance (1 test case)
- **TC-PERF-003**: Page Load Time [High] [Automated]

---

## Security Test Cases (2)

### Smart Contract Security (1 test case)
- **TC-SEC-001**: Access Control Validation [Critical] [Manual]

### Frontend Security (1 test case)
- **TC-SEC-002**: Input Sanitization [Critical] [Manual]

---

## Test Execution Priority

### Pre-Release (Must Execute)
All Critical priority test cases (23 total):
- TC-SC-001, TC-SC-007, TC-SC-011, TC-SC-014
- TC-FE-001, TC-FE-003, TC-FE-007, TC-FE-014
- TC-INT-001, TC-INT-002, TC-INT-003, TC-INT-004
- TC-E2E-001, TC-E2E-002, TC-E2E-003, TC-E2E-004, TC-E2E-005, TC-E2E-006
- TC-PERF-001, TC-PERF-002
- TC-SEC-001, TC-SEC-002

### Regular Testing (Should Execute)
All High priority test cases (19 total)

### Periodic Testing (Can Execute)
Medium and Low priority test cases (10 total)

---

## Automation Status

### Fully Automated (43 test cases)
- Smart Contract: 14/15 (93%)
- Frontend: 16/18 (89%)
- Integration: 6/8 (75%)
- End-to-End: 4/6 (67%)
- Performance: 3/3 (100%)
- Security: 0/2 (0%)

### Manual Testing Required (9 test cases)
- TC-SC-005: Maximum values testing
- TC-FE-009: Modal interactions (visual verification)
- TC-INT-008: Network error recovery
- TC-E2E-005: Concurrent contributions
- TC-E2E-006: Sequential payouts
- TC-SEC-001: Access control validation
- TC-SEC-002: Input sanitization

---

## Test Case File Locations

```
.qa-framework/test-cases/
├── smart-contract/
│   ├── TC-SC-001-create-group-valid-parameters.md
│   ├── TC-SC-002-create-group-invalid-amount.md
│   ├── TC-SC-003-create-group-invalid-duration.md
│   ├── TC-SC-004-create-group-invalid-max-members.md
│   ├── TC-SC-005-create-group-maximum-values.md
│   ├── TC-SC-006-create-multiple-groups.md
│   └── [9 more files...]
├── frontend/
│   ├── TC-FE-001-group-form-renders.md
│   ├── TC-FE-002-group-list-displays.md
│   └── [16 more files...]
├── integration/
│   ├── TC-INT-001-create-group-integration.md
│   └── [7 more files...]
├── e2e/
│   ├── TC-E2E-001-complete-group-creation.md
│   └── [5 more files...]
├── performance/
│   ├── TC-PERF-001-group-creation-gas.md
│   └── [2 more files...]
└── security/
    ├── TC-SEC-001-access-control.md
    └── TC-SEC-002-input-sanitization.md
```

---

## Coverage Mapping

### Requirements Coverage
- Requirement 2.1 (Group Creation): TC-SC-001 through TC-SC-006
- Requirement 2.2 (Member Joining): TC-SC-007 through TC-SC-010
- Requirement 2.3 (Contributions): TC-SC-011 through TC-SC-013
- Requirement 2.4 (Payouts): TC-SC-014, TC-SC-015
- Requirement 2.5 (Access Control): TC-SC-013, TC-SEC-001
- Requirement 2.6 (Error Handling): TC-SC-002, TC-SC-003, TC-SC-004
- Requirement 2.7 (Edge Cases): TC-SC-002, TC-SC-003, TC-SC-004, TC-SC-005
- Requirement 3.1 (Component Rendering): TC-FE-001 through TC-FE-005
- Requirement 3.2 (User Interactions): TC-FE-006 through TC-FE-009
- Requirement 3.3 (Form Validation): TC-FE-010 through TC-FE-013
- Requirement 3.4 (Wallet Integration): TC-FE-014 through TC-FE-016
- Requirement 3.5 (Data Display): TC-FE-002, TC-FE-005
- Requirement 3.6 (UI States): TC-FE-017, TC-FE-018
- Requirement 4.1 (E2E Group Creation): TC-E2E-001
- Requirement 4.2 (E2E Contribution): TC-E2E-002
- Requirement 4.3 (E2E Payout): TC-E2E-003
- Requirement 4.4 (Multi-User): TC-E2E-005, TC-E2E-006
- Requirement 4.5 (Error Recovery): TC-INT-007, TC-INT-008

---

## Test Execution Guidelines

### Running Automated Tests

#### Smart Contract Tests
```bash
cd contracts/ajo
cargo test
```

#### Frontend Tests
```bash
cd frontend
npm test
```

#### Integration Tests
```bash
cd frontend
npm test -- integration
```

#### All Tests
```bash
# From project root
./scripts/test.sh
```

### Manual Test Execution
1. Review test case document
2. Follow preconditions setup
3. Execute test steps in order
4. Record actual results
5. Update test status
6. Create bug report if failed

---

## Maintenance

### Adding New Test Cases
1. Determine appropriate category
2. Assign next available ID in category
3. Create test case file using template
4. Update this index document
5. Link to requirements
6. Implement automation if applicable

### Updating Test Cases
1. Update test case file
2. Update "Last Updated" date
3. Document changes in execution history
4. Update this index if category/priority changes

### Retiring Test Cases
1. Mark as deprecated in test case file
2. Document reason for retirement
3. Remove from this index
4. Archive file (don't delete)
5. Do not reuse test case ID

---

## Related Documents
- Test Case Management Guidelines: `.qa-framework/guidelines/test-case-management.md`
- Test Case Template: `.qa-framework/templates/test-case-template.md`
- Requirements Document: `.kiro/specs/qa-testing-framework/requirements.md`
- Design Document: `.kiro/specs/qa-testing-framework/design.md`

---

**Document Owner**: QA Team
**Review Frequency**: Monthly
**Next Review Date**: 2024-02-15
