# User Profile and Settings Feature

## Overview
Complete user profile and settings management system for the Soroban Ajo application.

## Status
✅ **IMPLEMENTED**

## Features

### 1. Profile Page (`/profile`)
- **Overview Section**: Display user information, stats, and connected wallet
- **Edit Profile**: Update display name, email, and bio
- **Settings**: Manage notifications, privacy, and display preferences
- **Activity History**: View recent transactions and group activities

### 2. Components Created

#### ProfileCard (`ProfileCard.tsx`)
- Displays user avatar (generated from initials or custom image)
- Shows display name, wallet address, and bio
- Presents key statistics (total groups, contributions, success rate)
- Includes loading skeleton state

#### ProfileForm (`ProfileForm.tsx`)
- Edit display name, email, and bio
- Form validation and character limits
- Save/reset functionality
- Loading and error states

#### SettingsPanel (`SettingsPanel.tsx`)
- **Notifications Tab**: Email, push, group updates, payout/contribution reminders
- **Privacy Tab**: Profile visibility, activity display, stats sharing
- **Display Tab**: Theme (light/dark/auto), language, currency preferences
- Tabbed interface with toggle switches and select dropdowns

### 3. Custom Hook

#### useProfile (`useProfile.ts`)
- Fetches and manages user profile data
- Handles profile updates and preference changes
- Integrates with authentication system
- Provides activity history
- Mock data implementation (ready for API integration)

### 4. Type Definitions

#### Profile Types (`types/profile.ts`)
```typescript
- UserProfile: Complete user profile structure
- UserPreferences: Notification, privacy, and display settings
- UserStats: User statistics and metrics
- ActivityItem: Activity history entries
```

## Navigation Integration
- Added "Profile" link to main navigation in `DashboardLayout`
- Accessible from any page when authenticated
- Back button to return to dashboard

## Authentication Integration
- Requires authentication to access
- Redirects to home if not logged in
- Displays connected wallet information
- Logout functionality

## Styling
- Consistent with existing design system
- Tailwind CSS for styling
- Responsive layout (mobile, tablet, desktop)
- Loading skeletons for better UX
- Smooth transitions and hover effects

## Future Enhancements
- [ ] Avatar upload functionality
- [ ] Connect to backend API endpoints
- [ ] Real-time activity updates
- [ ] Export profile data
- [ ] Two-factor authentication settings
- [ ] Social profile links
- [ ] Achievement badges
- [ ] Referral system

## API Integration Points

### Endpoints to Implement
```
GET    /api/profile/:address          - Fetch user profile
PATCH  /api/profile/:address          - Update profile
PATCH  /api/profile/:address/preferences - Update preferences
GET    /api/profile/:address/activities  - Fetch activity history
POST   /api/profile/:address/avatar   - Upload avatar
```

## Testing Checklist
- [ ] Profile page loads correctly
- [ ] Edit profile form validation works
- [ ] Settings save successfully
- [ ] Activity history displays properly
- [ ] Responsive design on all devices
- [ ] Loading states appear correctly
- [ ] Error handling works as expected
- [ ] Navigation integration functions properly

## Files Created
1. `frontend/src/app/profile/page.tsx` - Main profile page
2. `frontend/src/components/ProfileCard.tsx` - Profile display component
3. `frontend/src/components/ProfileForm.tsx` - Profile editing form
4. `frontend/src/components/SettingsPanel.tsx` - Settings management
5. `frontend/src/hooks/useProfile.ts` - Profile data hook
6. `frontend/src/types/profile.ts` - Type definitions

## Files Modified
1. `frontend/src/components/DashboardLayout.tsx` - Added profile navigation link
2. `frontend/src/types/index.ts` - Re-exported profile types

## Usage Example

```typescript
import { useProfile } from '@/hooks/useProfile'

function MyComponent() {
  const { profile, updateProfile, savePreferences } = useProfile()
  
  // Update profile
  await updateProfile({ displayName: 'New Name' })
  
  // Save preferences
  await savePreferences({ 
    notifications: { email: true } 
  })
}
```

## Accessibility
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where appropriate
- Focus management
- Screen reader friendly

## Performance
- Lazy loading of activity history
- Optimistic UI updates
- Efficient re-renders with React hooks
- Skeleton loading states

## Security Considerations
- Profile data tied to authenticated wallet address
- Privacy settings respected throughout app
- Secure preference storage
- Input validation and sanitization
