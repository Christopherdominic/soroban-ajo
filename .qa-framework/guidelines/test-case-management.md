# Test Case Management Guidelines

## Overview

This document provides comprehensive guidelines for creating, organizing, tracking, and executing test cases for the Soroban Ajo project. Following these guidelines ensures consistency, traceability, and effective quality assurance across the project.

---

## Test Case ID Pattern

### Format
All test case IDs MUST follow this pattern:

```
TC-[CATEGORY]-[NUMBER]
```

### Components
- **TC**: Fixed prefix indicating "Test Case"
- **CATEGORY**: Test category identifier (see categories below)
- **NUMBER**: Sequential number within the category (zero-padded to 3 digits)

### Examples
- `TC-SC-001` - Smart Contract test case #1
- `TC-FE-042` - Frontend test case #42
- `TC-E2E-015` - End-to-End test case #15

### ID Assignment Rules
1. IDs MUST be unique across the entire test suite
2. Numbers MUST be sequential within each category
3. Once assigned, IDs MUST NOT be reused even if a test case is deleted
4. IDs MUST be assigned when the test case is created

---

## Test Categories

The QA Framework organizes test cases into six primary categories:

### 1. Smart_Contract (SC)
**Purpose**: Validate Soroban smart contract functionality

**Scope**:
- Contract function behavior
- State management
- Access control
- Error handling
- Gas consumption
- Storage operations

**Example Test Cases**:
- Group creation with valid parameters
- Member joining validation
- Contribution tracking
- Payout distribution logic

### 2. Frontend (FE)
**Purpose**: Validate React/TypeScript UI components and interactions

**Scope**:
- Component rendering
- User interactions (clicks, form submissions)
- Form validation
- State management
- Routing and navigation
- UI/UX behavior

**Example Test Cases**:
- GroupCreationForm renders correctly
- Wallet connection button functionality
- Form validation error messages
- Loading state display

### 3. Integration (INT)
**Purpose**: Validate interactions between frontend and smart contracts

**Scope**:
- Frontend-blockchain communication
- Transaction submission
- Data synchronization
- Event handling
- Error propagation

**Example Test Cases**:
- Frontend successfully calls smart contract functions
- Transaction results update UI state
- Blockchain events trigger UI updates

### 4. End_to_End (E2E)
**Purpose**: Validate complete user workflows from start to finish

**Scope**:
- Multi-step user journeys
- Cross-component interactions
- Real-world scenarios
- User experience flows

**Example Test Cases**:
- Complete group creation flow (UI → contract → confirmation)
- Full contribution cycle (connect wallet → contribute → verify)
- Multi-user payout scenario

### 5. Performance (PERF)
**Purpose**: Validate system performance and resource usage

**Scope**:
- Smart contract gas costs
- Frontend load times
- Component render performance
- Transaction throughput
- Scalability

**Example Test Cases**:
- Group creation gas consumption within limits
- Page load time under 3 seconds
- Concurrent user handling

### 6. Security (SEC)
**Purpose**: Validate security controls and identify vulnerabilities

**Scope**:
- Smart contract security (reentrancy, overflow, access control)
- Frontend security (XSS, CSRF)
- Wallet integration security
- Input validation
- Authentication/authorization

**Example Test Cases**:
- Unauthorized access prevention
- Input sanitization validation
- Transaction signing verification

---

## Test Execution Statuses

Each test case MUST have exactly one status at any given time:

### Not_Run
- **Definition**: Test case has not been executed yet
- **When to Use**: Initial state for new test cases or after test suite reset
- **Symbol**: `[ ]`

### Passed
- **Definition**: Test case executed successfully with expected results
- **When to Use**: All test steps completed and all expected results verified
- **Symbol**: `[✓]`

### Failed
- **Definition**: Test case executed but did not produce expected results
- **When to Use**: One or more expected results not met, defect identified
- **Symbol**: `[✗]`
- **Required Action**: Create bug report and link to test case

### Blocked
- **Definition**: Test case cannot be executed due to external dependencies
- **When to Use**: 
  - Required environment not available
  - Dependent test case failed
  - Required feature not implemented
  - Blocking defect exists
