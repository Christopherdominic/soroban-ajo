# Test Automation Strategy

## Overview

This document defines the test automation strategy for the Soroban Ajo project, providing guidelines for implementing, maintaining, and executing automated tests across smart contracts, frontend components, and end-to-end user flows.

---

## Automation Priorities

### Priority 1: Unit Tests (MUST AUTOMATE)

#### Smart Contract Unit Tests
**Coverage Target**: 100% of all smart contract functions

**Scope**:
- All public contract functions
- All internal helper functions
- State management operations
- Error handling paths
- Edge cases and boundary conditions

**Rationale**: Smart contracts handle financial transactions and must be thoroughly tested. Unit tests provide fast feedback and catch issues early.

**Examples**:
- `create_group()` with valid/invalid parameters
- `join_group()` with various member states
- `contribute()` with different contribution scenarios
- `execute_payout()` with various group states

#### Frontend Component Unit Tests
**Coverage Target**: 100% of all React components

**Scope**:
- Component rendering with various props
- Component state management
- Event handlers
- Conditional rendering logic
- Error boundaries
- Custom hooks

**Rationale**: Component tests ensure UI reliability and catch regressions quickly.

**Examples**:
- GroupCreationForm renders correctly
- WalletConnector handles connection states
- GroupCard displays data correctly
- Form validation logic

### Priority 2: Integration Tests (SHOULD AUTOMATE)

#### Critical Frontend-Blockchain Interactions
**Coverage Target**: All critical user-initiated blockchain interactions

**Scope**:
- Transaction submission flows
- Wallet integration
- Contract function calls from UI
- Event listening and handling
- Data synchronization
- Error handling across layers

**Rationale**: Integration tests validate that frontend and smart contracts work together correctly.

**Examples**:
- Create group flow (UI → contract → confirmation)
- Contribution submission (wallet → contract → UI update)
- Payout execution (trigger → contract → balance update)

### Priority 3: End-to-End Tests (SHOULD AUTOMATE)

#### Critical Path User Flows
**Coverage Target**: All critical path scenarios

**Scope**:
- Complete user journeys
- Multi-step workflows
- Cross-component interactions
- Real-world usage scenarios

**Rationale**: E2E tests validate complete user experiences and catch integration issues.

**Examples**:
- New user creates group and invites members
- Member joins group and makes contribution
- Complete cycle: create → join → contribute → payout
- Multi-user concurrent operations

### Priority 4: Manual Testing (COMPLEMENT AUTOMATION)

**When to Use Manual Testing**:
- Exploratory testing
- Usability testing
- Visual design validation
- Complex user workflows
- One-time scenarios
- Tests requiring human judgment

---

## Test Automation Frameworks

### Smart Contract Testing: Rust Built-in Test Framework

#### Framework Overview
- **Tool**: Rust's built-in `#[test]` framework with Soroban SDK test utilities
- **Location**: `contracts/ajo/tests/`
- **Execution**: `cargo test`

#### Test Structure
```rust
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};
    use soroban_ajo::{AjoContract, AjoContractClient};

    fn setup_test_env() -> (Env, AjoContractClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();
        
        let contract_id = env.register_contract(None, AjoContract);
        let client = AjoContractClient::new(&env, &contract_id);
        let creator = Address::generate(&env);
        
        (env, client, creator)
    }

    #[test]
    fn test_create_group_valid_parameters() {
        let (env, client, creator) = setup_test_env();
        
        let group_id = client.create_group(
            &creator,
            &100_000_000i128,
            &604_800u64,
            &10u32
        );
        
        assert_eq!(group_id, 1);
    }
}
```

#### Best Practices
- Use descriptive test function names
- Create helper functions for common setup
- Test both success and failure paths
- Use `#[should_panic]` for error cases
- Mock external dependencies
- Keep tests independent and isolated
- Test edge cases and boundaries

#### Running Tests
```bash
# Run all tests
cargo test

# Run specific test
cargo test test_create_group

# Run with output
cargo test -- --nocapture

# Run with coverage
cargo tarpaulin --out Html
```

### Frontend Testing: Vitest + React Testing Library

#### Framework Overview
- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **Location**: `frontend/src/tests/` and co-located `*.test.tsx` files
- **Execution**: `npm test`

#### Test Structure
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GroupCreationForm from '@/components/GroupCreationForm';

