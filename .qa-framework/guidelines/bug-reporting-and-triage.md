# Bug Reporting and Triage Guidelines

## Overview

This document provides comprehensive guidelines for reporting, classifying, triaging, and managing defects in the Soroban Ajo project. Effective bug management ensures issues are properly documented, prioritized, and resolved efficiently.

---

## Bug ID Pattern

### Format
All bug report IDs MUST follow this pattern:

```
BUG-[CATEGORY]-[NUMBER]
```

### Components
- **BUG**: Fixed prefix indicating "Bug Report"
- **CATEGORY**: Bug category identifier matching test categories
- **NUMBER**: Sequential number within the category (zero-padded to 3 digits)

### Examples
- `BUG-SC-001` - Smart Contract bug #1
- `BUG-FE-042` - Frontend bug #42
- `BUG-INT-015` - Integration bug #15

### ID Assignment Rules
1. IDs MUST be unique across all bug reports
2. Numbers MUST be sequential within each category
3. Once assigned, IDs MUST NOT be reused
4. IDs MUST be assigned when the bug is first reported
5. Category should match the component where the bug was found

---

## Bug Categories

Bugs are categorized to match test case categories:

### Smart_Contract (SC)
Defects in Soroban smart contract code:
- Contract logic errors
- State management issues
- Access control failures
- Gas consumption problems
- Storage corruption
- Event emission errors

### Frontend (FE)
Defects in React/TypeScript UI:
- Component rendering issues
- UI interaction failures
- Form validation errors
- State management bugs
- Routing problems
- Display/layout issues

### Integration (INT)
Defects in frontend-blockchain communication:
- Transaction submission failures
- Data synchronization issues
- Event handling errors
- API communication problems
- Wallet integration issues

### Performance (PERF)
Performance-related defects:
- Slow page loads
- High gas consumption
- Memory leaks
- Inefficient queries
- Scalability issues

### Security (SEC)
Security vulnerabilities:
- Access control bypasses
- Input validation failures
- XSS vulnerabilities
- CSRF vulnerabilities
- Cryptographic issues
- Data exposure

---

## Severity Levels

Every bug MUST be assigned exactly one severity level:

### Critical
**Definition**: System is completely unusable, data loss occurs, or critical security breach exists

**Characteristics**:
- System crash or complete failure
- Data corruption or loss
- Security breach allowing unauthorized access
- Financial loss or theft possible
- No workaround available
- Affects all users

**Examples**:
- Smart contract allows unauthorized fund withdrawal
- Application crashes on startup
- User data is permanently deleted
- Critical security vulnerability (SQL injection, authentication bypass)
- Blockchain state corruption

**Response Time**: Immediate (within 1 hour)
**Fix Timeline**: Emergency hotfix (within 24 hours)

### High
**Definition**: Major feature is broken, significant impact on users, but system remains partially usable

**Characteristics**:
- Core functionality not working
- Affects majority of users
- Significant business impact
- Workaround is difficult or impractical
- Blocks critical user workflows

**Examples**:
- Cannot create new groups
- Contribution submission fails
- Payout execution doesn't work
- Wallet connection fails for major wallet providers
- Transaction history not displayed

**Response Time**: Within 4 hours
**Fix Timeline**: Within 2-3 days

### Medium
**Definition**: Feature is partially broken, moderate impact, workaround available

**Characteristics**:
- Secondary functionality affected
- Affects some users
- Moderate business impact
- Reasonable workaround exists
- Does not block critical workflows

**Examples**:
- Group list sorting doesn't work
- Some UI elements misaligned
- Non-critical validation missing
- Minor data display issues
- Performance degradation in non-critical areas

**Response Time**: Within 1 business day
**Fix Timeline**: Within 1-2 weeks

### Low
**Definition**: Minor issue, cosmetic problem, minimal impact

**Characteristics**:
- Cosmetic or minor functional issue
- Affects few users
- Minimal business impact
- Easy workaround available
- Does not affect core functionality

**Examples**:
- Typo in UI text
- Color inconsistency
- Tooltip missing
- Minor alignment issue
- Console warning (non-breaking)

**Response Time**: Within 2-3 business days
**Fix Timeline**: Next release cycle or backlog

---

## Priority Levels

Priority indicates when the bug should be fixed, considering both severity and business impact:

### P0 - Immediate Fix
**Definition**: Must be fixed immediately, blocks release

**Criteria**:
- Critical severity bugs
- Blocks production deployment
- Affects all users
- No workaround available
- High business impact

**Action**: 
- Stop all other work
- Assign immediately
- Fix within 24 hours
- Deploy emergency hotfix

