# Soroban Ajo - In-App Copy Guide

## Tone and Voice Guidelines

### Voice Characteristics
- **Friendly**: Warm and approachable, like a trusted community member
- **Clear**: Simple language, avoiding blockchain jargon
- **Empowering**: Emphasizes user control and community benefit
- **Respectful**: Honors the cultural heritage of Ajo/Esusu traditions
- **Encouraging**: Positive reinforcement for financial discipline

### Writing Principles
1. **Use "you" and "your"** - Direct, personal communication
2. **Active voice** - "Create your group" not "A group can be created"
3. **Plain language** - "Amount" not "Contribution quantum"
4. **Positive framing** - Focus on what users can do, not restrictions
5. **Cultural sensitivity** - Respect African savings traditions

### Accessibility Guidelines
- Keep sentences under 20 words
- Use common words (6th-grade reading level)
- Provide context for all actions
- Avoid idioms and cultural references that don't translate
- Include descriptive alt text for all icons

---

## Button Labels & CTAs

### Primary Actions
| Context | Button Label | Alt Text |
|---------|--------------|----------|
| Homepage | **Start Your Ajo** | Create a new savings group |
| Group List | **Create Group** | Start a new Ajo savings group |
| Group Details | **Join This Group** | Join this savings group |
| Contribution | **Contribute Now** | Make your contribution for this cycle |
| Payout | **Claim Payout** | Claim your savings payout |

### Secondary Actions
| Context | Button Label | Alt Text |
|---------|--------------|----------|
| Group Details | **View Members** | See all group members |
| Group Details | **View History** | See contribution and payout history |
| Dashboard | **My Groups** | View all your groups |
| Settings | **Disconnect Wallet** | Disconnect your Stellar wallet |

### Tertiary Actions
| Context | Link Label | Alt Text |
|---------|------------|----------|
| Navigation | **How It Works** | Learn about Ajo savings |
| Footer | **Help & Support** | Get help using Ajo |
| Group Card | **Learn More** | View group details |

---

## Form Labels & Placeholders

### Create Group Form

**Form Title**: Create Your Ajo Group

| Field | Label | Placeholder | Helper Text |
|-------|-------|-------------|-------------|
| Amount | **Contribution Amount** | 1000 | Amount each member contributes per cycle |
| Duration | **Cycle Duration** | 7 days | How often members contribute |
| Members | **Maximum Members** | 10 | Total number of people in your group (2-100) |

### Join Group Form

**Form Title**: Join This Group

| Field | Label | Placeholder | Helper Text |
|-------|-------|-------------|-------------|
| Confirmation | **I understand the commitment** | [Checkbox] | You'll contribute [amount] every [duration] |

---

## Success Messages

### Group Actions
```
✓ Group created successfully!
  Your Ajo group is ready. Share the group ID with members to invite them.

✓ You've joined the group!
  Welcome! Your first contribution is due on [date].

✓ Contribution received!
  Thank you! [X] of [Y] members have contributed this cycle.

✓ Payout claimed!
  [Amount] XLM has been sent to your wallet.
```

### Wallet Actions
```
✓ Wallet connected
  You're connected with [wallet address]

✓ Settings saved
  Your preferences have been updated.
```

---

## Error Messages

### Validation Errors

**Contribution Amount**
```
❌ Contribution amount must be greater than zero
   Please enter a positive amount for members to contribute.

❌ Contribution amount cannot be negative
   Please enter a valid positive amount.
```

**Cycle Duration**
```
❌ Cycle duration must be at least 1 day
   Groups need time between contributions. Try 7 days for weekly cycles.
```

**Max Members**
```
❌ Groups need at least 2 members
   Ajo works by rotating savings between members. Add at least one more person.

❌ Maximum 100 members allowed
   Large groups can be hard to coordinate. Consider creating multiple smaller groups.

❌ This group is full
   All spots are taken. Try creating your own group or find another one.
```

### Transaction Errors

**Insufficient Balance**
```
❌ Insufficient balance
   You need [amount] XLM to contribute. Your balance: [balance] XLM.
   
   [Add Funds] [Cancel]
```

**Transaction Failed**
```
❌ Transaction failed
   Your contribution couldn't be processed. Please try again.
   
   Common fixes:
   • Check your internet connection
   • Ensure your wallet is unlocked
   • Verify you have enough XLM for fees
   
   [Try Again] [Get Help]
```

**Already Contributed**
```
❌ You've already contributed this cycle
   Your next contribution is due on [date].
```

### Wallet Errors

**Wallet Not Connected**
```
❌ Wallet not connected
   Connect your Stellar wallet to continue.
   
   [Connect Wallet]
```

**Wrong Network**
```
❌ Wrong network detected
   Please switch to Stellar [Testnet/Mainnet] in your wallet.
```

### Authorization Errors

**Not a Member**
```
❌ You're not a member of this group
   Join the group first to contribute.
   
   [Join Group]
```

