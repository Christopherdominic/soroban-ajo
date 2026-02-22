# In-App Copy Guide — Soroban Ajo

## Tone & Voice Guidelines

### Voice Principles
- **Welcoming**: Friendly and inclusive, recognizing diverse cultural backgrounds
- **Clear**: Simple language, avoiding blockchain jargon where possible
- **Trustworthy**: Transparent about actions, especially financial transactions
- **Empowering**: Focus on user control and community building
- **Respectful**: Honor the cultural heritage of Ajo/Esusu traditions

### Writing Rules
- Use active voice ("You'll receive" not "Payment will be received")
- Keep sentences under 20 words for clarity
- Explain blockchain terms when first introduced
- Use "we" sparingly; focus on "you" and "your group"
- Avoid exclamation marks except for genuine celebrations
- Write at 8th-grade reading level for accessibility

---

## Navigation & Primary Actions

### Main Navigation
| Element | Copy |
|---------|------|
| Home tab | Home |
| Groups tab | My Groups |
| Explore tab | Explore |
| Activity tab | Activity |
| Profile tab | Profile |

### Primary CTAs
| Action | Button Text | Alternative |
|--------|-------------|-------------|
| Create new group | Create Group | Start a Group |
| Join existing group | Join Group | Request to Join |
| Make contribution | Contribute Now | Pay This Cycle |
| View group details | View Details | See Group |
| Leave group | Leave Group | Exit Group |

---

## Group Creation Flow

### Page Title
**Create Your Ajo Group**

### Form Labels & Placeholders

**Group Name**
- Label: "Group Name"
- Placeholder: "e.g., Weekend Savers, Small Business Fund"
- Helper text: "Choose a name your members will recognize"

**Contribution Amount**
- Label: "Contribution Amount (XLM)"
- Placeholder: "100"
- Helper text: "Amount each member contributes per cycle"

**Cycle Duration**
- Label: "Cycle Duration"
- Options: "Weekly", "Bi-weekly", "Monthly"
- Helper text: "How often members contribute"

**Maximum Members**
- Label: "Maximum Members"
- Placeholder: "10"
- Helper text: "Total number of participants (including you)"

**Start Date** (if applicable)
- Label: "Start Date"
- Helper text: "When the first cycle begins"

### Tooltips

**Contribution Amount** (ⓘ icon)
> This is the fixed amount each member pays every cycle. Choose an amount everyone can afford consistently.

**Cycle Duration** (ⓘ icon)
> The time between contributions. Weekly cycles move faster; monthly cycles give more time to save.

**Maximum Members** (ⓘ icon)
> The total group size determines how long until everyone receives a payout. With 10 members, you'll wait up to 10 cycles.

**Payout Order** (ⓘ icon)
> Members receive payouts in the order they join. The creator receives the first payout after all members contribute to cycle 1.

### Confirmation Modal

**Title**: "Review Your Group"

**Body**:
```
You're creating a group with these details:

• Contribution: 100 XLM per cycle
• Frequency: Weekly
• Members: Up to 10 people
• Your payout: Cycle 1 (after all members contribute)

Creating this group requires a small transaction fee (~0.01 XLM).
```

**Buttons**:
- Primary: "Create Group"
- Secondary: "Go Back"

### Success Message
```
✓ Group Created Successfully

Your group "Weekend Savers" is now live. Share the group ID with members so they can join.

[Copy Group ID] [Invite Members] [View Group]
```

---

## Group Discovery & Joining

### Explore Page

**Page Title**: "Explore Ajo Groups"

**Search Placeholder**: "Search by group name or ID"

**Filter Labels**:
- "Contribution Amount"
- "Cycle Duration"
- "Open Spots"

**Empty State** (no groups found):
```
No Groups Found

Try adjusting your filters or create your own group to get started.

[Create Group]
```

### Group Card

**Status Badges**:
- "Open" (green) — Accepting members
- "Full" (gray) — All spots filled
- "Active" (blue) — Contributions in progress
- "Complete" (purple) — All payouts finished

