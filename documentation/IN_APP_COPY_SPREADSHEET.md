# In-App Copy Spreadsheet

## Button Labels & CTAs

| Context | Type | Label | Alt Text | Character Count | Notes |
|---------|------|-------|----------|-----------------|-------|
| Homepage | Primary | Start Your Ajo | Create a new savings group | 14 | Main CTA |
| Group List | Primary | Create Group | Start a new Ajo savings group | 12 | Action button |
| Group Details | Primary | Join This Group | Join this savings group | 15 | Commitment action |
| Contribution | Primary | Contribute Now | Make your contribution for this cycle | 14 | Time-sensitive |
| Payout | Primary | Claim Payout | Claim your savings payout | 12 | Reward action |
| Group Details | Secondary | View Members | See all group members | 12 | Info action |
| Group Details | Secondary | View History | See contribution and payout history | 12 | Info action |
| Dashboard | Secondary | My Groups | View all your groups | 9 | Navigation |
| Settings | Secondary | Disconnect Wallet | Disconnect your Stellar wallet | 17 | Destructive |
| Navigation | Tertiary | How It Works | Learn about Ajo savings | 12 | Educational |
| Footer | Tertiary | Help & Support | Get help using Ajo | 14 | Support |
| Group Card | Tertiary | Learn More | View group details | 10 | Info link |

## Form Fields

| Form | Field | Label | Placeholder | Helper Text | Validation | Character Limit |
|------|-------|-------|-------------|-------------|------------|-----------------|
| Create Group | Amount | Contribution Amount | 1000 | Amount each member contributes per cycle | >0, numeric | - |
| Create Group | Duration | Cycle Duration | 7 days | How often members contribute | >0, numeric | - |
| Create Group | Members | Maximum Members | 10 | Total number of people in your group (2-100) | 2-100, numeric | - |
| Join Group | Confirm | I understand the commitment | - | You'll contribute [amount] every [duration] | Required | - |

## Success Messages

| Action | Message | Duration | Dismissible | Icon |
|--------|---------|----------|-------------|------|
| Group Created | Group created successfully! Your Ajo group is ready. Share the group ID with members to invite them. | 5s | Yes | ✓ |
| Joined Group | You've joined the group! Welcome! Your first contribution is due on [date]. | 5s | Yes | ✓ |
| Contribution | Contribution received! Thank you! [X] of [Y] members have contributed this cycle. | 4s | Yes | ✓ |
| Payout Claimed | Payout claimed! [Amount] XLM has been sent to your wallet. | 5s | Yes | ✓ |
| Wallet Connected | Wallet connected. You're connected with [wallet address] | 3s | Yes | ✓ |
| Settings Saved | Settings saved. Your preferences have been updated. | 3s | Yes | ✓ |

## Error Messages

| Error Code | Error Type | User Message | Technical Details | Suggested Action | Severity |
|------------|------------|--------------|-------------------|------------------|----------|
| 9 | ContributionAmountZero | Contribution amount must be greater than zero. Please enter a positive amount for members to contribute. | amount == 0 | Enter positive amount | Warning |
| 17 | ContributionAmountNegative | Contribution amount cannot be negative. Please enter a valid positive amount. | amount < 0 | Enter positive amount | Warning |
| 10 | CycleDurationZero | Cycle duration must be at least 1 day. Groups need time between contributions. Try 7 days for weekly cycles. | duration == 0 | Enter valid duration | Warning |
| 11 | MaxMembersBelowMinimum | Groups need at least 2 members. Ajo works by rotating savings between members. Add at least one more person. | max_members < 2 | Increase member count | Warning |
| 18 | MaxMembersAboveLimit | Maximum 100 members allowed. Large groups can be hard to coordinate. Consider creating multiple smaller groups. | max_members > 100 | Reduce member count | Warning |
| 2 | MaxMembersExceeded | This group is full. All spots are taken. Try creating your own group or find another one. | members.len() >= max | Find another group | Error |
| 12 | InsufficientBalance | Insufficient balance. You need [amount] XLM to contribute. Your balance: [balance] XLM. | balance < required | Add funds | Error |
| 13 | TransferFailed | Transaction failed. Your contribution couldn't be processed. Please try again. | Transfer error | Retry or get help | Error |
| 5 | AlreadyContributed | You've already contributed this cycle. Your next contribution is due on [date]. | Duplicate contribution | Wait for next cycle | Info |
| 4 | NotMember | You're not a member of this group. Join the group first to contribute. | Not in members list | Join group | Error |
| 3 | AlreadyMember | You're already a member of this group. | Duplicate join | View group details | Info |
| 1 | GroupNotFound | Group not found. This group doesn't exist or has been removed. | Invalid group_id | Check group ID | Error |
| 8 | GroupComplete | This group has completed all cycles. All members have received their payouts. | is_complete == true | Create new group | Info |
| - | WalletNotConnected | Wallet not connected. Connect your Stellar wallet to continue. | No wallet | Connect wallet | Error |
| - | WrongNetwork | Wrong network detected. Please switch to Stellar [Testnet/Mainnet] in your wallet. | Network mismatch | Switch network | Error |

