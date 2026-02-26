# Profile Feature Architecture

## Component Hierarchy

```
ProfilePage (/profile)
│
├── Header
│   ├── Back Button → Dashboard
│   ├── Title & Description
│   └── Logout Button
│
├── Sidebar Navigation
│   ├── Overview Tab
│   ├── Edit Profile Tab
│   ├── Settings Tab
│   ├── Activity Tab
│   └── Wallet Info Card
│       ├── Connection Status
│       └── Wallet Address
│
└── Main Content Area
    │
    ├── [Overview Section]
    │   ├── ProfileCard
    │   │   ├── Avatar (Initials/Image)
    │   │   ├── Display Name
    │   │   ├── Wallet Address
    │   │   ├── Bio
    │   │   ├── Join Date
    │   │   └── Stats Grid
    │   │       ├── Total Groups
    │   │       ├── Contributions
    │   │       └── Success Rate
    │   │
    │   └── Quick Stats Cards
    │       ├── Active Groups Card
    │       ├── Completed Groups Card
    │       └── Total Payouts Card
    │
    ├── [Edit Profile Section]
    │   └── ProfileForm
    │       ├── Display Name Input
    │       ├── Email Input
    │       ├── Bio Textarea
    │       └── Action Buttons
    │           ├── Save Changes
    │           └── Reset
    │
    ├── [Settings Section]
    │   └── SettingsPanel
    │       ├── Tab Navigation
    │       │   ├── Notifications Tab
    │       │   ├── Privacy Tab
    │       │   └── Display Tab
    │       │
    │       ├── [Notifications Content]
    │       │   ├── Email Toggle
    │       │   ├── Push Toggle
    │       │   ├── Group Updates Toggle
    │       │   ├── Payout Reminders Toggle
    │       │   └── Contribution Reminders Toggle
    │       │
    │       ├── [Privacy Content]
    │       │   ├── Show Profile Toggle
    │       │   ├── Show Activity Toggle
    │       │   └── Show Stats Toggle
    │       │
    │       ├── [Display Content]
    │       │   ├── Theme Select
    │       │   ├── Language Select
    │       │   └── Currency Select
    │       │
    │       └── Save Button (conditional)
    │
    └── [Activity Section]
        └── ActivityHistory
            ├── Activity Items List
            │   └── ActivityItem (repeated)
            │       ├── Icon
            │       ├── Group Name
            │       ├── Amount
            │       ├── Timestamp
            │       └── Status Badge
            │
            └── Empty State (if no activities)
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        ProfilePage                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    useProfile Hook                     │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           useProfileStore (Zustand)              │ │ │
│  │  │                                                   │ │ │
│  │  │  State:                                          │ │ │
│  │  │  - profile: UserProfile | null                  │ │ │
│  │  │  - isLoading: boolean                           │ │ │
│  │  │  - error: string | null                         │ │ │
│  │  │                                                   │ │ │
│  │  │  Actions:                                        │ │ │
│  │  │  - setProfile()                                  │ │ │
│  │  │  - updatePreferences()                           │ │ │
│  │  │  - clearProfile()                                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                         │ │
│  │  Methods:                                              │ │
│  │  - fetchProfile()        → GET /api/profile/:address  │ │
│  │  - updateProfile()       → PATCH /api/profile/:address│ │
│  │  - savePreferences()     → PATCH /api/.../preferences │ │
│  │  - fetchActivities()     → GET /api/.../activities    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                     useAuth Hook                       │ │
│  │                                                         │ │
│  │  - isAuthenticated                                     │ │
│  │  - address                                             │ │
│  │  - logout()                                            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │         Child Components            │
        │                                     │
        │  - ProfileCard                      │
        │  - ProfileForm                      │
        │  - SettingsPanel                    │
        │  - ActivityHistory                  │
        └─────────────────────────────────────┘
```

## State Management

### Profile Store (Zustand)
```typescript
interface ProfileStore {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  setProfile: (profile: UserProfile) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  clearProfile: () => void
}
```

### Component State
```typescript
// ProfilePage
const [activeSection, setActiveSection] = useState<'overview' | 'edit' | 'settings' | 'activity'>('overview')

// ProfileForm
const [formData, setFormData] = useState({ displayName, email, bio })
const [isSaving, setIsSaving] = useState(false)

// SettingsPanel
const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'display'>('notifications')
const [localPreferences, setLocalPreferences] = useState(preferences)
const [isSaving, setIsSaving] = useState(false)
```

