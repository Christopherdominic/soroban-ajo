# PR Comment — Issue #56: Improve loading, empty, and skeleton states

## Description
Improved the Group Analytics dashboard UX by implementing comprehensive loading, empty, and skeleton states. This provides clear feedback while group analytics data is loading and avoids a broken-feeling UI on slower network or blockchain reads.

## Key Changes
- Added reusable `AnalyticsSkeleton` and `EmptyAnalyticsState` in `frontend/src/components/GroupAnalytics.tsx`.
- Added theme-aware shimmer utility (`.skeleton`) and animation in `frontend/src/styles/themes.css`.
- Added loading and empty handling in `frontend/src/components/GroupDetailPage.tsx`:
  - `GroupDetailSkeleton`
  - `GroupDetailEmptyState`
  - New props: `group`, `members`, `isLoading`, `analyticsLoading`
- Wired analytics tab to pass loading state into `GroupAnalytics`.
- Added accessibility semantics for async UI states (`aria-busy`, `aria-live`).

## Acceptance Criteria
- [x] Display total contributions
- [x] Show member contribution breakdown
- [x] Display payout schedule
- [x] Add performance metrics

## Testing
- Verified edited files have no local diagnostics:
  - `frontend/src/components/GroupAnalytics.tsx`
  - `frontend/src/components/GroupDetailPage.tsx`
  - `frontend/src/styles/themes.css`
- Full frontend build currently fails due to unrelated pre-existing TypeScript errors in other files.

## Notes
This PR focuses on perceived performance and state clarity for analytics/detail views only. Existing repository-wide build issues were not modified as part of this issue scope.