describe('GroupCreationForm', () => {
  it('renders form fields correctly', () => {
    render(<GroupCreationForm />);
    
    expect(screen.getByLabelText('Contribution Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Cycle Duration')).toBeInTheDocument();
    expect(screen.getByLabelText('Max Members')).toBeInTheDocument();
  });

  it('validates contribution amount', async () => {
    render(<GroupCreationForm />);
    
    const amountInput = screen.getByLabelText('Contribution Amount');
    fireEvent.change(amountInput, { target: { value: '0' } });
    fireEvent.blur(amountInput);
    
    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    render(<GroupCreationForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Contribution Amount'), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText('Cycle Duration'), {
      target: { value: '7' }
    });
    fireEvent.change(screen.getByLabelText('Max Members'), {
      target: { value: '10' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Group' }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        contributionAmount: 100,
        cycleDuration: 7,
        maxMembers: 10
      });
    });
  });
});
```

#### Best Practices
- Test user behavior, not implementation details
- Use `screen` queries for better error messages
- Prefer `getByRole` and `getByLabelText` over `getByTestId`
- Use `userEvent` for more realistic interactions
- Mock external dependencies (API calls, wallet)
- Test accessibility
- Keep tests focused and readable

#### Running Tests
```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test GroupCreationForm.test.tsx

# Run with UI
npm run test:ui
```

### Integration Testing: Vitest + Mock Blockchain

#### Framework Overview
- **Test Runner**: Vitest
- **Mocking**: Mock Soroban client and wallet
- **Location**: `frontend/src/tests/integration/`

#### Test Structure
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useContractData } from '@/hooks/useContractData';
import * as sorobanService from '@/services/soroban';

vi.mock('@/services/soroban');

describe('Contract Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates group and updates UI state', async () => {
    const mockCreateGroup = vi.spyOn(sorobanService, 'createGroup')
      .mockResolvedValue({ groupId: 1, success: true });

    const { result } = renderHook(() => useContractData());

    await result.current.createGroup({
      contributionAmount: 100,
      cycleDuration: 7,
      maxMembers: 10
    });

    await waitFor(() => {
      expect(mockCreateGroup).toHaveBeenCalled();
      expect(result.current.groups).toHaveLength(1);
      expect(result.current.groups[0].id).toBe(1);
    });
  });
});
```

### End-to-End Testing: Playwright (Future)

#### Framework Overview
- **Tool**: Playwright (to be implemented)
- **Scope**: Full browser automation
- **Location**: `e2e/` (to be created)

#### Example Structure (Future Implementation)
```typescript
import { test, expect } from '@playwright/test';

test('complete group creation flow', async ({ page }) => {
  // Connect wallet
  await page.goto('http://localhost:3000');
  await page.click('button:has-text("Connect Wallet")');
  await page.click('text=Freighter');
  
  // Create group
  await page.click('text=Create Group');
  await page.fill('input[name="contributionAmount"]', '100');
  await page.fill('input[name="cycleDuration"]', '7');
  await page.fill('input[name="maxMembers"]', '10');
  await page.click('button:has-text("Create")');
  
  // Verify success
  await expect(page.locator('text=Group created successfully')).toBeVisible();
  await expect(page.locator('text=Group #1')).toBeVisible();
});
```

---

## Continuous Integration Integration

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: Test Suite

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  smart-contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Run smart contract tests
        run: |
          cd contracts/ajo
          cargo test --verbose

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run frontend tests
        run: |
          cd frontend
          npm test -- --run
      - name: Generate coverage
        run: |
          cd frontend
          npm run test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Automated Test Execution Triggers

#### On Pull Request
- Run all unit tests (smart contract + frontend)
- Run integration tests
- Generate coverage report
- Block merge if tests fail
- Block merge if coverage drops below threshold

#### On Push to Main/Develop
- Run full test suite
- Run regression tests
- Generate and publish coverage report
- Deploy to test environment
- Run smoke tests

#### Scheduled (Nightly)
- Run full test suite
- Run performance tests
- Run security tests
- Generate comprehensive test report
- Alert on failures

#### On Release Tag
- Run full test suite
- Run all regression tests
- Run performance benchmarks
- Run security scans
- Generate release test report

---

## Test Automation Metrics

### Coverage Metrics

#### Code Coverage Targets
- **Smart Contracts**: 95%+ line coverage
- **Frontend Components**: 80%+ line coverage
- **Integration Tests**: 70%+ of critical paths
- **E2E Tests**: 100% of critical user flows

