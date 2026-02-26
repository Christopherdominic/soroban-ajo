# Profile Management System Implementation

## Overview

This implementation provides a complete profile management system for the Soroban Ajo application using a decentralized approach suitable for blockchain applications.

## Architecture

Since this is a blockchain-based application without a traditional backend, the profile system uses:

- **Local Storage**: For profile data persistence across sessions
- **Wallet Address**: As the primary authentication mechanism
- **IPFS (Simulated)**: For profile image storage (ready for production IPFS integration)

## Files Created

### 1. Core Hook: `frontend/src/hooks/useProfile.ts`
Main React hook for profile management with the following features:
- Profile loading and creation
- Profile updates
- Preferences management
- Activity tracking
- Profile image upload
- Stats management

**Key Functions:**
- `loadProfile(address)` - Load or create user profile
- `updateProfile(updates)` - Update profile data
- `updatePreferences(preferences)` - Update user preferences
- `uploadProfileImage(file)` - Upload profile avatar
- `addActivity(activity)` - Track user activities
- `updateStats(stats)` - Update user statistics

### 2. Service Layer: `frontend/src/services/profileService.ts`
API-like service for profile operations:
- `getProfile(address)` - GET /api/profile/:address equivalent
- `updateProfile(address, updates)` - PATCH /api/profile/:address equivalent
- `getActivities(address)` - GET /api/profile/:address/activities equivalent
- `updatePreferences(address, preferences)` - PATCH /api/profile/:address/preferences equivalent
- `uploadProfileImage(file)` - Image upload handler
- `createProfile(address)` - Create new profile
- `deleteProfile(address)` - Delete profile (for testing)

### 3. Authentication: `frontend/src/utils/auth.ts`
Wallet-based authentication system:
- Session management
- Wallet verification
- Authentication middleware
- `useAuthSession()` hook for React components

**Key Functions:**
- `createSession(address, network)` - Create auth session
- `getSession()` - Get current session
- `clearSession()` - Logout
- `isAuthenticated()` - Check auth status
- `requireAuth()` - Middleware for protected operations

### 4. Test Suite

#### `frontend/src/tests/profileService.test.ts`
Comprehensive tests for ProfileService:
- Profile CRUD operations
- Activity management
- Preferences updates
- Image upload validation
- Error handling
- Edge cases

#### `frontend/src/tests/useProfile.test.ts`
Tests for useProfile hook:
- Hook initialization
- Profile loading
- Updates and mutations
- Activity tracking
- Stats management
- Error scenarios
- Persistence across instances

#### `frontend/src/tests/auth.test.ts`
Tests for authentication:
- Session management
- Authentication checks
- Wallet verification
- Error handling
- Session validation

## Data Models

### UserProfile
```typescript
interface UserProfile {
  address: string
  displayName?: string
  bio?: string
  avatar?: string
  email?: string
  joinedDate: string
  preferences: UserPreferences
  stats: UserStats
}
```

### UserPreferences
```typescript
interface UserPreferences {
  notifications: boolean
  emailUpdates: boolean
  theme: 'light' | 'dark' | 'auto'
  language: string
  currency: string
}
```

### UserStats
```typescript
interface UserStats {
  totalGroups: number
  activeGroups: number
  completedGroups: number
  totalContributions: number
  totalReceived: number
}
```

### Activity
```typescript
interface Activity {
  id: string
  type: 'contribution' | 'payout' | 'group_created' | 'group_joined'
  groupId: string
  groupName?: string
  amount?: number
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}
```

## Usage Examples

### Basic Profile Management

```typescript
import { useProfile } from './hooks/useProfile'

function ProfileComponent() {
  const { profile, loading, updateProfile } = useProfile(userAddress)

  const handleUpdate = async () => {
    await updateProfile({
      displayName: 'John Doe',
      bio: 'Crypto enthusiast'
    })
  }

  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{profile?.displayName || 'Anonymous'}</h1>
      <p>{profile?.bio}</p>
    </div>
  )
}
```

### Activity Tracking

```typescript
const { addActivity } = useProfile(userAddress)

// Track a contribution
addActivity({
  type: 'contribution',
  groupId: 'group-123',
  groupName: 'Savings Group',
  amount: 100,
  status: 'completed'
})
```

### Authentication