## Empty States

| Location | Headline | Body | Primary CTA | Secondary CTA | Icon |
|----------|----------|------|-------------|---------------|------|
| Dashboard | Start Your First Ajo | Ajo is a traditional savings method where groups save together and take turns receiving payouts. Ready to begin your savings journey? | Create Your First Group | Learn How It Works | 🌟 |
| Group Members | Invite Members to Join | Your group is ready! Share this group ID with friends and family to invite them. You need at least 2 members to start. | Copy Link | - | 👥 |
| Contributions | First Cycle Starting Soon | Cycle starts: [Date]. Your contribution: [Amount] XLM. Be the first to contribute and set a great example! | Contribute Now | - | 💰 |
| History | No Activity Yet | Once your group starts contributing, you'll see all transactions and payouts here. | - | - | 📊 |
| Search | No groups found | Try adjusting your search or create a new group. | Create Group | - | 🔍 |

## Loading States

| Action | Message | Estimated Time | Cancellable |
|--------|---------|----------------|-------------|
| General | Loading... | <1s | No |
| Create Group | Creating your group... | 2-5s | No |
| Process Contribution | Processing contribution... | 3-7s | No |
| Claim Payout | Claiming payout... | 3-7s | No |
| Load Group | Loading group details... | 1-3s | Yes |
| Connect Wallet | Connecting wallet... | 2-5s | Yes |
| Fetch History | Fetching transaction history... | 2-4s | Yes |

## Tooltips

| Element | Tooltip Text | Trigger | Max Width |
|---------|--------------|---------|-----------|
| Contribution Due | Your next contribution is due in [X] days. Contribute early to help your group! | Hover/Focus | 200px |
| Your Turn | You're next in line! Once everyone contributes, you'll receive [amount] XLM. | Hover/Focus | 200px |
| Group Complete | This group has finished all cycles. Everyone has received their payout! | Hover/Focus | 200px |
| Cycle Duration | How often members contribute. Common choices: 7 days (weekly) or 30 days (monthly). | Hover/Focus | 250px |
| Contribution Amount | The fixed amount each member contributes every cycle. Choose an amount everyone can afford. | Hover/Focus | 250px |
| Payout Order | Members receive payouts in the order they joined. Fair and transparent! | Hover/Focus | 200px |
| Transaction Fee | Stellar charges a small fee (≈0.00001 XLM) for each transaction. | Hover/Focus | 200px |

## Status Indicators

| Status | Label | Color | Icon | Description |
|--------|-------|-------|------|-------------|
| Active | Active | Green | 🟢 | Accepting members |
| In Progress | In Progress | Yellow | 🟡 | Contributions ongoing |
| Waiting | Waiting | Blue | 🔵 | Pending contributions |
| Complete | Complete | Green | 🟢 | All payouts distributed |
| Paused | Paused | Red | 🔴 | Contact support |
| Contributed | Contributed | Green | ✓ | You're all set for this cycle |
| Pending | Pending | Yellow | ⏳ | Contribution due by [date] |
| Overdue | Overdue | Orange | ⚠️ | Please contribute now |
| Missed | Missed | Red | ❌ | Contact group admin |

## Confirmation Dialogs