**Unauthorized Action**
```
❌ You don't have permission for this action
   Only group members can perform this action.
```

---

## Empty States

### No Groups
```
🌟 Start Your First Ajo

Ajo is a traditional savings method where groups save together 
and take turns receiving payouts.

Ready to begin your savings journey?

[Create Your First Group]  [Learn How It Works]
```

### No Members Yet
```
👥 Invite Members to Join

Your group is ready! Share this group ID with friends and 
family to invite them:

[Group ID: 12345]  [Copy Link]

You need at least 2 members to start.
```

### No Contributions Yet
```
💰 First Cycle Starting Soon

Cycle starts: [Date]
Your contribution: [Amount] XLM

Be the first to contribute and set a great example!

[Contribute Now]
```

### No History
```
📊 No Activity Yet

Once your group starts contributing, you'll see all 
transactions and payouts here.
```

### Search No Results
```
🔍 No groups found

Try adjusting your search or create a new group.

[Create Group]
```

---

## Loading States

### General Loading
```
⏳ Loading...
```

### Specific Actions
```
⏳ Creating your group...
⏳ Processing contribution...
⏳ Claiming payout...
⏳ Loading group details...
⏳ Connecting wallet...
⏳ Fetching transaction history...
```

### Progress Indicators
```
Step 1 of 3: Group Details
Step 2 of 3: Review
Step 3 of 3: Confirm

[Progress bar: 33%]
```

---

## Tooltips & Helper Text

### Dashboard
```
💡 Contribution Due
   Your next contribution is due in [X] days. Contribute early to help your group!

💡 Your Turn for Payout
   You're next in line! Once everyone contributes, you'll receive [amount] XLM.

💡 Group Complete
   This group has finished all cycles. Everyone has received their payout!
```

### Group Details
```
💡 Cycle Duration
   How often members contribute. Common choices: 7 days (weekly) or 30 days (monthly).

💡 Contribution Amount
   The fixed amount each member contributes every cycle. Choose an amount everyone can afford.

💡 Payout Order
   Members receive payouts in the order they joined. Fair and transparent!

💡 Current Cycle
   Cycle [X] of [Y]. Each member gets one payout per cycle.
```

### Wallet
```
💡 Transaction Fee
   Stellar charges a small fee (≈0.00001 XLM) for each transaction.

💡 Wallet Address
   Your unique Stellar address. Keep it safe and never share your secret key!
```

---

## Confirmation Dialogs

### Create Group
```
Confirm Group Creation

Contribution Amount: [amount] XLM
Cycle Duration: [duration] days
Max Members: [number]

You'll be the first member and contribute immediately.

[Cancel]  [Create Group]
```

### Join Group
```
Join This Group?

By joining, you commit to:
• Contributing [amount] XLM every [duration] days
• Staying until you receive your payout
• Supporting your fellow members

[Cancel]  [Join Group]
```

### Contribute
```
Confirm Contribution

Amount: [amount] XLM
Group: [group name/id]
Cycle: [X] of [Y]

This contribution cannot be reversed.

[Cancel]  [Contribute]
```

### Leave Group (if allowed)
```
⚠️ Leave Group?

Warning: Leaving may affect other members and you might 
lose your spot in the payout rotation.

Are you sure you want to leave?

[Stay in Group]  [Leave Group]
```

---

## Informational Messages

### First Time User
```
👋 Welcome to Ajo!

Ajo (also called Esusu) is a traditional African savings method 
that's helped communities build wealth for generations.

Here's how it works:
1. Form a group with friends or family
2. Everyone contributes the same amount each cycle
3. Take turns receiving the full pot
4. Build savings and financial discipline together

[Get Started]  [Watch Video]
```

### Cycle Complete
```
🎉 Cycle [X] Complete!

All members have contributed. [Member name] will receive 
their payout of [amount] XLM.

Next cycle starts: [date]

[View Details]
```

### Group Complete
```
🎊 Group Completed Successfully!

Congratulations! All members have received their payouts.

Total saved: [amount] XLM
Cycles completed: [number]
Members: [number]

Want to start another round?

[Create New Group]  [View Summary]
```

---

## Status Indicators

### Group Status
```
🟢 Active - Accepting members
🟡 In Progress - Contributions ongoing
🔵 Waiting - Pending contributions
🟢 Complete - All payouts distributed
🔴 Paused - Contact support
```

### Contribution Status
```
✓ Contributed - You're all set for this cycle
⏳ Pending - Contribution due by [date]
⚠️ Overdue - Please contribute now
❌ Missed - Contact group admin
```

### Member Status
```
👤 Active Member
👑 Group Creator
💰 Next for Payout
✓ Received Payout
```

---

## Navigation Labels

### Main Navigation
```
🏠 Home
👥 My Groups
➕ Create Group
🔍 Find Groups
📊 Dashboard
⚙️ Settings
❓ Help
```