**Card Details**:
```
Weekend Savers
100 XLM • Weekly • 7/10 members

Next cycle starts in 3 days
```

### Join Group Modal

**Title**: "Join Weekend Savers"

**Body**:
```
Group Details:
• Contribution: 100 XLM per cycle
• Frequency: Weekly
• Current members: 7/10
• Your payout position: 8th

By joining, you commit to contributing 100 XLM every week. Missing contributions may affect the group.
```

**Buttons**:
- Primary: "Join Group"
- Secondary: "Cancel"

### Success Message
```
✓ You've Joined the Group

Welcome to "Weekend Savers"! Your first contribution is due in 3 days.

[View Group] [Set Reminder]
```

---

## Contribution Flow

### Contribution Card (on group page)

**Current Cycle**:
```
Cycle 3 of 10

Your contribution: 100 XLM
Due: Feb 25, 2026 (6 days)

[Contribute Now]
```

**Status Indicators**:
- "✓ Paid" (green)
- "Pending" (yellow)
- "Overdue" (red)

### Contribution Modal

**Title**: "Contribute to Cycle 3"

**Body**:
```
You're contributing 100 XLM to "Weekend Savers"

This cycle's recipient: Alice (alice...7k2m)

After this contribution:
• Your balance: 450 XLM
• Group progress: 8/10 members paid
```

**Buttons**:
- Primary: "Confirm & Pay"
- Secondary: "Cancel"

### Success Message
```
✓ Contribution Received

Your 100 XLM contribution has been recorded. The group is waiting on 2 more members.

[View Group]
```

### Reminder Notification
```
Contribution Due Soon

Your 100 XLM contribution to "Weekend Savers" is due in 2 days.

[Contribute Now] [Dismiss]
```

---

## Payout Flow

### Payout Notification
```
🎉 You're Receiving a Payout

All members have contributed to Cycle 3. You're receiving 1,000 XLM.

[Claim Payout] [View Details]
```

### Payout Success
```
✓ Payout Received

1,000 XLM has been transferred to your wallet.

[View Transaction] [Back to Group]
```

### Automatic Payout (if auto-executed)
```
✓ Payout Completed

1,000 XLM was automatically sent to your wallet when all members contributed.

[View Transaction]
```

---

## Group Management (Creator/Admin)

### Group Settings

**Section Headers**:
- "Group Information"
- "Member Management"
- "Cycle Settings"
- "Danger Zone"

### Member Management

**Member List Item**:
```
Alice (alice...7k2m)
Position: 2 • Contributions: 3/3 ✓

[View Profile] [Remove Member]
```

**Remove Member Modal**:

**Title**: "Remove Member?"

**Body**:
```
Are you sure you want to remove Alice from "Weekend Savers"?

This action cannot be undone. Alice will lose their payout position and any future participation.
```

**Buttons**:
- Primary (destructive): "Remove Member"
- Secondary: "Cancel"

### Close Group Modal

**Title**: "Close This Group?"

**Body**:
```
Warning: This will permanently close "Weekend Savers"

Only close a group if:
• All payouts are complete, OR
• All members agree to dissolve early

This action cannot be undone.
```

**Buttons**:
- Primary (destructive): "Close Group"
- Secondary: "Cancel"

---

## Error Messages

### Connection Errors

**Wallet Not Connected**:
```
Wallet Not Connected

Please connect your Stellar wallet to continue.

[Connect Wallet]
```

**Network Error**:
```
Connection Issue

We couldn't reach the Stellar network. Check your internet connection and try again.

[Retry]
```

### Transaction Errors

**Insufficient Balance**:
```
Insufficient Balance

You need 100 XLM to contribute, but your balance is 75 XLM. Add funds to your wallet and try again.

[Cancel]
```

**Transaction Failed**:
```
Transaction Failed

Your contribution couldn't be processed. This might be a temporary network issue.

Error code: TX_FAILED_123

[Try Again] [Get Help]
```

**Transaction Timeout**:
```
Transaction Timed Out

Your transaction is taking longer than expected. It may still complete successfully.

[Check Status] [Cancel]
```

