# Test Case: TC-SC-005 Create Group with Maximum Values

**Category**: Smart_Contract
**Priority**: Medium
**Status**: Not_Run
**Automated**: No
**Created**: 2024-01-15
**Last Updated**: 2024-01-15

## Description
Verify that the smart contract can handle group creation with maximum allowed values for contribution amount, cycle duration, and max members. This tests the upper boundary conditions.

## Preconditions
- Smart contract is deployed to test environment
- Test environment is initialized
- Creator address is generated and available
- Maximum value limits are documented

## Test Steps
1. Initialize test environment
2. Register the Ajo contract
3. Create contract client
4. Generate creator address
5. Call `create_group()` with maximum values:
   - `creator`: Generated address
   - `contribution_amount`: i128::MAX or practical maximum
   - `cycle_duration`: u64::MAX or practical maximum
   - `max_members`: u32::MAX or practical maximum
6. Verify group is created successfully
7. Retrieve and verify group details

## Expected Results
- Function executes without errors or overflow
- Group is created with specified maximum values
- All group properties are correctly stored
- No integer overflow occurs
- Group is functional with maximum values

## Test Data
- Contribution Amount: Maximum i128 value or practical limit
- Cycle Duration: Maximum u64 value or practical limit (e.g., 100 years)
- Max Members: Maximum u32 value or practical limit (e.g., 1000)

## Notes
- This test validates upper boundary conditions
- May need to define practical maximums rather than type maximums
- Consider gas costs and storage limits
- May require manual testing due to resource constraints
- Should verify no integer overflow in calculations

## Related Requirements
- Requirement 2.7: Edge conditions (maximum values, boundary conditions)

## Execution History
| Date | Tester | Status | Notes |
|------|--------|--------|-------|
|      |        |        |       |
