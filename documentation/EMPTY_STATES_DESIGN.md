# Empty States Design System

## Overview
Comprehensive empty state designs that educate, guide, and encourage users to take action when no data exists.

---

## Design Principles

### Empty State Goals
- **Educational**: Explain what this section is for
- **Inviting**: Encourage users to add content
- **Actionable**: Clear CTA to get started
- **Delightful**: Use illustrations to add personality

### Visual Components
1. Illustration (120px-160px, centered)
2. Heading (text-2xl font-bold, gray-900)
3. Description (text-base text-gray-600, max-w-md)
4. Primary CTA Button
5. Secondary Help Link (optional)

---

## 1. No Groups Created

**When**: User hasn't created any savings groups yet

**Illustration**: 
- SVG: Three people in a circle with empty coin stack
- Colors: Blue-500, Purple-400, Gray-200
- Size: 160px × 160px
- Style: Friendly, modern, minimal

**Content**:
```
Heading: "Start Your First Savings Group"
Description: "Create a group to save together with friends, family, or community members. Everyone contributes, and members take turns receiving the pool."
Primary CTA: "Create Your First Group"
Secondary Link: "Learn How Ajo Works →"
```

**Component**:
```tsx
<EmptyState
  icon="social-users"
  illustrationSize="lg"
  heading="Start Your First Savings Group"
  message="Create a group to save together with friends, family, or community members."
  primaryAction={{
    label: "Create Your First Group",
    onClick: () => navigate('/create'),
    icon: "action-add",
  }}
  secondaryAction={{
    label: "Learn How Ajo Works",
    onClick: openTutorial,
  }}
/>
```

---

## 2. No Members in Group

**When**: Group created but no members have joined yet

**Illustration**:
- SVG: Empty circle with plus sign
- Colors: Blue-500, Gray-200
- Size: 120px × 120px

**Content**:
```
Heading: "Invite Members to Join"
Description: "Share your group link with friends and family. You need at least 2 members to start the first cycle."
Primary CTA: "Share Group Link"
Secondary Link: "Copy Invite Link"
```

---

## 3. No Transactions Yet

**When**: User hasn't made any contributions or received payouts

**Illustration**:
- SVG: Empty receipt with clock
- Colors: Gray-300, Blue-500
- Size: 120px × 120px

**Content**:
```
Heading: "No Transactions Yet"
Description: "Your contribution and payout history will appear here once you start participating in groups."
Primary CTA: "Make Your First Contribution"
Secondary Link: "View Active Groups"
```

---

## 4. Search No Results

**When**: Search query returns no matches

**Illustration**:
- SVG: Magnifying glass with X
- Colors: Blue-500, Gray-200
- Size: 100px × 100px

**Content**:
```
Heading: "No Groups Found"
Description: "We couldn't find any groups matching '{search_query}'. Try different keywords or browse all groups."
Primary CTA: "Clear Search"
Secondary Link: "Browse All Groups"
```

---

## 5. Filter No Results

**When**: Applied filters return no matches

**Content**:
```
Heading: "No Groups Match Your Filters"
Description: "Try adjusting your filters to see more results."
Active Filters:
  • Contribution: 100-500 USDC
  • Duration: 7 days
  • Status: Active
Primary CTA: "Clear Filters"
Secondary Link: "Reset to Defaults"
```

---

## 6. No Notifications

**When**: User has no notifications

**Illustration**:
- SVG: Bell with checkmark
- Colors: Green-500, Gray-200
- Size: 100px × 100px

**Content**:
```
Heading: "You're All Caught Up!"
Description: "No new notifications. We'll let you know when there's something important."
```

---

## 7. Wallet Not Connected

**When**: Feature requires wallet connection

**Illustration**:
- SVG: Wallet with disconnected plug
- Colors: Blue-500, Gray-300
- Size: 120px × 120px

**Content**:
```
Heading: "Connect Your Wallet"
Description: "Connect your Stellar wallet to create groups, join groups, and make contributions."
Primary CTA: "Connect Wallet"
Secondary Link: "Learn About Wallets"
```

---

## 8. Coming Soon Feature

**When**: Feature not yet available

**Illustration**:
- SVG: Calendar with clock
- Colors: Blue-500, Green-500
- Size: 120px × 120px

**Content**:
```
Heading: "Coming Soon"
Description: "We're working on this feature. Stay tuned for updates!"
Badge: "In Development"
Secondary Link: "View Roadmap"
```

---

## Empty State Patterns

### Pattern 1: Educational

**Focus**: Explain what the feature does

```
Heading: "What are Savings Groups?"
Description: "Groups allow you to save together with others. Everyone contributes regularly, and members take turns receiving the pool."
CTA: "Create Your First Group"
```

### Pattern 2: Action-Focused

**Focus**: Encourage immediate action

```
Heading: "Start Saving Today"
Description: "Create a group in under 2 minutes."
CTA: "Create Group Now"
```

### Pattern 3: Social Proof

**Focus**: Show what others are doing

```
Heading: "Join 1,000+ Active Groups"
Description: "Thousands of people are already saving together. Start your journey today."
CTA: "Browse Groups"
```

---

## Best Practices

### Content Guidelines

**Heading**:
- Action-oriented
- Clear and concise
- Positive tone
- 3-8 words

**Description**:
- Explain the feature
- Set expectations
- Encourage action
- 1-2 sentences

**CTA**:
- Action verb
- Specific
- Prominent
- Single primary action

### Visual Guidelines

**Illustration**:
- Simple and clean
- Consistent style
- Appropriate size
- Meaningful, not decorative

**Layout**:
- Centered content
- Generous whitespace
- Clear hierarchy
- Mobile-responsive

---

**Version**: 1.0  
**Last Updated**: February 20, 2026
