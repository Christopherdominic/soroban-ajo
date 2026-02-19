# Test Case: TC-SC-001 Create Group with Valid Parameters

**Category**: Smart_Contract
**Priority**: Critical
**Status**: Not_Run
**Automated**: Yes
**Created**: 2024-01-15
**Last Updated**: 2024-01-15

## Description
Verify that a group can be successfully created with valid parameters including contribution amount, cycle duration, and maximum members. This test validates the core group creation functionality which is essential for the ROSCA system.

## Preconditions
- Smart contract is deployed to test environment
- Test environment is initialized
- Creator address is generated and available
- Contract client is configured

## Test Steps
1. Initialize test environment with `Env::default()`
2. Register the Ajo contract
3. Create contract client
4. Generate creator address
5. Call `create_group()` with:
   - `creator`: Generated address
   - `contribution_amount`: 100_000_000 (10 XLM in stroops)
   - `cycle_duration`: 604_800 (1 week in seconds)
   - `max_members`: 10
6. Capture returned group_id
7. Call `get_group(group_id)` to retrieve group details
8. Verify all group properties

## Expected Results
- Function executes without errors
- Group ID returned is 1 (first group)
- Group creator matches the provided creator address
- Group contribution_amount is 100_000_000
- Group cycle_duration is 604_800
- Group max_members is 10
- Group members list contains exactly 1 member (the creator)
- Group current_cycle is 1
- Group payout_index is 0
- Group is_complete is false

## Test Data
- Contribution Amount: 100_000_000 stroops (10 XLM)
- Cycle Duration: 604_800 seconds (7 days)
- Max Members: 10

## Notes
- This is the happy path test for group creation
- Creator is automatically added as the first member
- Group ID starts at 1 and increments for each new group
- This test is automated in `contracts/ajo/tests/ajo_flow.rs`

## Related Requirements
- Requirement 2.1: Group creation with valid parameters

## Execution History
| Date | Tester | Status | Notes |
|------|--------|--------|-------|
|      |        |        |       |