### Validation Errors

**Invalid Group ID**:
```
Group Not Found

We couldn't find a group with that ID. Check the ID and try again.
```

**Group Full**:
```
Group Is Full

This group has reached its maximum number of members. Try exploring other groups.

[Explore Groups]
```

**Already a Member**:
```
You're Already in This Group

You're already a member of "Weekend Savers".

[View Group]
```

**Duplicate Contribution**:
```
Already Contributed

You've already contributed to this cycle. Your next contribution is due in 6 days.
```

**Contribution Not Due**:
```
Contribution Not Yet Due

Your next contribution is due on Feb 25, 2026. Check back then.

[View Group]
```

### Permission Errors

**Not a Member**:
```
Access Denied

You must be a member to view this group's details.

[Join Group] [Go Back]
```

**Not Group Creator**:
```
Admin Access Required

Only the group creator can perform this action.
```

---

## Empty States

### No Groups (My Groups page)
```
You Haven't Joined Any Groups Yet

Ajo groups help you save with your community. Join an existing group or create your own.

[Explore Groups] [Create Group]
```

### No Activity
```
No Recent Activity

Your contributions, payouts, and group updates will appear here.
```

### No Search Results
```
No Matches Found

Try different keywords or browse all available groups.

[Clear Search] [View All Groups]
```

### Group Complete
```
🎉 Group Complete

All members have received their payouts. Thanks for participating in "Weekend Savers"!

[View History] [Create New Group]
```

---

## Loading States

### General Loading
```
Loading...
```

### Specific Actions
- "Creating group..."
- "Joining group..."
- "Processing contribution..."
- "Executing payout..."
- "Loading groups..."
- "Connecting to wallet..."
- "Verifying transaction..."

### Progress Indicators

**Multi-step Process**:
```
Step 2 of 3: Confirming Transaction

Please approve the transaction in your wallet.
```

---

## Informational Messages

### First-Time User (Onboarding)

**Welcome Screen**:
```
Welcome to Soroban Ajo

Ajo is a traditional savings system where groups contribute together and take turns receiving payouts.

Here's how it works:
1. Join or create a group
2. Contribute each cycle
3. Receive the full pool when it's your turn

[Get Started] [Learn More]
```

**What is Ajo?** (Info modal):
```
What is Ajo?

Ajo (also called Esusu) is a rotating savings system practiced in African communities for generations.

How it works:
• A group of people agree to contribute the same amount regularly
• Each cycle, one member receives the total contributions
• Everyone gets a turn to receive the payout
• No interest, no banks—just community trust

On Soroban Ajo, smart contracts automate this process, making it transparent and trustless.

[Close]
```

### Educational Tooltips

**Smart Contract** (ⓘ):
> A smart contract is code that runs on the blockchain and automatically executes when conditions are met. Your contributions and payouts are handled by code, not people.

**XLM** (ⓘ):
> XLM (Lumens) is the native cryptocurrency of the Stellar network. You'll need XLM to participate in groups and pay small transaction fees.

**Cycle** (ⓘ):
> A cycle is the period between contributions. In a weekly cycle, you contribute once per week. Each cycle, one member receives a payout.

**Payout Position** (ⓘ):
> Your position in line to receive the group's pooled contributions. Position 1 receives the first payout, position 2 the second, and so on.

---

## Confirmation Dialogs

### Leave Group

**Title**: "Leave This Group?"

**Body**:
```
Are you sure you want to leave "Weekend Savers"?

You've contributed 3 times and are in position 8 for payouts. Leaving means you'll forfeit your payout position.

This action cannot be undone.
```

**Buttons**:
- Primary (destructive): "Leave Group"
- Secondary: "Stay in Group"

### Cancel Transaction

**Title**: "Cancel Transaction?"

**Body**:
```
Your contribution hasn't been submitted yet. Are you sure you want to cancel?
```

**Buttons**:
- Primary: "Yes, Cancel"
- Secondary: "Continue"

---

## Accessibility Considerations