```typescript
import { useAuthSession } from './utils/auth'

function App() {
  const { isAuthenticated, address, login, logout } = useAuthSession()

  const handleConnect = async (walletAddress: string) => {
    login(walletAddress, 'testnet')
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={logout}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => handleConnect('G...')}>Connect Wallet</button>
      )}
    </div>
  )
}
```

### Profile Image Upload

```typescript
const { uploadProfileImage } = useProfile(userAddress)

const handleImageUpload = async (file: File) => {
  try {
    const imageUrl = await uploadProfileImage(file)
    console.log('Image uploaded:', imageUrl)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

## Storage Structure

### LocalStorage Keys
- `soroban_ajo_profile_{address}` - User profile data
- `soroban_ajo_activities_{address}` - User activities (last 100)
- `soroban_ajo_preferences_{address}` - User preferences
- `soroban_ajo_auth_session` - Authentication session

## Features Implemented

✅ **Profile Data Persistence**: All profile data persists across sessions using localStorage
✅ **Profile Updates**: Full CRUD operations for profile management
✅ **Activity History**: Tracks and stores user activities (contributions, payouts, etc.)
✅ **Preferences**: User preferences with theme, notifications, language, currency
✅ **Profile Images**: Image upload with validation (ready for IPFS integration)
✅ **Authentication**: Wallet-based authentication with session management
✅ **Error Handling**: Comprehensive error handling throughout
✅ **Type Safety**: Full TypeScript support with proper interfaces
✅ **Testing**: Complete test coverage for all components

## Acceptance Criteria Status

✅ Profile data persists across sessions
✅ Profile updates save to backend (localStorage)
✅ Activity history tracked
✅ Preferences saved
✅ Profile images supported
✅ Authentication required (wallet-based)

## Running Tests

```bash
cd frontend
npm install
npm test
```

For coverage report:
```bash
npm run test:coverage
```

## Production Considerations

### IPFS Integration
To integrate with actual IPFS for image storage:

1. Install IPFS client:
```bash
npm install ipfs-http-client
```

2. Update `uploadToIPFS` function in `useProfile.ts`:
```typescript
import { create } from 'ipfs-http-client'

const client = create({ url: 'https://ipfs.infura.io:5001' })

const uploadToIPFS = async (file: File): Promise<string> => {
  const added = await client.add(file)
  return `ipfs://${added.path}`
}
```

### Backend API Integration
If adding a traditional backend:

1. Update `ProfileService` methods to make HTTP requests:
```typescript
static async getProfile(address: string): Promise<UserProfile | null> {
  const response = await fetch(`/api/profile/${address}`)
  return response.json()
}
```

2. Add authentication headers:
```typescript
const headers = {
  'Authorization': `Bearer ${AuthService.getSession()?.token}`,
  'Content-Type': 'application/json'
}
```

### Database Schema
If using a database, recommended schema:

```sql
CREATE TABLE profiles (
  address VARCHAR(56) PRIMARY KEY,
  display_name VARCHAR(255),
  bio TEXT,
  avatar TEXT,
  email VARCHAR(255),
  joined_date TIMESTAMP,
  preferences JSONB,
  stats JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activities (
  id UUID PRIMARY KEY,
  address VARCHAR(56) REFERENCES profiles(address),
  type VARCHAR(50),
  group_id VARCHAR(255),
  group_name VARCHAR(255),
  amount DECIMAL(20, 7),
  timestamp TIMESTAMP,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_address ON activities(address);
CREATE INDEX idx_activities_timestamp ON activities(timestamp DESC);
```

## Security Considerations

1. **Wallet Verification**: In production, implement proper signature verification
2. **Data Validation**: All inputs are validated before storage
3. **XSS Protection**: Profile data is sanitized before display
4. **Rate Limiting**: Consider adding rate limits for profile updates
5. **Image Validation**: File type and size validation for uploads

## CI/CD Integration

The implementation includes:
- TypeScript type checking
- Comprehensive test suite
- No external dependencies required for basic functionality
- Ready for CI/CD pipeline integration

### GitHub Actions Example
```yaml
name: Profile Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm install
      - run: cd frontend && npm test
      - run: cd frontend && npm run type-check
```

## Migration Path

To migrate existing users:
1. Profile is auto-created on first access
2. Default preferences are set
3. Stats start at zero
4. Activities can be imported from blockchain events

## Support

For issues or questions:
- Check test files for usage examples
- Review type definitions in `useProfile.ts`
- See `ProfileService` for API equivalents

## License

MIT License - Same as parent project