- **Symbol**: `[⊘]`
- **Required Action**: Document blocking reason in test case notes

### Skipped
- **Definition**: Test case intentionally not executed
- **When to Use**:
  - Not applicable to current test environment
  - Out of scope for current test cycle
  - Superseded by another test case
- **Symbol**: `[−]`
- **Required Action**: Document reason for skipping

---

## Priority Levels

Test cases MUST be assigned one of four priority levels:

### Critical
- **Definition**: Essential functionality that must work for system to be usable
- **Characteristics**:
  - Core business logic
  - Critical user paths
  - Security-critical operations
  - Data integrity operations
- **Execution Frequency**: Every test cycle, before every release
- **Examples**:
  - Create group functionality
  - Process contribution
  - Execute payout
  - Wallet connection

### High
- **Definition**: Important functionality with significant user impact
- **Characteristics**:
  - Major features
  - Common user workflows
  - Important integrations
- **Execution Frequency**: Every test cycle
- **Examples**:
  - Join existing group
  - View group details
  - Check contribution status
  - Display transaction history

### Medium
- **Definition**: Standard functionality with moderate user impact
- **Characteristics**:
  - Secondary features
  - Less common workflows
  - Nice-to-have functionality
- **Execution Frequency**: Regular test cycles, may skip in hotfix cycles
- **Examples**:
  - Filter group list
  - Sort members
  - Export data
  - UI animations

### Low
- **Definition**: Minor functionality with minimal user impact
- **Characteristics**:
  - Edge cases
  - Cosmetic issues
  - Rarely used features
- **Execution Frequency**: Periodic testing, can skip in time-constrained cycles
- **Examples**:
  - Tooltip text accuracy
  - Color scheme consistency
  - Footer links
  - Help text formatting

---

## Test Execution Workflow

### Phase 1: Test Preparation

#### 1.1 Review Test Cases
- Read test case description and preconditions
- Understand expected results
- Identify required test data
- Check for dependencies on other test cases

#### 1.2 Prepare Test Environment
- Verify environment is configured correctly
- Ensure required services are running
- Prepare test data
- Set up test accounts/wallets

#### 1.3 Verify Preconditions
- Confirm all preconditions are met
- If preconditions not met, mark test as Blocked
- Document any deviations from expected setup

### Phase 2: Test Execution

#### 2.1 Execute Test Steps
- Follow test steps exactly as documented
- Execute steps in the specified order
- Record observations at each step
- Take screenshots for visual verification
- Capture error messages or logs

#### 2.2 Verify Results
- Compare actual results with expected results
- Check all expected outcomes
- Verify data integrity
- Confirm UI updates correctly
- Validate blockchain state changes

#### 2.3 Document Execution
- Record actual results in test case
- Update execution history table
- Note any deviations or anomalies
- Capture relevant evidence (screenshots, logs)

### Phase 3: Result Recording

#### 3.1 Update Test Status
- Set status based on execution outcome
- If Passed: Mark test as complete
- If Failed: Proceed to defect reporting
- If Blocked: Document blocking issue
- If Skipped: Document reason

#### 3.2 Record Metrics
- Execution time
- Environment details
- Tester name
- Execution date

### Phase 4: Defect Reporting

#### 4.1 When Test Fails
- Create bug report using bug report template
- Link bug report to test case
- Include all relevant evidence
- Assign appropriate severity and priority

#### 4.2 Bug Report Contents
- Clear description of failure
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots and logs

#### 4.3 Follow-up
- Track bug through lifecycle
- Re-execute test after bug fix
- Update test case if needed

---

## Test Case Creation Guidelines

### Structure Requirements
Every test case MUST include:
1. **Unique ID**: Following TC-[CATEGORY]-[NUMBER] pattern
2. **Title**: Clear, concise description of what is being tested
3. **Category**: One of the six defined categories
4. **Priority**: One of the four priority levels
5. **Description**: Detailed explanation of test purpose
6. **Preconditions**: All conditions that must be true before execution
7. **Test Steps**: Numbered, sequential actions to perform
8. **Expected Results**: Clear, verifiable outcomes
9. **Related Requirements**: Links to requirements being validated

