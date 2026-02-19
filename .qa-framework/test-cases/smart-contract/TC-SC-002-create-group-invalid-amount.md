# Test Case: TC-SC-002 Create Group with Invalid Amount (Zero)

**Category**: Smart_Contract
**Priority**: High
**Status**: Not_Run
**Automated**: Yes
**Created**: 2024-01-15
**Last Updated**: 2024-01-15

## Description
Verify that the smart contract properly rejects group creation when contribution amount is zero. This validates input validation and error handling for invalid contribution amounts.

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
   - `contribution_amount`: 0 (invalid)
   - `cycle_duration`: 604_800
   - `max_members`: 10
6. Capture the error response

## Expected Results
- Function call fails with panic
- Error message contains "InvalidAmount"
- No group is created
- Group counter is not incremented

## Test Data
- Contribution Amount: 0 (invalid)
- Cycle Duration: 604_800 seconds
- Max Members: 10

## Notes
- This test uses `#[should_panic(expected = "InvalidAmount")]`
- Tests boundary condition for contribution amount
- Validates that zero contributions are not allowed
- This is a negative test case

## Related Requirements
- Requirement 2.6: Invalid parameter rejection
- Requirement 2.7: Edge conditions (zero values)

## Execution History
| Date | Tester | Status | Notes |
|------|--------|--------|-------|
|      |        |        |       |