**Examples**:
- Production system down
- Security breach
- Data loss occurring
- Payment processing broken

### P1 - Fix in Current Sprint
**Definition**: Must be fixed before next release

**Criteria**:
- High severity bugs
- Blocks important features
- Affects many users
- Difficult workaround
- Significant business impact

**Action**:
- Assign to current sprint
- Fix within 2-3 days
- Include in next release
- May require release delay

**Examples**:
- Major feature not working
- Critical user workflow broken
- High-impact performance issue

### P2 - Fix in Next Sprint
**Definition**: Should be fixed soon, but not blocking current release

**Criteria**:
- Medium severity bugs
- Affects some users
- Workaround available
- Moderate business impact
- Not blocking release

**Action**:
- Schedule for next sprint
- Fix within 1-2 weeks
- Include in upcoming release
- Monitor for escalation

**Examples**:
- Secondary feature issues
- Non-critical UI problems
- Minor integration issues

### P3 - Backlog
**Definition**: Fix when time permits, low urgency

**Criteria**:
- Low severity bugs
- Affects few users
- Easy workaround
- Minimal business impact
- Enhancement-like fixes

**Action**:
- Add to backlog
- Fix when capacity available
- May be deferred multiple releases
- Consider closing if not relevant

**Examples**:
- Cosmetic issues
- Minor text errors
- Nice-to-have improvements

---

## Bug Lifecycle States

Every bug progresses through defined states:

### New
**Definition**: Bug has been reported but not yet reviewed

**Entry Criteria**: Bug report submitted
**Exit Criteria**: Bug has been reviewed and confirmed or rejected

**Actions**:
- Initial bug report created
- Awaiting triage
- No assignment yet

**Responsible**: Reporter

### Confirmed
**Definition**: Bug has been reviewed and verified to be a valid defect

**Entry Criteria**: 
- Bug reproduced by QA or developer
- Severity and priority assigned
- Sufficient information provided

**Exit Criteria**: Bug assigned to developer

**Actions**:
- Bug verified as reproducible
- Severity and priority set
- Ready for assignment

**Responsible**: QA Lead or Triage Team

### In_Progress
**Definition**: Developer is actively working on fixing the bug

**Entry Criteria**: Bug assigned to developer
**Exit Criteria**: Fix completed and ready for testing

**Actions**:
- Developer investigating
- Fix being implemented
- Code changes in progress

**Responsible**: Assigned Developer

### Fixed
**Definition**: Developer has completed the fix and deployed to test environment

**Entry Criteria**: 
- Code changes completed
- Fix deployed to test environment
- Developer believes issue is resolved

**Exit Criteria**: QA verifies the fix

**Actions**:
- Fix implemented
- Code reviewed
- Deployed to test environment
- Ready for verification

**Responsible**: Developer

### Verified
**Definition**: QA has confirmed the fix resolves the issue

**Entry Criteria**: 
- Fix tested in test environment
- Original issue no longer reproducible
- No regression issues found

**Exit Criteria**: Fix deployed to production

**Actions**:
- QA tested fix
- Original issue resolved
- No new issues introduced
- Ready for production deployment

**Responsible**: QA Engineer

### Closed
**Definition**: Bug is completely resolved and deployed to production

**Entry Criteria**:
- Fix verified by QA
- Deployed to production
- No issues in production

**Exit Criteria**: None (terminal state)

**Actions**:
- Fix in production
- Issue fully resolved
- No further action needed

**Responsible**: QA Lead or Release Manager

### Reopened
**Definition**: Previously fixed bug has reoccurred or fix was insufficient

**Entry Criteria**:
- Bug reoccurs after being marked Fixed or Closed
- Original fix did not fully resolve issue
- Regression detected

**Exit Criteria**: Bug re-enters In_Progress state

**Actions**:
- Issue reoccurred
- Needs additional investigation
- Returns to development

**Responsible**: QA Engineer (who discovered reoccurrence)

---

## Bug Triage Process

### Triage Meeting
**Frequency**: Daily for new bugs, weekly for backlog review
**Participants**: QA Lead, Development Lead, Product Owner
**Duration**: 30-60 minutes

### Triage Steps

#### Step 1: Review New Bugs
- Review all bugs in "New" status
- Verify bug report completeness
- Request additional information if needed

#### Step 2: Reproduce Bug
- Attempt to reproduce using provided steps
- Verify in appropriate environment
- Document reproduction results

#### Step 3: Assess Severity
Use this decision tree:

```
Is system unusable or data loss occurring?
├─ YES → Critical
└─ NO → Is major feature broken?
    ├─ YES → High
    └─ NO → Is feature partially broken?
        ├─ YES → Medium
        └─ NO → Low
```

