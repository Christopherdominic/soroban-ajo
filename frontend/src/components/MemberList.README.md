# MemberList Component

## Overview
The MemberList component displays all members of an Ajo savings group with their contribution statistics, avatars, and status information. It fetches real data from the Soroban smart contract.

## Features

### ✅ Real Blockchain Data
- Fetches member addresses from contract's `list_members()` function
- Queries contribution history for each member
- Calculates statistics from on-chain data

### ✅ Member Information Displayed
- **Avatar**: Deterministic color-coded avatar generated from wallet address
- **Address**: Shortened Stellar address (e.g., GABC12...MNOP)
- **Join Date**: Estimated from member order and group creation time
- **Contributions**: Number of successful contributions made
- **Total Contributed**: Total XLM amount contributed
- **Cycles Completed**: Number of cycles member has participated in
- **Status**: Active, Inactive, or Completed badge

### ✅ Visual Features
- Color-coded avatars unique to each address
- Creator badge for group founder
- Status badges with color coding
- Responsive table layout
- Loading spinner during data fetch
- Error state handling
- Empty state message

## Usage

```tsx
import { MemberList } from '@/components/MemberList'

function GroupPage() {
  return (
    <div>
      <MemberList groupId="group-123" />
    </div>
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| groupId | string | Yes | The unique identifier of the group |

## Data Flow

```
Contract (Soroban)
  ↓ list_members(group_id)
  ↓ get_group(group_id)
  ↓ get_contribution_status(group_id, cycle)
soroban.ts service
  ↓ getGroupMembers(groupId)
useGroupMembers hook (React Query)
  ↓ { data, isLoading, error }
MemberList component
  ↓ Render table
```

## States

### Loading State
Shows a spinner and "Loading members..." message while fetching data from the blockchain.

### Error State
Displays an error message if the data fetch fails. Users can refresh the page to retry.

### Empty State
Shows "No members found in this group" if the group has no members (unlikely but handled).

### Success State
Displays the full member table with all information.

## Styling

The component uses Tailwind CSS classes for styling:
- `bg-white rounded-lg shadow` - Card container
- `bg-gray-50` - Table header background
- `hover:bg-gray-50` - Row hover effect
- Status badges with color-coded backgrounds

## Avatar Generation

Avatars are generated deterministically from wallet addresses:
1. Hash the address characters
2. Calculate HSL color values from hash
3. Display first 2 characters as initials
4. Same address always produces same color

Example:
- Address: `GABC123...` → Avatar: Blue circle with "GA"
- Address: `GDEF456...` → Avatar: Green circle with "GD"

## Performance

- **Caching**: Member data is cached for 60 seconds
- **React Query**: Automatic background refetching
- **Stable Selectors**: Prevents unnecessary re-renders
- **Parallel Queries**: Member stats calculated in parallel

## Accessibility

- Table structure with proper headers
- Title attributes on avatars showing full address
- Semantic HTML elements
- Color contrast meets WCAG standards

## Future Enhancements

Potential improvements:
1. Click member row to view detailed profile
2. Sort by different columns
3. Filter by status or contribution count
4. Export member list to CSV
5. Add/remove members (creator only)
6. Real-time updates via polling
7. Pagination for large groups
8. Member search functionality

## Related Files

- `frontend/src/services/soroban.ts` - Data fetching logic
- `frontend/src/hooks/useContractData.ts` - React Query hook
- `frontend/src/utils/avatarUtils.ts` - Avatar and formatting utilities
- `frontend/src/types/index.ts` - TypeScript interfaces

## Testing

Run tests:
```bash
npm test -- MemberList
```

Test coverage includes:
- Component rendering
- Loading states
- Error handling
- Avatar generation
- Address formatting

## Example Output

```
Group Members (3)

┌─────────────────────────────────────────────────────────────────────┐
│ Member          │ Joined      │ Contributions │ Total    │ Cycles │
├─────────────────────────────────────────────────────────────────────┤
│ 🔵 GA GABC12... │ Jan 15, 2024│ 3            │ 150 XLM  │ 3      │
│    Creator      │             │              │          │        │
├─────────────────────────────────────────────────────────────────────┤
│ 🟢 GD GDEF45... │ Jan 20, 2024│ 3            │ 150 XLM  │ 3      │
├─────────────────────────────────────────────────────────────────────┤
│ 🟡 GH GHIJ78... │ Jan 25, 2024│ 2            │ 100 XLM  │ 2      │
└─────────────────────────────────────────────────────────────────────┘
```

## Notes

- Join dates are estimated since the contract doesn't store individual timestamps
- The creator is always listed first
- Contribution history requires querying each cycle (can be slow for groups with many cycles)
- Mock data is used in development mode when CONTRACT_ID is not set
