# Tone and Voice Guide - Soroban Ajo

## Brand Voice

### Core Attributes

**Friendly** 🤝
- Warm and welcoming, like a trusted community member
- Use conversational language
- Address users directly with "you" and "your"
- Example: "Your group is ready!" not "The group has been created"

**Clear** 💡
- Simple, jargon-free language
- Explain blockchain concepts in everyday terms
- Break complex ideas into digestible pieces
- Example: "Connect your wallet" not "Initialize Web3 provider"

**Empowering** 💪
- Focus on what users can achieve
- Celebrate financial discipline and community
- Positive reinforcement for actions
- Example: "You're building savings together!" not "Transaction completed"

**Respectful** 🙏
- Honor the cultural heritage of Ajo/Esusu
- Acknowledge traditional African savings practices
- Inclusive language for global audience
- Example: "Ajo (also called Esusu)" - acknowledge multiple names

**Encouraging** 🌟
- Motivate users to stay committed
- Recognize contributions and milestones
- Support users through challenges
- Example: "Great job! 3 of 5 members have contributed" not "3/5 complete"

---

## Writing Principles

### 1. Use Active Voice
✅ **Do**: "Create your group in 2 minutes"  
❌ **Don't**: "A group can be created in 2 minutes"

✅ **Do**: "You'll receive your payout on March 15"  
❌ **Don't**: "The payout will be distributed on March 15"

### 2. Be Concise
✅ **Do**: "Contribution received!"  
❌ **Don't**: "Your contribution has been successfully received and processed"

✅ **Do**: "Join this group"  
❌ **Don't**: "Click here to become a member of this group"

### 3. Lead with Benefits
✅ **Do**: "Save together, reach goals faster"  
❌ **Don't**: "Blockchain-based rotational savings"

✅ **Do**: "Get your payout when it's your turn"  
❌ **Don't**: "Automated payout distribution via smart contract"

### 4. Explain, Don't Assume
✅ **Do**: "Cycle duration: How often members contribute (e.g., weekly)"  
❌ **Don't**: "Cycle duration"

✅ **Do**: "You need 1000 XLM to contribute. Your balance: 500 XLM"  
❌ **Don't**: "Insufficient balance"

### 5. Be Human
✅ **Do**: "Oops! Something went wrong. Let's try again."  
❌ **Don't**: "Error code 500: Internal server error"

✅ **Do**: "Welcome! Let's get you started."  
❌ **Don't**: "User onboarding initiated"

---

## Tone by Context

### Success States
**Tone**: Celebratory, encouraging, warm

```
🎉 Contribution received!
Thank you! You're helping your group succeed.

✓ Group created successfully!
Your Ajo group is ready. Time to invite members!

🎊 Payout claimed!
1,000 XLM is on its way to your wallet. Well done!
```

**Guidelines**:
- Use exclamation points (but not excessively)
- Include emojis for visual celebration
- Acknowledge the user's achievement
- Provide next steps

### Error States
**Tone**: Helpful, calm, solution-oriented

```
❌ Insufficient balance
You need 1000 XLM to contribute. Your balance: 500 XLM.

Common fixes:
• Add funds to your wallet
• Try a smaller contribution amount

[Add Funds]  [Get Help]
```

**Guidelines**:
- Never blame the user
- Explain what went wrong in plain language
- Offer clear solutions
- Provide escape routes (help, cancel)
- Avoid technical jargon

### Empty States
**Tone**: Inviting, educational, motivating

```
🌟 Start Your First Ajo

Ajo is a traditional savings method where groups save 
together and take turns receiving payouts.

Ready to begin your savings journey?

[Create Your First Group]  [Learn How It Works]
```

**Guidelines**:
- Explain why the state is empty
- Educate about the feature
- Provide clear call-to-action
- Make it feel like an opportunity, not a problem

### Loading States
**Tone**: Patient, informative, reassuring

```
⏳ Processing your contribution...

This usually takes 3-5 seconds.
```

**Guidelines**:
- Set expectations for wait time
- Use present progressive tense ("-ing")
- Keep it brief
- Reassure that progress is happening