#### Step 4: Determine Priority
Consider:
- Severity level
- Number of users affected
- Business impact
- Workaround availability
- Release timeline
- Resource availability

#### Step 5: Assign Owner
- Assign to appropriate developer
- Consider developer expertise
- Balance workload
- Set expected fix timeline

#### Step 6: Update Bug Status
- Change status from New to Confirmed
- Add triage notes
- Set target fix date
- Notify assigned developer

### Triage Criteria Checklist

Before confirming a bug, verify:
- [ ] Bug is reproducible
- [ ] Steps to reproduce are clear
- [ ] Expected vs actual behavior is documented
- [ ] Environment details are provided
- [ ] Severity is appropriate
- [ ] Priority reflects business impact
- [ ] No duplicate bug exists
- [ ] Sufficient evidence (screenshots/logs) provided

---

## Bug Reporting Best Practices

### Writing Effective Bug Reports

#### Clear Title
✓ Good: "Group creation fails with 'InvalidAmount' error when contribution is 0"
✗ Bad: "Create group doesn't work"

#### Detailed Description
Include:
- What you were trying to do
- What you expected to happen
- What actually happened
- Impact on users or system

#### Precise Steps to Reproduce
✓ Good:
```
1. Navigate to "Create Group" page
2. Enter contribution amount: 0
3. Enter cycle duration: 604800
4. Enter max members: 10
5. Click "Create Group" button
6. Observe error message
```

✗ Bad:
```
1. Try to create a group
2. It fails
```

#### Expected vs Actual Behavior
✓ Good:
- Expected: Error message "Contribution amount must be greater than 0" displayed
- Actual: Application crashes with unhandled exception

✗ Bad:
- Expected: It should work
- Actual: It doesn't work

#### Complete Environment Details
Include:
- Browser and version
- Operating system
- Network (testnet/mainnet)
- Wallet type and version
- Contract version
- Frontend version
- Screen resolution (for UI bugs)

#### Evidence
Attach:
- Screenshots showing the issue
- Console logs
- Network request/response
- Error stack traces
- Video recording (for complex issues)

---

## Bug Report Template Usage

### Required Fields
All bug reports MUST include:
1. Bug ID (BUG-[CATEGORY]-[NUMBER])
2. Title (clear, concise description)
3. Severity (Critical, High, Medium, Low)
4. Priority (P0, P1, P2, P3)
5. Status (lifecycle state)
6. Category (SC, FE, INT, PERF, SEC)
7. Description (detailed explanation)
8. Steps to Reproduce (numbered list)
9. Expected Behavior (what should happen)
10. Actual Behavior (what actually happens)
11. Environment (complete details)

### Optional but Recommended Fields
- Screenshots/Logs
- Additional Context
- Impact description
- Suggested Fix
- Related bugs
- Workaround

---

## Severity Assessment Guidelines

### Decision Matrix

| Condition | Severity |
|-----------|----------|
| System unusable + No workaround + Affects all users | Critical |
| Data loss or corruption | Critical |
| Security breach | Critical |
| Major feature broken + Affects most users | High |
| Core functionality not working | High |
| Feature partially broken + Workaround exists | Medium |
| Secondary feature issue | Medium |
| Cosmetic issue | Low |
| Minor text error | Low |

### Special Considerations

#### Security Bugs
- Always start at High or Critical
- Consult security team
- Consider potential exploit impact
- May require private disclosure

#### Performance Bugs
- Consider user impact
- Measure against benchmarks
- Account for scalability
- Consider resource costs

#### UI/UX Bugs
- Consider user experience impact
- Evaluate accessibility impact
- Check brand/design guidelines
- Consider mobile vs desktop

---

## Priority Assignment Guidelines

### Priority Matrix

| Severity | High User Impact | Medium User Impact | Low User Impact |
|----------|------------------|-------------------|-----------------|
| Critical | P0 | P0 | P0 |
| High | P0 | P1 | P1 |
| Medium | P1 | P2 | P2 |
| Low | P2 | P3 | P3 |

### Business Impact Factors
Consider:
- Number of users affected
- Frequency of occurrence
- Revenue impact
- Reputation impact
- Regulatory/compliance impact
- Competitive impact

### Resource Availability
Adjust priority based on:
- Developer availability
- Complexity of fix
- Risk of fix causing regression
- Testing requirements
- Deployment constraints

---

## Bug Assignment Guidelines

### Assignment Criteria
Assign bugs based on:
1. **Expertise**: Developer familiar with affected component
2. **Availability**: Developer with capacity
3. **Ownership**: Component owner
4. **Load Balancing**: Distribute work evenly
5. **Priority**: High priority bugs to senior developers

