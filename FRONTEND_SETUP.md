# Frontend Setup Guide - Soroban Ajo

Complete step-by-step guide to set up and start developing the Soroban Ajo frontend.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Development Workflow](#development-workflow)
5. [Key Concepts](#key-concepts)
6. [Component Examples](#component-examples)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | 9+ | Package manager |
| Git | 2.0+ | Version control |
| VS Code | Latest | Recommended editor |

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Stellar Wallet

Install [Freighter Wallet](https://www.freighter.app/):
1. Visit Chrome Web Store
2. Search "Freighter Wallet"
3. Click "Add to Chrome"
4. Create or import wallet
5. Switch to **Testnet** network

---

## Installation

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/Christopherdominic/soroban-ajo.git

# Navigate to frontend directory
cd soroban-ajo/frontend
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This installs:
# - React & React DOM
# - TypeScript
# - Vite
# - Tailwind CSS
# - Stellar SDK
# - React Query
# - And more...
```

**Expected output:**
```
added 1234 packages in 45s
```

### Step 3: Verify Installation

```bash
# Check Node version
node --version
# Should show: v18.x.x or higher

# Check npm version
npm --version
# Should show: 9.x.x or higher

# List installed packages
npm list --depth=0
```

---

## Configuration

### Step 1: Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
# Create environment file
touch .env.local
```

Add the following content:

```env
# Soroban RPC Endpoint (Testnet)
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Your deployed contract ID (get from deployment)
VITE_SOROBAN_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Network passphrase
VITE_STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015

# Optional: Analytics
VITE_ENABLE_ANALYTICS=false
```

**Important:** Never commit `.env.local` to Git!

### Step 2: Verify Configuration

```bash
# Start dev server
npm run dev
```

Visit `http://localhost:5173` - you should see the app running.

---

## Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:5173
```

### Making Changes

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make your changes in src/

# 3. Test your changes
npm test

# 4. Check types
npm run type-check

# 5. Lint code
npm run lint

# 6. Commit changes
git add .
git commit -m "feat: add my feature"

# 7. Push to GitHub
git push origin feature/my-feature
```

### Before Submitting PR

```bash
# Run all checks
npm run lint
npm run type-check
npm test
npm run build

# All should pass ✅
```

---

## Key Concepts

### 1. Component Structure

Components follow this pattern:

```typescript
// src/components/MyComponent.tsx
import { useState } from 'react'

interface MyComponentProps {
  title: string
  onAction: () => void
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const [count, setCount] = useState(0)

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Increment
      </button>
    </div>
  )
}
```

### 2. React Query for Data Fetching

```typescript
// src/hooks/queries.ts
import { useQuery } from '@tanstack/react-query'

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      // Fetch from contract
      const response = await fetch('/api/groups')
      return response.json()
    },
    staleTime: 30000, // 30 seconds
  })
}

// Usage in component
const { data: groups, isLoading, error } = useGroups()
```

### 3. Wallet Integration

```typescript
// src/hooks/useWallet.ts
import { useWallet } from '@/hooks/useWallet'

function MyComponent() {
  const { connect, disconnect, address, isConnected } = useWallet()

  return (
    <div>
      {isConnected ? (
        <>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={() => connect({ walletType: 'freighter' })}>
          Connect Wallet
        </button>
      )}
    </div>
  )
}
```

### 4. Contract Interaction

```typescript
// src/services/soroban.ts
import { initializeSoroban } from '@/services/soroban'

const soroban = initializeSoroban()

// Create a group
const groupId = await soroban.createGroup({
  groupName: 'My Savings Group',
  cycleLength: 7,
  contributionAmount: 100,
  maxMembers: 10
})

// Join a group
await soroban.joinGroup(groupId)

// Make contribution
await soroban.contribute(groupId, 100)
```

### 5. State Management

```typescript
// Using React Query for server state
const { data: groups } = useGroups()

// Using useState for local state
const [isOpen, setIsOpen] = useState(false)

// Using context for global state
const { user } = useAuthContext()
```

---

## Component Examples

### Example 1: Simple Button Component

```typescript
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold transition'
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  )
}
```

### Example 2: Group Card Component

```typescript
// src/components/GroupCard.tsx
import { Group } from '@/types'

interface GroupCardProps {
  group: Group
  onJoin: (groupId: string) => void
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onJoin }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-2">{group.name}</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <p>Members: {group.currentMembers}/{group.maxMembers}</p>
        <p>Contribution: ${group.contributionAmount}</p>
        <p>Cycle: {group.cycleLength} days</p>
      </div>
      <button
        onClick={() => onJoin(group.id)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Join Group
      </button>
    </div>
  )
}
```

### Example 3: Form with Validation

```typescript
// src/components/GroupForm.tsx
import { useState } from 'react'
import { useCreateGroup } from '@/hooks/mutations'

export const GroupForm = () => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  
  const createGroup = useCreateGroup()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: string[] = []
    if (!name) newErrors.push('Name is required')
    if (!amount || Number(amount) <= 0) newErrors.push('Valid amount required')
    
    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit
    createGroup.mutate({
      groupName: name,
      contributionAmount: Number(amount),
      cycleLength: 7,
      maxMembers: 10
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {errors.map((error, i) => <p key={i}>{error}</p>)}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">Group Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Contribution Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      
      <button
        type="submit"
        disabled={createGroup.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {createGroup.isPending ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  )
}
```

---

## Troubleshooting

### Issue: Port 5173 already in use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Issue: Module not found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

```bash
# Check TypeScript configuration
npm run type-check

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

### Issue: Wallet not connecting

1. Check Freighter is installed
2. Verify network is set to Testnet
3. Clear browser cache
4. Check console for errors

### Issue: Contract calls failing

1. Verify contract ID in `.env.local`
2. Check RPC endpoint is reachable
3. Ensure wallet has testnet XLM
4. Review contract error messages

### Issue: Build fails

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

---

## Next Steps

### 1. Explore the Codebase

```bash
# Key directories to explore
src/components/    # UI components
src/hooks/         # Custom React hooks
src/services/      # API and contract services
src/types/         # TypeScript types
```

### 2. Pick an Issue

Visit [GitHub Issues](https://github.com/Christopherdominic/soroban-ajo/issues) and pick one:
- **#19-24**: Good First Issues (frontend basics)
- **#25-29**: Medium Issues (features)
- **#30-35**: High Issues (advanced)

### 3. Join the Community

- Comment on issues
- Ask questions
- Share progress

### 4. Read Documentation

- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Stellar SDK Docs](https://developers.stellar.org/docs)

---

## Quick Reference

### Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Lint code
npm run type-check   # Check types
```

### File Locations

```
.env.local           # Environment variables
src/App.tsx          # Root component
src/main.tsx         # Entry point
vite.config.ts       # Vite config
tailwind.config.js   # Tailwind config
```

### Important URLs

- Dev Server: `http://localhost:5173`
- Testnet RPC: `https://soroban-testnet.stellar.org`
- Freighter: `https://www.freighter.app`

---

**You're all set! Start building amazing features for Soroban Ajo! 🚀**