### Confirmation Dialogs
**Tone**: Clear, cautious, respectful

```
Join This Group?

By joining, you commit to:
• Contributing 1000 XLM every 7 days
• Staying until you receive your payout
• Supporting your fellow members

This is a commitment to your community.

[Cancel]  [Join Group]
```

**Guidelines**:
- Clearly state what will happen
- List commitments or consequences
- Use "you" language
- Make cancel option equally prominent
- For destructive actions, use warning tone

---

## Language Guidelines

### Preferred Terms

| Use This | Not This | Why |
|----------|----------|-----|
| Contribute | Pay, Send, Transfer | More community-focused |
| Group | Pool, Contract, DAO | Simpler, more familiar |
| Cycle | Round, Period, Epoch | Clear and consistent |
| Payout | Distribution, Withdrawal, Claim | User-friendly |
| Member | Participant, User, Account | Personal and inclusive |
| Wallet | Account, Address, Key | Common crypto term |
| Amount | Value, Sum, Quantity | Simple and clear |

### Avoid These Terms

❌ **Technical Jargon**
- Smart contract → "automated group"
- On-chain → "on the blockchain" or omit
- Gas fees → "transaction fees"
- Testnet/Mainnet → "test mode" / "live mode"

❌ **Financial Jargon**
- Liquidity → "available funds"
- APY/ROI → explain in plain terms
- Collateral → "security deposit"
- Yield → "earnings" or "returns"

❌ **Negative Framing**
- "Don't forget" → "Remember"
- "You can't" → "You'll be able to [when]"
- "Failed" → "Couldn't complete" or "didn't go through"

---

## Grammar and Style

### Capitalization
- **Sentence case** for most UI elements
- **Title Case** for page titles and major headings
- **lowercase** for inline links in sentences

Examples:
- Button: "Create group" (sentence case)
- Page title: "My Ajo Groups" (title case)
- Link: "Learn more about how Ajo works" (lowercase inline)

### Punctuation
- **Periods**: Use in multi-sentence messages, skip in single-sentence buttons/labels
- **Exclamation points**: Use for success and celebration, limit to one per message
- **Question marks**: Use in confirmation dialogs and help text
- **Commas**: Use Oxford comma for lists

Examples:
- Button: "Create group" (no period)
- Success: "Group created successfully!" (exclamation)
- Dialog: "Leave this group?" (question mark)
- List: "Save, share, and succeed together" (Oxford comma)

### Numbers
- **Spell out** one through nine
- **Use numerals** for 10 and above
- **Use numerals** for amounts, dates, and technical values
- **Use commas** for thousands (1,000 not 1000)

Examples:
- "You need at least two members"
- "Invite up to 100 people"
- "Contribute 1,000 XLM"
- "Cycle 3 of 10"

### Dates and Times
- **Relative** for recent/near future: "2 minutes ago", "in 3 days"
- **Absolute** for distant: "March 15, 2026"
- **12-hour format** with AM/PM: "3:45 PM"
- **Spell out** "today" and "tomorrow"

Examples:
- "Due tomorrow"
- "Contributed 2 hours ago"
- "Next cycle starts March 15, 2026"

---

## Accessibility in Copy

### Write for Screen Readers

**Provide context**:
- ❌ "Click here"
- ✅ "Learn more about Ajo savings"

**Use descriptive labels**:
- ❌ "Submit"
- ✅ "Create group"

**Announce status changes**:
- "Success: Group created"
- "Error: Insufficient balance"
- "Loading: Processing contribution"

### Keep It Simple

**Reading level**: 6th-8th grade
- Use common words
- Short sentences (under 20 words)
- Active voice
- One idea per sentence

**Test**: Can a 12-year-old understand it?

### Avoid Idioms

❌ **Don't use**:
- "Piece of cake"
- "Hit the ground running"
- "In the same boat"

✅ **Use instead**:
- "Easy to do"
- "Get started quickly"
- "Working together"

### Be Literal