### Screen Reader Announcements

**After successful contribution**:
> "Contribution successful. You paid 100 XLM to Weekend Savers group. 8 of 10 members have contributed to cycle 3."

**After receiving payout**:
> "Payout received. 1,000 XLM has been transferred to your wallet."

**Error occurred**:
> "Error: Transaction failed. Your contribution could not be processed. Please try again."

### ARIA Labels

- `aria-label="Create new Ajo group"`
- `aria-label="Contribute 100 XLM to current cycle"`
- `aria-label="Group status: Open, 7 of 10 members"`
- `aria-label="Your contribution status: Paid"`
- `aria-describedby="contribution-helper-text"`

### Alt Text for Icons

- ✓ checkmark: "Completed"
- ⓘ info icon: "More information"
- ⚠️ warning: "Warning"
- 🎉 celebration: "Success"

### Color-Independent Indicators

Always pair color with text or icons:
- ✓ Paid (not just green)
- ⚠️ Overdue (not just red)
- ⏳ Pending (not just yellow)

---

## Copy Variations for A/B Testing

### Primary CTA (Create Group)

**Variant A**: "Create Group"
**Variant B**: "Start a Group"
**Variant C**: "Create Your Ajo"

### Join Group CTA

**Variant A**: "Join Group"
**Variant B**: "Join Now"
**Variant C**: "Request to Join"

### Contribution CTA

**Variant A**: "Contribute Now"
**Variant B**: "Pay This Cycle"
**Variant C**: "Make Contribution"

### Value Proposition (Homepage)

**Variant A**: "Save together, grow together"
**Variant B**: "Traditional savings, blockchain trust"
**Variant C**: "Community savings made transparent"

### Empty State CTA

**Variant A**: "Create your first group"
**Variant B**: "Get started with Ajo"
**Variant C**: "Start saving together"

---

## Microcopy

### Timestamps
- "Just now"
- "2 minutes ago"
- "1 hour ago"
- "Yesterday"
- "Feb 19, 2026"

### Relative Dates
- "Due today"
- "Due tomorrow"
- "Due in 3 days"
- "Overdue by 2 days"

### Status Updates
- "Waiting on 3 members"
- "All members paid"
- "Payout ready"
- "Cycle complete"

### Transaction Details
- "Transaction fee: ~0.01 XLM"
- "Estimated time: 5 seconds"
- "Confirmation: 1 of 1"

---

## Legal & Compliance

### Terms Acceptance (First Use)
```
By using Soroban Ajo, you agree to our Terms of Service and Privacy Policy.

Soroban Ajo is a decentralized application. You are responsible for your wallet security and transaction decisions.

[I Agree] [Read Terms]
```

### Risk Disclaimer (Group Creation)
```
Important: Understand the Risks

• Smart contracts are experimental technology
• Transactions on the blockchain are irreversible
• You are responsible for your wallet's security
• Only contribute amounts you can afford

[I Understand] [Learn More]
```

---

## Support & Help

### Help Center Link
"Need help? Visit our Help Center"

### Contact Support
"Contact Support"

### FAQ Trigger
"Frequently Asked Questions"

### Report Issue
"Report a Problem"

---

## Version & Updates

### Update Available
```
Update Available

A new version of Soroban Ajo is available with bug fixes and improvements.

[Update Now] [Later]
```

### Maintenance Mode
```
Scheduled Maintenance

Soroban Ajo will be unavailable on Feb 20 from 2:00-4:00 UTC for maintenance.

[Learn More]
```

---

## Cultural Sensitivity Notes

- Use "Ajo" and "Esusu" interchangeably to honor both Nigerian and broader West African traditions
- Avoid terms like "primitive" or "informal" when describing traditional savings systems
- Emphasize community and trust, not just technology
- Recognize that many users may be new to blockchain—explain without condescension
- Support multiple languages in future iterations (Yoruba, Igbo, Hausa, Swahili)

---

**Document Version**: 1.0  
**Last Updated**: February 19, 2026  
**Maintained By**: Soroban Ajo Team
