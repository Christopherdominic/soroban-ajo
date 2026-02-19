# Regression Test Checklist

## Overview

This document defines the regression test suite for the Soroban Ajo project. Regression testing ensures that existing functionality continues to work correctly after code changes, bug fixes, or new feature additions.

**Purpose**: Validate that critical functionality remains intact after changes
**Execution Frequency**: Before every release, after major changes, weekly scheduled runs
**Target Completion Time**: < 2 hours for full regression suite

---

## Critical Path Definition

The **Critical Path** represents the essential user flows that must work for the system to be functional. These are the minimum viable operations that users must be able to perform.

### Critical Path User Flows

1. **Group Creation Flow**
   - User can create a new savings group
   - Group is initialized with correct parameters
   - Creator is added as first member

2. **Member Joining Flow**
   - User can discover existing groups
   - User can join an available group
   - Member is added to group member list

3. **Contribution Flow**
   - Member can make contribution to their group
   - Contribution is recorded correctly
   - Contribution status is updated

4. **Payout Flow**
   - Payout can be executed when all members contribute
   - Correct member receives payout
   - Group advances to next cycle or completes

### Critical Path Components

**Smart Contract Operations**:
- `create_group()` - Group creation
- `join_group()` - Member registration
- `contribute()` - Contribution recording
- `execute_payout()` - Payout distribution
- `get_group()` - Group data retrieval
- `is_member()` - Membership verification

**Frontend Components**:
- GroupCreationForm - Create new groups
- GroupList - Display available groups
- WalletConnector - Connect wallet
- ContributionForm - Submit contributions
- GroupDetailPage - View group information

**Integration Points**:
- Wallet connection
- Transaction submission
- Blockchain data fetching
- UI state updates

---

## Regression Test Suite

### Execution Order

Tests should be executed in this order to ensure dependencies are met:

1. **Smart Contract Tests** (Foundation)
2. **Frontend Component Tests** (UI Layer)
3. **Integration Tests** (Communication Layer)
4. **End-to-End Tests** (Complete Flows)

---

## Smart Contract Regression Tests

### Group Creation Tests

- [ ] **TC-SC-001**: Create Group with Valid Parameters
  - **Priority**: Critical
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: Group created with ID 1, all parameters correct
  - **Failure Impact**: System unusable - cannot create groups

- [ ] **TC-SC-002**: Create Group with Invalid Amount
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Error "InvalidAmount" returned
  - **Failure Impact**: Invalid data accepted, potential financial issues

- [ ] **TC-SC-003**: Create Group with Invalid Duration
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Error "InvalidCycleDuration" returned
  - **Failure Impact**: Invalid groups can be created

- [ ] **TC-SC-004**: Create Group with Invalid Max Members
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Error "InvalidMaxMembers" returned
  - **Failure Impact**: Non-functional groups can be created

### Member Joining Tests

- [ ] **TC-SC-007**: Join Group with Valid Member
  - **Priority**: Critical
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: Member added to group, member count increases
  - **Failure Impact**: Users cannot join groups

- [ ] **TC-SC-008**: Join Group - Duplicate Prevention
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Error "AlreadyMember" returned
  - **Failure Impact**: Duplicate members allowed, breaks payout logic

- [ ] **TC-SC-009**: Join Group - Capacity Limit
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Error "GroupFull" returned
  - **Failure Impact**: Groups exceed capacity, breaks rotation

### Contribution Tests

- [ ] **TC-SC-011**: Valid Contribution
  - **Priority**: Critical
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: Contribution recorded, status updated
  - **Failure Impact**: Cannot record contributions

- [ ] **TC-SC-012**: Double Contribution Prevention
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Error "AlreadyContributed" returned
  - **Failure Impact**: Members can contribute multiple times

- [ ] **TC-SC-013**: Non-Member Contribution Rejection
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Error "NotMember" returned
  - **Failure Impact**: Non-members can contribute

### Payout Tests

- [ ] **TC-SC-014**: Execute Payout - All Contributed
  - **Priority**: Critical
  - **Estimated Time**: 3 minutes
  - **Pass Criteria**: Payout executed, cycle advances, correct recipient
  - **Failure Impact**: Payouts don't work, system unusable

- [ ] **TC-SC-015**: Execute Payout - Incomplete Contributions
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Error "IncompleteContributions" returned
  - **Failure Impact**: Premature payouts possible

**Smart Contract Tests Total Time**: ~17 minutes

---

## Frontend Regression Tests

### Component Rendering Tests

- [ ] **TC-FE-001**: GroupCreationForm Renders
  - **Priority**: Critical
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: All form fields visible and functional
  - **Failure Impact**: Cannot create groups via UI

- [ ] **TC-FE-003**: WalletConnector Renders
  - **Priority**: Critical
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Connection button visible
  - **Failure Impact**: Cannot connect wallet

### User Interaction Tests

- [ ] **TC-FE-007**: Form Submission with Valid Data
  - **Priority**: Critical
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: Form submits, callback triggered
  - **Failure Impact**: Cannot submit forms

### Form Validation Tests