### Assignment Process
1. Identify appropriate developer
2. Check developer's current workload
3. Assign bug in tracking system
4. Notify developer
5. Set expected fix date
6. Add to developer's sprint if applicable

---

## Bug Verification Guidelines

### Verification Checklist
Before marking bug as Verified:
- [ ] Original issue is resolved
- [ ] Steps to reproduce no longer cause issue
- [ ] Fix works in all affected environments
- [ ] No regression issues introduced
- [ ] Related functionality still works
- [ ] Performance not degraded
- [ ] Fix matches expected behavior
- [ ] Edge cases tested
- [ ] Documentation updated if needed

### Verification Process
1. Review fix implementation
2. Deploy fix to test environment
3. Execute original reproduction steps
4. Verify issue is resolved
5. Test related functionality
6. Check for regression
7. Test edge cases
8. Update bug status
9. Add verification notes

### When to Reopen
Reopen bug if:
- Original issue still occurs
- Fix is incomplete
- Fix causes new issues
- Fix doesn't work in all environments
- Performance degraded
- Fix doesn't match requirements

---

## Bug Metrics and Reporting

### Key Metrics
Track:
- Total open bugs by severity
- Total open bugs by priority
- Bug age (time in each state)
- Time to fix (reported to fixed)
- Time to verify (fixed to verified)
- Reopen rate
- Bugs by component
- Bugs by assignee

### Reporting Frequency
- Daily: Critical and P0 bugs
- Weekly: All open bugs summary
- Sprint: Bug trends and metrics
- Release: Bug closure report

---

## Common Bug Scenarios

### Scenario 1: Cannot Reproduce
**Action**:
1. Request additional information from reporter
2. Try different environments
3. Check for environment-specific issues
4. If still cannot reproduce after 3 attempts, mark as "Cannot Reproduce"
5. Close bug but keep for reference

### Scenario 2: Duplicate Bug
**Action**:
1. Search for existing bugs with similar symptoms
2. If duplicate found, link bugs
3. Close duplicate bug
4. Reference original bug
5. Merge any additional information

### Scenario 3: Not a Bug (Working as Designed)
**Action**:
1. Verify against requirements
2. Consult with product owner
3. If working as designed, close as "Not a Bug"
4. Document explanation
5. Consider if requirements need update

### Scenario 4: Enhancement Request
**Action**:
1. Reclassify as enhancement
2. Move to product backlog
3. Close bug report
4. Create feature request if appropriate

---

## Tools and Integration

### Bug Tracking Tools
Recommended: GitHub Issues with labels

### Labels to Use
- `bug`: Confirmed defect
- `severity-critical`: Critical severity
- `severity-high`: High severity
- `severity-medium`: Medium severity
- `severity-low`: Low severity
- `priority-p0`: P0 priority
- `priority-p1`: P1 priority
- `priority-p2`: P2 priority
- `priority-p3`: P3 priority
- `smart-contract`: Smart contract bug
- `frontend`: Frontend bug
- `integration`: Integration bug
- `security`: Security issue

### Integration with Test Cases
- Link bug reports to failed test cases
- Reference test case ID in bug report
- Update test case with bug ID
- Create regression test for fixed bugs

---

## Roles and Responsibilities

### Bug Reporter (Anyone)
- Report bugs using template
- Provide complete information
- Respond to requests for clarification
- Verify fix when requested

### QA Engineer
- Triage new bugs
- Reproduce bugs
- Assign severity
- Verify fixes
- Create regression tests
- Track bug metrics

### QA Lead
- Lead triage meetings
- Approve severity/priority assignments
- Escalate critical bugs
- Report bug metrics
- Ensure process compliance

### Developer
- Fix assigned bugs
- Update bug status
- Provide fix estimates
- Document fix approach
- Request QA verification

### Product Owner
- Participate in triage
- Approve priority assignments
- Make business impact decisions
- Approve bug deferrals

---

## Appendix

### Bug ID Registry
Track assigned bug IDs:

| Category | Last Assigned ID | Next Available ID |
|----------|------------------|-------------------|
| Smart_Contract | BUG-SC-025 | BUG-SC-026 |
| Frontend | BUG-FE-018 | BUG-FE-019 |
| Integration | BUG-INT-012 | BUG-INT-013 |
| Performance | BUG-PERF-005 | BUG-PERF-006 |
| Security | BUG-SEC-008 | BUG-SEC-009 |

### Sample Bug Report
See: `.qa-framework/templates/bug-report-template.md`

### Related Documents
- Test Case Management Guidelines
- Test Execution Report Template
- Quality Metrics Dashboard

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Owner**: QA Team
