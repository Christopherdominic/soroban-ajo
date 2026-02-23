# Test Case: TC-SC-008 - Emergency Withdrawal (Multiple Contributions)

## Test Information
- **Test ID**: TC-SC-008
- **Component**: Smart Contract - Emergency Withdrawal
- **Priority**: High
- **Test Type**: Functional
- **Created**: 2024-02-23

## Description
Verify that emergency withdrawal correctly calculates refund and penalty for members who have made multiple contributions across different cycles.

## Preconditions
- Smart contract is deployed
- Member has joined a group
- Member has made contributions in multiple cycles
- At least one cycle duration has passed since last cycle start
- Member has not received payout yet
- Member has not already withdrawn

## Test Data
- **Contribution Amount**: 100,000,000 stroops (10 XLM)
- **Cycle Duration**: 604,800 seconds (1 week)
- **Max Members**: 3
- **Contributions Made**: 2 (across 2 cycles)
- **Total Contributed**: 200,000,000 stroops
- **Expected Penalty**: 10% (20,000,000 stroops)
- **Expected Refund**: 90% (180,000,000 stroops)

## Test Steps
1. Create a new Ajo group with 3 max members
2. Have two additional members join the group
3. All members contribute for cycle 1
4. Execute payout for cycle 1
5. All members contribute for cycle 2
6. Advance ledger time past cycle duration
7. Call `emergency_withdraw` for member3
8. Verify the returned refund and penalty amounts

## Expected Results
- Emergency withdrawal succeeds
- Refund amount equals 90% of total contributions (180,000,000 stroops)
- Penalty amount equals 10% of total contributions (20,000,000 stroops)
- Calculation correctly accounts for contributions across multiple cycles
- Withdrawal event is emitted with correct amounts

## Actual Results
- [ ] Pass
- [ ] Fail

## Notes
- This test validates that the withdrawal calculation correctly tracks contributions across multiple cycles
- Important for members who have been active in the group before it stalled
