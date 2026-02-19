# Test Case: TC-SC-004 Create Group with Invalid Max Members

**Category**: Smart_Contract
**Priority**: High
**Status**: Not_Run
**Automated**: Yes
**Created**: 2024-01-15
**Last Updated**: 2024-01-15

## Description
Verify that the smart contract properly rejects group creation when max_members is set to 1 or less. A ROSCA requires at least 2 members to function properly.

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
   - `cycle_duration`: 604_800
   - `max_members`: 1 (invalid)
6. Capture the error response

## Expected Results
- Function call fails with panic
- Error message contains "InvalidMaxMembers"
- No group is created
- Group counter is not incremented

## Test Data
- Contribution Amount: 100_000_000 stroops
- Cycle Duration: 604_800 seconds
- Max Members: 1 (invalid - minimum should be 2)

## Notes
- This test uses `#[should_panic(expected = "InvalidMaxMembers")]`
- Tests boundary condition for max_members
- A ROSCA needs at least 2 members to function (one to contribute, one to receive)
- Validates business logic constraint

## Related Requirements
- Requirement 2.1: Member limit validation
- Requirement 2.6: Invalid parameter rejection
- Requirement 2.7: Edge conditions (boundary values)

## Execution History
| Date | Tester | Status | Notes |
|------|--------|--------|-------|
|      |        |        |       |