## Type System

```typescript
// Core Types
UserProfile
├── address: string
├── displayName?: string
├── email?: string
├── avatar?: string
├── bio?: string
├── joinedAt: string
├── preferences: UserPreferences
└── stats: UserStats

UserPreferences
├── notifications
│   ├── email: boolean
│   ├── push: boolean
│   ├── groupUpdates: boolean
│   ├── payoutReminders: boolean
│   └── contributionReminders: boolean
├── privacy
│   ├── showProfile: boolean
│   ├── showActivity: boolean
│   └── showStats: boolean
└── display
    ├── theme: 'light' | 'dark' | 'auto'
    ├── language: string
    └── currency: string

UserStats
├── totalGroups: number
├── activeGroups: number
├── completedGroups: number
├── totalContributions: number
├── totalPayouts: number
└── successRate: number

ActivityItem
├── id: string
├── type: 'contribution' | 'payout' | 'group_joined' | 'group_created'
├── groupName: string
├── amount?: number
├── timestamp: string
└── status: 'completed' | 'pending' | 'failed'
```

## API Integration Points

```
┌──────────────────────────────────────────────────────────┐
│                    Backend API                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  GET    /api/profile/:address                           │
│  └─→ Returns: UserProfile                               │
│                                                          │
│  PATCH  /api/profile/:address                           │
│  └─→ Body: Partial<UserProfile>                         │
│  └─→ Returns: UserProfile                               │
│                                                          │
│  PATCH  /api/profile/:address/preferences               │
│  └─→ Body: Partial<UserPreferences>                     │
│  └─→ Returns: UserProfile                               │
│                                                          │
│  GET    /api/profile/:address/activities                │
│  └─→ Returns: ActivityItem[]                            │
│                                                          │
│  POST   /api/profile/:address/avatar                    │
│  └─→ Body: FormData (image file)                        │
│  └─→ Returns: { avatarUrl: string }                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Routing

```
/profile
├── Overview (default)
├── Edit Profile
├── Settings
│   ├── Notifications
│   ├── Privacy
│   └── Display
└── Activity
```

## Authentication Flow

```
User navigates to /profile
        │
        ▼
    useAuth hook
        │
        ├─→ isAuthenticated = false
        │   └─→ Redirect to /
        │
        └─→ isAuthenticated = true
            └─→ Load ProfilePage
                └─→ useProfile hook
                    └─→ Fetch profile data
                        └─→ Render components
```

## Loading States

```
Initial Load
├── Skeleton for ProfileCard
├── Skeleton for Stats Cards
└── Skeleton for Activity Items

Form Submission
├── Disable form inputs
├── Show spinner on button
└── Display toast on completion

Settings Save
├── Disable toggles/selects
├── Show spinner on save button
└── Display toast on completion
```

## Error Handling

```
API Error
├── Catch in useProfile hook
├── Set error state
├── Display toast notification
└── Log to console

Form Validation Error
├── Validate on submit
├── Show inline error messages
└── Prevent submission

Network Error
├── Retry logic (optional)
├── Display user-friendly message
└── Provide retry action
```

## Performance Optimizations

1. **Lazy Loading**: Activity history loaded on demand
2. **Memoization**: React.memo for child components
3. **Debouncing**: Form inputs debounced
4. **Optimistic Updates**: UI updates before API confirmation
5. **Skeleton Loading**: Perceived performance improvement

## Security Measures

1. **Authentication**: Required for all profile operations
2. **Authorization**: Profile tied to wallet address
3. **Input Validation**: Client-side and server-side
4. **XSS Prevention**: Sanitize user inputs
5. **CSRF Protection**: Token-based protection (backend)

## Accessibility Features

1. **Semantic HTML**: Proper heading hierarchy
2. **ARIA Labels**: Screen reader support
3. **Keyboard Navigation**: Full keyboard support
4. **Focus Management**: Logical tab order
5. **Color Contrast**: WCAG AA compliant

## Responsive Design

```
Mobile (< 768px)
├── Sidebar becomes dropdown
├── Single column layout
├── Stacked stat cards
└── Touch-optimized buttons

Tablet (768px - 1024px)
├── Sidebar visible
├── Two-column layout
└── Responsive stat cards

Desktop (> 1024px)
├── Full sidebar
├── Multi-column layout
└── Optimal spacing
```

---

This architecture provides a scalable, maintainable, and user-friendly profile management system.
