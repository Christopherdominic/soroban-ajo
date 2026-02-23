# Test Case: TC-SC-007 - Emergency Withdrawal (Eligible Member)

## Test Information
- **Test ID**: TC-SC-007
- **Component**: Smart Contract - Emergency Withdrawal
- **Priority**: High
- **Test Type**: Functional
- **Created**: 2024-02-23

## Description
Verify that an eligible member can successfully perform an emergency withdrawal from a stalled group with correct penalty and refund calculations.

## Preconditions
- Smart contract is deployed
- Test environment is configured
- Member has joined a group
- Member has made at least one contribution
- At least one cycle duration has passed since cycle start (group is stalled)
- Member has not received payout yet
- Member has not already withdrawn

## Test Data
- **Contribution Amount**: 100,000,000 stroops (10 XLM)
- **Cycle Duration**: 604,800 seconds (1 week)
- **Max Members**: 3
- **Contributions Made**: 1
- **Expected Penalty**: 10% (10,000,000 stroops)
- **Expected Refund**: 90% (90,000,000 stroops)

## Test Steps
1. Create a new Ajo group with 3 max members
2. Have two additional members join the group
3. All members contribute for cycle 1
4. Advance ledger time past cycle duration (simulate stalled group)
5. Call `emergency_withdraw` for member2
6. Verify the returned refund and penalty amounts
7. Verify withdrawal event is emitted
8. Verify member is marked as withdrawn in storage

## Expected Results
- Emergency withdrawal succeeds without errors
- Refund amount equals 90% of total contributions (90,000,000 stroops)
- Penalty amount equals 10% of total contributions (10,000,000 stroops)
- `emit_emergency_withdrawal` event is published with correct parameters
- Member is marked as withdrawn and cannot withdraw again
- Member's contributions are recorded correctly

## Actual Results
- [ ] Pass
- [ ] Fail

## Notes
- The 10% penalty discourages abuse of the emergency withdrawal mechanism
- Penalty remains in the contract pool
- This test validates the core emergency withdrawal functionality for stalled groups