### Writing Effective Test Cases

#### Clear and Concise
- Use simple, direct language
- Avoid ambiguity
- Be specific about actions and results
- Use consistent terminology

#### Actionable Steps
- Each step should be a single action
- Steps should be executable by any tester
- Include specific values and data
- Specify exact UI elements to interact with

#### Verifiable Results
- Expected results must be observable
- Results should be specific and measurable
- Include both positive and negative validations
- Specify exact values, messages, or states

#### Example - Good Test Case
```markdown
# Test Case: TC-SC-001 Create Group with Valid Parameters

**Category**: Smart_Contract
**Priority**: Critical

## Test Steps
1. Call create_group() with contribution_amount=100_000_000, cycle_duration=604_800, max_members=10
2. Verify function returns group_id=1
3. Call get_group(1) to retrieve group details

## Expected Results
- Group ID returned is 1
- Group creator matches calling address
- Group contribution_amount is 100_000_000
- Group cycle_duration is 604_800
- Group max_members is 10
- Group members list contains exactly 1 member (creator)
```

#### Example - Poor Test Case
```markdown
# Test Case: Create Group

## Test Steps
1. Create a group
2. Check if it works

## Expected Results
- Group is created successfully
```

---

## Test Case Organization

### File Structure
```
.qa-framework/
├── test-cases/
│   ├── smart-contract/
│   │   ├── TC-SC-001-create-group-valid.md
│   │   ├── TC-SC-002-join-group-valid.md
│   │   └── ...
│   ├── frontend/
│   │   ├── TC-FE-001-render-group-form.md
│   │   ├── TC-FE-002-wallet-connection.md
│   │   └── ...
│   ├── integration/
│   ├── e2e/
│   ├── performance/
│   └── security/
```

### Naming Conventions
- File names should match test case ID
- Use lowercase with hyphens
- Include brief description in filename
- Example: `TC-SC-001-create-group-valid.md`

### Version Control
- All test cases MUST be version controlled
- Use meaningful commit messages
- Track changes to test cases
- Review test case updates in pull requests

---

## Test Case Maintenance

### Regular Reviews
- Review test cases quarterly
- Update test cases when requirements change
- Remove obsolete test cases
- Add test cases for new features

### Update Triggers
Test cases should be updated when:
- Requirements change
- Implementation changes
- Bugs are fixed
- New edge cases discovered
- Test execution reveals ambiguities

### Deprecation Process
1. Mark test case as deprecated in title
2. Document reason for deprecation
3. Link to replacement test case if applicable
4. Archive after one release cycle
5. Do not reuse deprecated test case IDs

---

## Test Execution Tracking

### Test Execution Matrix
Track test execution using a matrix:

| Test ID | Test Name | Priority | Status | Last Executed | Executed By | Bug ID |
|---------|-----------|----------|--------|---------------|-------------|--------|
| TC-SC-001 | Create Group | Critical | Passed | 2024-01-15 | Alice | - |
| TC-SC-002 | Join Group | Critical | Failed | 2024-01-15 | Bob | BUG-SC-001 |
| TC-FE-001 | Render Form | High | Blocked | - | - | - |

### Metrics to Track
- Total test cases by category
- Test execution rate (executed / total)
- Pass rate (passed / executed)
- Defect density (defects / test cases)
- Test coverage percentage
- Average execution time

---

## Test Automation

### Automation Candidates
Prioritize automation for:
- Critical priority test cases
- Regression test cases
- Frequently executed tests
- Stable, well-defined tests
- Tests requiring multiple data sets

### Automation Guidelines
- Automated tests should follow same ID pattern
- Link automated test code to test case document
- Maintain both automated code and test case documentation
- Include test case ID in automated test name
- Run automated tests in CI/CD pipeline