#### Coverage Tracking
```bash
# Smart contract coverage
cargo tarpaulin --out Html

# Frontend coverage
npm run test:coverage
```

#### Coverage Reports
- Generate coverage reports on every PR
- Track coverage trends over time
- Alert on coverage drops
- Publish coverage badges

### Execution Metrics

#### Test Execution Time
Track and optimize:
- Total test suite execution time
- Per-test execution time
- Slowest tests
- Flaky tests

**Targets**:
- Unit tests: < 5 minutes total
- Integration tests: < 10 minutes total
- E2E tests: < 30 minutes total
- Full suite: < 45 minutes total

#### Test Reliability
Monitor:
- Pass rate (target: 100%)
- Flaky test rate (target: < 1%)
- Test failure trends
- Time to fix failing tests

### Maintenance Metrics

#### Test Maintenance Effort
Track:
- Time spent writing tests
- Time spent maintaining tests
- Test code to production code ratio
- Test update frequency

**Targets**:
- Test code ratio: 1:1 to 2:1
- Test maintenance: < 20% of development time
- Test update lag: < 1 day after code change

---

## Test Data Management

### Test Data Strategy

#### Smart Contract Test Data
- Generate test addresses using `Address::generate()`
- Use consistent test values for readability
- Create test data factories for complex objects
- Isolate test data between tests

```rust
fn create_test_group_params() -> (i128, u64, u32) {
    (
        100_000_000i128,  // 10 XLM
        604_800u64,       // 1 week
        10u32             // 10 members
    )
}
```

#### Frontend Test Data
- Use fixtures for consistent test data
- Mock API responses
- Create test data builders
- Use factories for complex objects

```typescript
const mockGroup = {
  id: 1,
  creator: 'GABC...',
  contributionAmount: 100,
  cycleDuration: 7,
  maxMembers: 10,
  members: ['GABC...'],
  currentCycle: 1,
  isComplete: false
};
```

### Test Data Isolation

#### Principles
- Each test should be independent
- Tests should not share state
- Tests should clean up after themselves
- Tests should not depend on execution order

#### Implementation
```rust
#[test]
fn test_isolated() {
    // Setup: Create fresh environment
    let (env, client, creator) = setup_test_env();
    
    // Execute: Run test
    let group_id = client.create_group(...);
    
    // Verify: Check results
    assert_eq!(group_id, 1);
    
    // Cleanup: Automatic (env dropped)
}
```

---

## Test Organization

### Directory Structure

```
soroban-ajo/
├── contracts/ajo/
│   ├── src/
│   │   ├── contract.rs
│   │   ├── storage.rs
│   │   └── ...
│   └── tests/
│       ├── ajo_flow.rs          # Integration tests
│       ├── group_creation.rs    # Unit tests
│       ├── contributions.rs     # Unit tests
│       └── mod.rs
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GroupCreationForm.tsx
│   │   │   └── GroupCreationForm.test.tsx  # Co-located
│   │   ├── hooks/
│   │   │   ├── useContractData.ts
│   │   │   └── useContractData.test.ts
│   │   └── tests/
│   │       ├── integration/
│   │       │   └── contract-integration.test.ts
│   │       ├── setupTests.ts
│   │       └── test-utils.tsx
│   └── vitest.config.ts
│
└── e2e/  # Future
    ├── tests/
    │   ├── group-creation.spec.ts
    │   └── contribution-flow.spec.ts
    └── playwright.config.ts
```

### Naming Conventions

#### Test Files
- Smart contracts: `test_<feature>.rs` or `<feature>_test.rs`
- Frontend: `<Component>.test.tsx` or `<Component>.spec.tsx`
- Integration: `<feature>-integration.test.ts`
- E2E: `<flow>.spec.ts`

#### Test Functions
- Smart contracts: `test_<action>_<scenario>`
  - Example: `test_create_group_with_valid_parameters`
- Frontend: `it('<action> <expected_result>')`
  - Example: `it('renders form fields correctly')`

---

## Mocking and Stubbing

### When to Mock

#### Mock External Dependencies
- Wallet connections
- Blockchain RPC calls
- External APIs
- Time-dependent functions
- Random number generation

#### Don't Mock
- Code under test
- Simple utilities
- Pure functions
- Internal logic

### Mocking Strategies