- [ ] **TC-FE-010**: Contribution Amount Validation
  - **Priority**: High
  - **Estimated Time**: 1 minute
  - **Pass Criteria**: Invalid amounts rejected with error message
  - **Failure Impact**: Invalid data submitted

### Wallet Integration Tests

- [ ] **TC-FE-014**: Wallet Connection Flow
  - **Priority**: Critical
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: Wallet connects successfully
  - **Failure Impact**: Cannot use application

**Frontend Tests Total Time**: ~7 minutes

---

## Integration Regression Tests

### Frontend-Blockchain Communication

- [ ] **TC-INT-001**: Create Group Integration
  - **Priority**: Critical
  - **Estimated Time**: 3 minutes
  - **Pass Criteria**: Group created on blockchain, UI updated
  - **Failure Impact**: UI and blockchain out of sync

- [ ] **TC-INT-002**: Join Group Integration
  - **Priority**: Critical
  - **Estimated Time**: 3 minutes
  - **Pass Criteria**: Member added on blockchain, UI updated
  - **Failure Impact**: Join functionality broken

- [ ] **TC-INT-003**: Contribute Integration
  - **Priority**: Critical
  - **Estimated Time**: 3 minutes
  - **Pass Criteria**: Contribution recorded, UI reflects status
  - **Failure Impact**: Contribution tracking broken

- [ ] **TC-INT-004**: Payout Integration
  - **Priority**: Critical
  - **Estimated Time**: 3 minutes
  - **Pass Criteria**: Payout executed, balances updated
  - **Failure Impact**: Payout system broken

### Data Synchronization

- [ ] **TC-INT-005**: UI Updates After Transaction
  - **Priority**: High
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: UI reflects blockchain state
  - **Failure Impact**: Stale data displayed

**Integration Tests Total Time**: ~14 minutes

---

## End-to-End Regression Tests

### Complete User Flows

- [ ] **TC-E2E-001**: Complete Group Creation Flow
  - **Priority**: Critical
  - **Estimated Time**: 5 minutes
  - **Pass Criteria**: User creates group from UI, visible on blockchain
  - **Failure Impact**: Core functionality broken

- [ ] **TC-E2E-002**: Complete Contribution Flow
  - **Priority**: Critical
  - **Estimated Time**: 5 minutes
  - **Pass Criteria**: User contributes, transaction confirmed, UI updated
  - **Failure Impact**: Contribution flow broken

- [ ] **TC-E2E-003**: Complete Payout Flow
  - **Priority**: Critical
  - **Estimated Time**: 5 minutes
  - **Pass Criteria**: Payout triggered, executed, balances updated
  - **Failure Impact**: Payout flow broken

- [ ] **TC-E2E-004**: Full Lifecycle - 3 Members
  - **Priority**: Critical
  - **Estimated Time**: 10 minutes
  - **Pass Criteria**: Complete ROSCA cycle from creation to completion
  - **Failure Impact**: End-to-end flow broken

**End-to-End Tests Total Time**: ~25 minutes

---

## Performance Regression Tests

### Smart Contract Performance

- [ ] **TC-PERF-001**: Group Creation Gas Consumption
  - **Priority**: Critical
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: Gas usage within acceptable range (< 50,000 stroops)
  - **Failure Impact**: Expensive operations, poor UX

- [ ] **TC-PERF-002**: Contribution Gas Consumption
  - **Priority**: Critical
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: Gas usage within acceptable range (< 40,000 stroops)
  - **Failure Impact**: Expensive contributions

### Frontend Performance

- [ ] **TC-PERF-003**: Page Load Time
  - **Priority**: High
  - **Estimated Time**: 2 minutes
  - **Pass Criteria**: Initial load < 3 seconds
  - **Failure Impact**: Poor user experience

**Performance Tests Total Time**: ~6 minutes

---

## Regression Test Execution Summary

### Total Execution Time
- Smart Contract Tests: ~17 minutes
- Frontend Tests: ~7 minutes
- Integration Tests: ~14 minutes
- End-to-End Tests: ~25 minutes
- Performance Tests: ~6 minutes
- **Total**: ~69 minutes (~1.2 hours)

### Test Count by Priority
- **Critical**: 17 tests
- **High**: 11 tests
- **Total**: 28 tests

### Automation Status
- **Automated**: 26 tests (93%)
- **Manual**: 2 tests (7%)

---

## Execution Triggers

### Pre-Release (Mandatory)
Execute full regression suite before:
- Major releases (v1.0, v2.0, etc.)
- Minor releases (v1.1, v1.2, etc.)
- Patch releases (v1.0.1, v1.0.2, etc.)

**Quality Gate**: 100% of Critical tests must pass

### Post-Major-Change (Mandatory)
Execute full regression suite after:
- Smart contract modifications
- Major frontend refactoring
- Integration layer changes
- Database/storage schema changes
- Security updates

**Quality Gate**: 100% of Critical tests must pass, 95% of High tests must pass

### Scheduled (Weekly)
Execute full regression suite:
- Every Monday morning
- Automated via CI/CD
- Results reviewed by QA Lead

**Quality Gate**: 95% overall pass rate