### Example Automated Test
```rust
#[test]
fn tc_sc_001_create_group_with_valid_parameters() {
    // Test Case: TC-SC-001
    // Validates: Requirement 2.1
    
    let (env, client, creator) = setup_test_env();
    
    // Step 1: Call create_group with valid parameters
    let group_id = client.create_group(
        &creator,
        &100_000_000i128,
        &604_800u64,
        &10u32
    );
    
    // Expected Result: Group ID is 1
    assert_eq!(group_id, 1);
    
    // Step 2: Retrieve group details
    let group = client.get_group(&group_id);
    
    // Expected Results: Verify all group properties
    assert_eq!(group.creator, creator);
    assert_eq!(group.contribution_amount, 100_000_000i128);
    assert_eq!(group.cycle_duration, 604_800u64);
    assert_eq!(group.max_members, 10u32);
    assert_eq!(group.members.len(), 1);
}
```

---

## Best Practices

### Do's
✓ Write test cases before implementation (TDD approach)
✓ Keep test cases independent and isolated
✓ Use descriptive test case titles
✓ Include both positive and negative test cases
✓ Test edge cases and boundary conditions
✓ Link test cases to requirements
✓ Update test cases when requirements change
✓ Review test cases with team members
✓ Automate repetitive test cases
✓ Document test data requirements

### Don'ts
✗ Don't write vague or ambiguous test cases
✗ Don't create test case dependencies
✗ Don't skip preconditions
✗ Don't ignore failed tests
✗ Don't reuse test case IDs
✗ Don't test multiple features in one test case
✗ Don't forget to update test status
✗ Don't skip documentation of actual results
✗ Don't create tests without linking to requirements

---

## Roles and Responsibilities

### QA Engineer
- Create and maintain test cases
- Execute test cases
- Report defects
- Update test execution status
- Track test metrics

### Test Lead
- Review test cases for completeness
- Approve test case changes
- Monitor test coverage
- Ensure testing standards are followed
- Report quality metrics to stakeholders

### Developer
- Review test cases for technical accuracy
- Provide input on edge cases
- Fix defects identified by tests
- Write automated unit tests
- Support test environment setup

### Product Owner
- Review test cases for business logic accuracy
- Prioritize test execution
- Approve test coverage
- Make release decisions based on test results

---

## Tools and Resources

### Recommended Tools
- **Test Case Management**: Markdown files in Git repository
- **Test Execution Tracking**: Spreadsheet or project management tool
- **Bug Tracking**: GitHub Issues or dedicated bug tracking system
- **Test Automation**: Rust test framework, Vitest, React Testing Library
- **CI/CD Integration**: GitHub Actions

### Templates
- Test Case Template: `.qa-framework/templates/test-case-template.md`
- Bug Report Template: `.qa-framework/templates/bug-report-template.md`
- Test Execution Report: `.qa-framework/templates/test-execution-report-template.md`

### References
- Requirements Document: `.kiro/specs/qa-testing-framework/requirements.md`
- Design Document: `.kiro/specs/qa-testing-framework/design.md`
- Project Architecture: `soroban-ajo/docs/architecture.md`

---

## Appendix

### Test Case ID Registry
Maintain a registry of assigned test case IDs to prevent duplicates:

| Category | Last Assigned ID | Next Available ID |
|----------|------------------|-------------------|
| Smart_Contract | TC-SC-050 | TC-SC-051 |
| Frontend | TC-FE-035 | TC-FE-036 |
| Integration | TC-INT-020 | TC-INT-021 |
| End_to_End | TC-E2E-015 | TC-E2E-016 |
| Performance | TC-PERF-010 | TC-PERF-011 |
| Security | TC-SEC-025 | TC-SEC-026 |

### Glossary
- **Test Case**: A documented set of preconditions, steps, and expected results
- **Test Suite**: A collection of related test cases
- **Test Cycle**: A complete execution of a test suite
- **Regression Testing**: Re-executing tests to ensure existing functionality still works
- **Smoke Testing**: Quick validation of critical functionality
- **Sanity Testing**: Focused testing of specific functionality after changes

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Owner**: QA Team