### Breadcrumbs
```
Home > My Groups > Group #12345
Dashboard > Create Group > Review
```

---

## Accessibility Considerations

### Screen Reader Announcements
```
"Group created successfully. You are now the first member."
"Contribution submitted. 3 of 5 members have contributed."
"Error: Insufficient balance. You need 1000 XLM."
"Loading group details. Please wait."
```

### ARIA Labels
```
aria-label="Create new Ajo savings group"
aria-label="Contribution amount in XLM"
aria-label="Close dialog"
aria-describedby="helper-text-contribution"
```

### Focus Management
```
After form submission: Focus moves to success message
After error: Focus moves to first error field
After modal close: Focus returns to trigger button
```

---

## Microcopy

### Timestamps
```
Just now
2 minutes ago
1 hour ago
Yesterday at 3:45 PM
Jan 15, 2026
```

### Amounts
```
1,000 XLM
≈ $250 USD
+500 XLM (received)
-100 XLM (contributed)
```

### Dates
```
Due: Tomorrow
Due: In 3 days
Due: Jan 20, 2026
Overdue by 2 days
```

### Counts
```
5 members
3 of 5 contributed
Cycle 2 of 10
2 groups active
```

---

## Copy Variations for A/B Testing

### CTA Variations

**Create Group Button**
- Variant A: "Create Group"
- Variant B: "Start Your Ajo"
- Variant C: "Begin Saving Together"

**Join Group Button**
- Variant A: "Join This Group"
- Variant B: "Join Now"
- Variant C: "Count Me In"

**Contribute Button**
- Variant A: "Contribute Now"
- Variant B: "Make Contribution"
- Variant C: "Add My Share"

### Empty State Variations

**No Groups - Variant A (Educational)**
```
What is Ajo?

A time-tested way to save money with your community.
Everyone contributes, everyone benefits.

[Learn More]  [Create Group]
```

**No Groups - Variant B (Action-Focused)**
```
Ready to Start Saving?

Create your first Ajo group in under 2 minutes.

[Create Group]
```

**No Groups - Variant C (Social Proof)**
```
Join 10,000+ People Saving with Ajo

Traditional savings, blockchain security.

[Get Started]
```

### Error Message Variations

**Insufficient Balance - Variant A (Helpful)**
```
❌ Not enough XLM
   You need 1000 XLM. Your balance: 500 XLM.
   [Add Funds]
```

**Insufficient Balance - Variant B (Detailed)**
```
❌ Insufficient balance
   Required: 1000 XLM
   Your balance: 500 XLM
   Needed: 500 XLM more
   [Add Funds]  [Cancel]
```

---

## Contextual Help

### Inline Help
```
❓ What's a cycle?
   A cycle is the time period between contributions. 
   If your cycle is 7 days, you contribute once per week.

❓ When do I get paid?
   You'll receive your payout when it's your turn in the 
   rotation and all members have contributed.

❓ Can I leave early?
   It's best to stay until you receive your payout. 
   Leaving early may affect other members.
```

### Onboarding Tips
```
💡 Tip: Start with a small amount
   New to Ajo? Try a small contribution amount (like 100 XLM) 
   to get comfortable with the process.

💡 Tip: Invite trusted friends
   Ajo works best with people you know and trust. 
   Start with family or close friends.

💡 Tip: Set reminders
   Enable notifications so you never miss a contribution deadline.
```

---

## Legal & Compliance Copy

### Terms Acceptance
```
By creating a group, you agree to:
• Contribute the specified amount each cycle
• Follow the payout rotation order
• Respect other members' commitments

[View Full Terms]
```

### Disclaimer
```
⚠️ Important: Ajo is a community savings tool, not an investment 
product. Only contribute amounts you can afford. Smart contracts 
are audited but use at your own risk.
```

### Privacy Notice
```
🔒 Your privacy matters
   We don't store your private keys. All transactions are 
   on-chain and publicly visible on Stellar.
   
   [Privacy Policy]
```

---

## Email/Notification Copy

### Contribution Reminder
```
Subject: Time to Contribute to Your Ajo Group

Hi [Name],

Your contribution of [amount] XLM is due in 2 days for 
Group #[id].

[Contribute Now]

Don't let your group down!
```

### Payout Ready
```
Subject: 🎉 Your Ajo Payout is Ready!

Hi [Name],

Great news! All members have contributed and your payout 
of [amount] XLM is ready to claim.

[Claim Payout]

Congratulations on your savings!
```

### Group Complete
```
Subject: Group Completed Successfully!

Hi [Name],

Your Ajo group has completed all cycles. Everyone received 
their payouts!

Total saved: [amount] XLM
Duration: [X] days

Ready to start another round?

[Create New Group]
```

---

## End of Copy Guide

**Version**: 1.0  
**Last Updated**: February 20, 2026  
**Maintained By**: Soroban Ajo Team  
**Feedback**: Submit copy suggestions via GitHub Issues