| Action | Title | Body | Cancel Button | Confirm Button | Destructive |
|--------|-------|------|---------------|----------------|-------------|
| Create Group | Confirm Group Creation | Contribution Amount: [amount] XLM, Cycle Duration: [duration] days, Max Members: [number]. You'll be the first member and contribute immediately. | Cancel | Create Group | No |
| Join Group | Join This Group? | By joining, you commit to: Contributing [amount] XLM every [duration] days, Staying until you receive your payout, Supporting your fellow members. | Cancel | Join Group | No |
| Contribute | Confirm Contribution | Amount: [amount] XLM, Group: [group name/id], Cycle: [X] of [Y]. This contribution cannot be reversed. | Cancel | Contribute | No |
| Leave Group | Leave Group? | Warning: Leaving may affect other members and you might lose your spot in the payout rotation. Are you sure you want to leave? | Stay in Group | Leave Group | Yes |

## Navigation

| Location | Label | Icon | Badge | Order |
|----------|-------|------|-------|-------|
| Main Nav | Home | 🏠 | - | 1 |
| Main Nav | My Groups | 👥 | Count | 2 |
| Main Nav | Create Group | ➕ | - | 3 |
| Main Nav | Find Groups | 🔍 | - | 4 |
| Main Nav | Dashboard | 📊 | - | 5 |
| Main Nav | Settings | ⚙️ | - | 6 |
| Main Nav | Help | ❓ | - | 7 |

## Microcopy

| Type | Examples | Format |
|------|----------|--------|
| Timestamps | Just now, 2 minutes ago, 1 hour ago, Yesterday at 3:45 PM, Jan 15, 2026 | Relative < 24h, Absolute > 24h |
| Amounts | 1,000 XLM, ≈ $250 USD, +500 XLM (received), -100 XLM (contributed) | Comma separator, 2 decimals |
| Dates | Due: Tomorrow, Due: In 3 days, Due: Jan 20, 2026, Overdue by 2 days | Relative when close |
| Counts | 5 members, 3 of 5 contributed, Cycle 2 of 10, 2 groups active | X of Y format |

## A/B Test Variations

| Element | Variant A | Variant B | Variant C | Hypothesis |
|---------|-----------|-----------|-----------|------------|
| Create Group CTA | Create Group | Start Your Ajo | Begin Saving Together | "Start Your Ajo" more culturally relevant |
| Join Group CTA | Join This Group | Join Now | Count Me In | "Count Me In" more engaging |
| Contribute CTA | Contribute Now | Make Contribution | Add My Share | "Add My Share" emphasizes community |
| Empty State Headline | Start Your First Ajo | Ready to Start Saving? | Join 10,000+ People Saving with Ajo | Social proof increases conversion |

## Character Limits

| Element | Minimum | Maximum | Optimal | Notes |
|---------|---------|---------|---------|-------|
| Button Label | 3 | 20 | 8-12 | Keep concise |
| Success Message | 10 | 150 | 50-80 | Clear and brief |
| Error Message | 20 | 200 | 80-120 | Helpful detail |
| Tooltip | 10 | 100 | 40-60 | Quick help |
| Empty State Headline | 5 | 50 | 15-30 | Attention grabbing |
| Empty State Body | 20 | 200 | 80-120 | Explain context |
| Form Label | 3 | 30 | 10-20 | Clear identifier |
| Helper Text | 10 | 100 | 30-60 | Useful guidance |

## Accessibility Notes

| Element | ARIA Label | Screen Reader Text | Focus Order |
|---------|------------|-------------------|-------------|
| Create Group Button | Create new Ajo savings group | Button: Create new Ajo savings group | 1 |
| Amount Input | Contribution amount in XLM | Input: Contribution amount in XLM, required | 2 |
| Duration Input | Cycle duration in days | Input: Cycle duration in days, required | 3 |
| Members Input | Maximum number of members | Input: Maximum number of members, required, minimum 2, maximum 100 | 4 |
| Success Alert | Group created successfully | Alert: Group created successfully. Your Ajo group is ready. | Auto-focus |
| Error Alert | Error creating group | Alert: Error. [Error message]. | Auto-focus |

---

**Document Version**: 1.0  
**Format**: Markdown Spreadsheet  
**Last Updated**: February 20, 2026  
**Total Entries**: 100+  
**Languages**: English (Primary)  
**Future Languages**: Spanish, French, Yoruba, Igbo, Swahili