#### Smart Contract Mocking
```rust
// Use Soroban test utilities
let env = Env::default();
env.mock_all_auths();  // Mock authentication

// Mock ledger time
env.ledger().set_timestamp(1234567890);
```

#### Frontend Mocking
```typescript
// Mock wallet
vi.mock('@/services/wallet', () => ({
  connectWallet: vi.fn().mockResolvedValue({
    address: 'GABC...',
    connected: true
  })
}));

// Mock contract calls
vi.mock('@/services/soroban', () => ({
  createGroup: vi.fn().mockResolvedValue({ groupId: 1 })
}));
```

---

## Test Maintenance

### Keeping Tests Up-to-Date

#### When to Update Tests
- Requirements change
- Implementation changes
- Bugs are fixed
- New features added
- Refactoring occurs

#### Test Review Process
1. Review tests during code review
2. Update tests before changing code (TDD)
3. Refactor tests with production code
4. Remove obsolete tests
5. Add tests for bug fixes

### Handling Flaky Tests

#### Identifying Flaky Tests
- Tests that pass/fail intermittently
- Tests that depend on timing
- Tests that depend on external state
- Tests that depend on execution order

#### Fixing Flaky Tests
1. Identify root cause
2. Add proper waits/timeouts
3. Improve test isolation
4. Mock time-dependent code
5. Add retries only as last resort

### Test Refactoring

#### When to Refactor
- Tests are hard to understand
- Tests are duplicated
- Tests are slow
- Tests are brittle
- Tests don't follow conventions

#### Refactoring Techniques
- Extract common setup to helpers
- Use test data factories
- Create custom matchers
- Improve test names
- Reduce test coupling

---

## Best Practices

### General Principles

#### FIRST Principles
- **Fast**: Tests should run quickly
- **Independent**: Tests should not depend on each other
- **Repeatable**: Tests should produce same results every time
- **Self-Validating**: Tests should have clear pass/fail
- **Timely**: Tests should be written with or before code

#### AAA Pattern
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code under test
- **Assert**: Verify the results

```rust
#[test]
fn test_example() {
    // Arrange
    let (env, client, creator) = setup_test_env();
    
    // Act
    let result = client.create_group(&creator, &100, &7, &10);
    
    // Assert
    assert_eq!(result, 1);
}
```

### Smart Contract Testing Best Practices

✓ **Do**:
- Test all public functions
- Test error conditions with `#[should_panic]`
- Test edge cases and boundaries
- Use descriptive test names
- Keep tests independent
- Mock external dependencies
- Test gas consumption for critical operations

✗ **Don't**:
- Test private functions directly
- Create test dependencies
- Use production data
- Skip error case testing
- Write tests that depend on execution order
- Ignore warnings

### Frontend Testing Best Practices

✓ **Do**:
- Test user behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility
- Mock external dependencies
- Test loading and error states
- Use userEvent for interactions
- Test responsive behavior

✗ **Don't**:
- Test implementation details
- Use getByTestId as first choice
- Test third-party libraries
- Create brittle selectors
- Skip error state testing
- Ignore console warnings

---

## Troubleshooting

### Common Issues

#### Tests Failing Locally But Passing in CI
- Check Node/Rust versions
- Check environment variables
- Check file paths (case sensitivity)
- Check timezone differences

#### Tests Passing Locally But Failing in CI
- Check for test isolation issues
- Check for timing issues
- Check for resource constraints
- Check for parallel execution issues

#### Slow Tests
- Profile test execution
- Identify slow tests
- Optimize or parallelize
- Consider splitting test suites

#### Flaky Tests
- Add proper waits
- Improve test isolation
- Mock time-dependent code
- Check for race conditions

---

## Tools and Resources

### Testing Tools
- **Rust**: cargo test, cargo tarpaulin
- **Frontend**: Vitest, React Testing Library, @testing-library/user-event
- **Coverage**: cargo tarpaulin, vitest coverage
- **CI/CD**: GitHub Actions
- **Future**: Playwright for E2E

### Documentation
- [Soroban Testing Docs](https://soroban.stellar.org/docs/getting-started/testing)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Configuration Files
- `contracts/ajo/Cargo.toml` - Rust test configuration
- `frontend/vitest.config.ts` - Vitest configuration
- `frontend/src/tests/setupTests.ts` - Test setup
- `.github/workflows/test.yml` - CI configuration

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Owner**: QA Team
