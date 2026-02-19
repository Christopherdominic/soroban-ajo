# Test Case: TC-SC-006 Create Multiple Groups

**Category**: Smart_Contract
**Priority**: High
**Status**: Not_Run
**Automated**: Yes
**Created**: 2024-01-15
**Last Updated**: 2024-01-15

## Description
Verify that multiple groups can be created independently with unique group IDs. This validates that the group counter increments correctly and groups are isolated from each other.

## Preconditions
- Smart contract is deployed to test environment
- Test environment is initialized
- Multiple creator addresses are available

## Test Steps
1. Initialize test environment
2. Register the Ajo contract
3. Create contract client
4. Generate two creator addresses (creator1, creator2)
5. Create first group with creator1:
   - `contribution_amount`: 100_000_000
   - `cycle_duration`: 604_800
   - `max_members`: 5
6. Capture group_id1
7. Create second group with creator2:
   - `contribution_amount`: 200_000_000
   - `cycle_duration`: 1_209_600
   - `max_members`: 3
8. Capture group_id2
9. Retrieve both groups using `get_group()`
10. Verify both groups exist independently

## Expected Results
- First group ID is 1
- Second group ID is 2
- Group IDs are sequential and unique
- First group has creator1 as creator
- Second group has creator2 as creator
- First group has contribution_amount 100_000_000
- Second group has contribution_amount 200_000_000
- Groups are completely independent
- Each group has only its creator as member

## Test Data
**Group 1**:
- Contribution Amount: 100_000_000 stroops
- Cycle Duration: 604_800 seconds (1 week)
- Max Members: 5

**Group 2**:
- Contribution Amount: 200_000_000 stroops
- Cycle Duration: 1_209_600 seconds (2 weeks)
- Max Members: 3

## Notes
- This test validates group isolation
- Ensures group counter increments correctly
- Verifies multiple groups can coexist
- Tests that group data doesn't interfere between groups
- Automated in `contracts/ajo/tests/ajo_flow.rs`

## Related Requirements
- Requirement 2.1: Group initialization with valid parameters

## Execution History
| Date | Tester | Status | Notes |
|------|--------|--------|-------|
|      |        |        |       |