### On-Demand
Execute regression suite:
- When requested by QA Lead
- Before hotfix deployment
- After bug fix verification
- When investigating issues

---

## Execution Procedure

### Pre-Execution Checklist
- [ ] Test environment is available and configured
- [ ] Latest code is deployed to test environment
- [ ] Test data is prepared and isolated
- [ ] All testers are available (for manual tests)
- [ ] Execution tracking sheet is ready

### Execution Steps

1. **Prepare Environment**
   ```bash
   # Deploy contracts to testnet
   cd contracts/ajo
   cargo build --release
   ./deploy_testnet.sh
   
   # Start frontend
   cd frontend
   npm install
   npm run build
   npm run preview
   ```

2. **Execute Automated Tests**
   ```bash
   # Smart contract tests
   cd contracts/ajo
   cargo test
   
   # Frontend tests
   cd frontend
   npm test -- --run
   
   # Generate reports
   npm run test:coverage
   ```

3. **Execute Manual Tests**
   - Follow test case documents
   - Record results in tracking sheet
   - Take screenshots for evidence

4. **Record Results**
   - Update test execution report
   - Log any failures
   - Create bug reports for failures

5. **Generate Report**
   - Compile test results
   - Calculate pass rate
   - Assess quality gates
   - Make release recommendation

### Post-Execution Checklist
- [ ] All tests executed
- [ ] Results recorded
- [ ] Bug reports created for failures
- [ ] Test execution report generated
- [ ] Quality gates assessed
- [ ] Stakeholders notified

---

## Pass/Fail Criteria

### Individual Test Pass Criteria
- All expected results are met
- No unexpected errors occur
- Performance within acceptable range
- No regression from previous execution

### Overall Suite Pass Criteria
- **Critical Tests**: 100% pass rate (0 failures allowed)
- **High Priority Tests**: 95% pass rate (max 1 failure allowed)
- **Overall**: 95% pass rate

### Release Approval Criteria
- All Critical tests pass
- No Critical or High severity bugs open
- Performance benchmarks met
- Security tests pass

---

## Failure Handling

### When a Test Fails

1. **Immediate Actions**
   - Stop execution if Critical test fails
   - Document failure details
   - Take screenshots/logs
   - Notify development team

2. **Investigation**
   - Reproduce failure
   - Determine root cause
   - Assess impact
   - Determine severity

3. **Bug Reporting**
   - Create bug report using template
   - Link to failed test case
   - Assign appropriate severity/priority
   - Assign to developer

4. **Re-Execution**
   - After bug fix, re-execute failed test
   - Verify fix resolves issue
   - Check for regression
   - Update test status

### Blocking Failures

If any of these tests fail, release is BLOCKED:
- TC-SC-001 (Create Group)
- TC-SC-007 (Join Group)
- TC-SC-011 (Contribute)
- TC-SC-014 (Execute Payout)
- TC-FE-001 (Form Renders)
- TC-FE-014 (Wallet Connection)
- TC-INT-001 through TC-INT-004 (All Integration)
- TC-E2E-001 through TC-E2E-004 (All E2E)

---

## Test Data Management

### Test Data Requirements

**Smart Contract Test Data**:
- 3-5 test addresses per test run
- Consistent test values for reproducibility
- Isolated test groups (no shared state)

**Frontend Test Data**:
- Mock wallet addresses
- Mock group data
- Mock transaction responses

### Data Setup
```bash
# Generate test addresses
stellar keys generate test-creator --network testnet
stellar keys generate test-member1 --network testnet
stellar keys generate test-member2 --network testnet

# Fund test accounts
stellar account fund test-creator --network testnet
stellar account fund test-member1 --network testnet
stellar account fund test-member2 --network testnet
```

### Data Cleanup
- Reset test environment after each run
- Clear test groups from blockchain (if possible)
- Reset frontend state
- Clear browser cache/storage

### Data Isolation
- Each test run uses unique group IDs
- Tests don't share addresses
- Tests don't depend on previous test data
- Parallel execution safe

---

## Reporting

### Test Execution Report
Generate report using template: `.qa-framework/templates/test-execution-report-template.md`

**Include**:
- Execution date and environment
- Test results summary
- Pass/fail counts by category
- Failed test details
- Performance metrics
- Quality gate status
- Release recommendation

### Distribution
- Email to: QA Lead, Dev Lead, Product Owner
- Post in: Team Slack channel
- Store in: `.qa-framework/reports/`
- Link in: Release notes

---

## Continuous Improvement

### Metrics to Track
- Regression test execution time (trend)
- Pass rate over time
- Number of regression bugs found
- Time to fix regression bugs
- Test maintenance effort

### Review Frequency
- Monthly review of regression suite
- Quarterly review of critical path definition
- After each release retrospective

### Optimization Opportunities
- Identify slow tests for optimization
- Identify flaky tests for fixing
- Add tests for frequently found bugs
- Remove obsolete tests
- Improve test data management

---

## Related Documents
- Test Case Management Guidelines
- Test Execution Report Template
- Bug Reporting Guidelines
- Test Automation Strategy

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Owner**: QA Team
**Next Review**: 2024-02-15