❌ **Ambiguous**: "Your group is on fire!"  
✅ **Clear**: "Your group is doing great!"

❌ **Ambiguous**: "Time to cash out"  
✅ **Clear**: "Time to claim your payout"

---

## Cultural Sensitivity

### Honor Ajo/Esusu Heritage

**Acknowledge origins**:
- "Ajo (also called Esusu) is a traditional African savings method"
- "This practice has helped communities for generations"

**Use authentic terms**:
- Keep "Ajo" and "Esusu" in the product
- Explain terms for those unfamiliar
- Don't oversimplify or westernize

**Respect the practice**:
- Emphasize community and trust
- Highlight financial discipline
- Celebrate collective success

### Global Audience

**Avoid**:
- US-centric references
- Cultural assumptions
- Regional idioms
- Holiday-specific language

**Include**:
- Universal examples
- Multiple currency references
- Diverse name examples
- Global time zones

---

## Copy Checklist

Before publishing any copy, verify:

- [ ] Uses active voice
- [ ] Written at 6th-8th grade level
- [ ] Free of jargon and technical terms
- [ ] Addresses user as "you"
- [ ] Provides clear next steps
- [ ] Includes helpful context
- [ ] Follows capitalization rules
- [ ] Uses proper punctuation
- [ ] Accessible to screen readers
- [ ] Culturally sensitive
- [ ] Matches brand voice
- [ ] Under character limit
- [ ] Tested with real users

---

## Examples by Scenario

### Scenario 1: First-Time User

**Bad**:
```
Initialize your Web3 wallet to interact with the Soroban 
smart contract and participate in ROSCA protocols.
```

**Good**:
```
👋 Welcome to Ajo!

Connect your Stellar wallet to start saving with your community.

[Connect Wallet]  [Learn More]
```

**Why it's better**:
- Friendly greeting
- Plain language (no jargon)
- Clear action
- Provides learning option

### Scenario 2: Transaction Error

**Bad**:
```
Error: TX_FAILED
Code: 0x1234
```

**Good**:
```
❌ Transaction didn't go through

Your contribution couldn't be processed. This usually happens when:
• Your wallet is locked
• You don't have enough XLM for fees
• Your internet connection dropped

[Try Again]  [Get Help]
```

**Why it's better**:
- Explains what happened
- Lists common causes
- Offers solutions
- Provides help option

### Scenario 3: Milestone Achievement

**Bad**:
```
Cycle complete. Payout distributed.
```

**Good**:
```
🎉 Cycle 5 Complete!

All members contributed and Sarah received her payout 
of 5,000 XLM. Great teamwork!

Next cycle starts tomorrow.

[View Details]
```

**Why it's better**:
- Celebrates achievement
- Personalizes with name
- Shows specific amount
- Provides next step

---

## Voice Dos and Don'ts

### Do ✅
- Be conversational and warm
- Use contractions (you're, we'll, it's)
- Address users directly
- Celebrate small wins
- Provide helpful context
- Admit when things go wrong
- Offer clear solutions
- Use emojis sparingly for emphasis

### Don't ❌
- Use corporate speak
- Be overly formal
- Blame users for errors
- Use ALL CAPS (except acronyms)
- Overuse exclamation points!!!
- Use technical jargon
- Make assumptions about knowledge
- Be condescending or patronizing

---

## Maintaining Consistency

### Style Guide Ownership
- **Owner**: Product/UX team
- **Contributors**: All team members
- **Review**: Quarterly updates
- **Feedback**: GitHub issues or Slack

### Copy Review Process
1. Draft copy following this guide
2. Check against voice attributes
3. Test with target users
4. Get team feedback
5. Implement and monitor

### Localization Notes
When translating:
- Maintain friendly, clear tone
- Adapt idioms and examples
- Keep technical terms consistent
- Test with native speakers
- Preserve cultural respect for Ajo/Esusu

---

**Document Version**: 1.0  
**Last Updated**: February 20, 2026  
**Next Review**: May 20, 2026  
**Maintained By**: Soroban Ajo Product Team
