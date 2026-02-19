# Test Case: TC-SC-003 Create Group with Invalid Cycle Duration (Zero)

**Category**: Smart_Contract
**Priority**: High
**Status**: Not_Run
**Automated**: Yes
**Created**: 2024-01-15
**Last Updated**: 2024-01-15

## Description
Verify that the smart contract properly rejects group creation when cycle duration is zero. This validates input validation for cycle duration parameter.

## Preconditions
- Smart contract is deployed to test environment
- Test environment is initialized
- Creator address is generated and available

## Test Steps
1. Initialize test environment
2. Register the Ajo contract
3. Create contract client
4. Generate creator address
5. Attempt to call `create_group()` with:
   - `creator`: Generated address
   - `contribution_amount`: 100_000_000
   - `cycle_duration`: 0 (invalid)
   - `max_members`: 10
6. Capture the error response

## Expected Results
- Function call fails with panic
- Error message contains "InvalidCycleDuration"
- No group is created
- Group counter is not incremented

## Test Data
- Contribution Amount: 100_000_000 stroops
- Cycle Duration: 0 (invalid)
- Max Members: 10

## Notes
- This test uses `#[should_panic(expected = "InvalidCycleDuration")]`
- Tests boundary condition for cycle duration
- Validates that zero duration cycles are not allowed
- Cycle duration must be positive to allow time for contributions

## Related Requirements
- Requirement 2.6: Invalid parameter rejection
- Requirement 2.7: Edge conditions (zero values)

## Execution History
| Date | Tester | Status | Notes |
|------|--------|--------|-------|
|      |        |        |       |
