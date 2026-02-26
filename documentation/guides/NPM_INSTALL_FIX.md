# NPM Install Fix

## Issue
Running `npm install` in the frontend folder was failing with:
```
npm error command failed
npm error command sh -c husky install
```

## Root Cause
The root `package.json` has a `"prepare"` script that runs `husky install`, but Husky wasn't installed yet. This created a chicken-and-egg problem where:
1. npm tries to run the prepare script
2. The prepare script needs husky
3. But husky isn't installed yet because npm install hasn't completed

## Solution

### Step 1: Install root dependencies without running scripts
```bash
npm install --ignore-scripts
```

This installs all dependencies (including husky) without running the prepare script.

### Step 2: Manually initialize Husky
```bash
npx husky install
```

This sets up the Git hooks that Husky manages.

### Step 3: Install frontend dependencies
```bash
cd frontend
npm install
```

Now this works because:
- Husky is already installed at the root
- The prepare script can run successfully
- This is a monorepo with workspaces, so dependencies are hoisted to the root

## Verification

After the fix, you should see:
```bash
npm list react react-dom next --depth=0
# Shows:
# drips-monorepo@0.1.0
# └─┬ drips-frontend@0.1.0 -> ./frontend
#   ├── next@14.2.35
#   ├── react-dom@18.3.1
#   └── react@18.3.1
```

## Monorepo Structure

This project uses npm workspaces:
- Dependencies are hoisted to the root `node_modules`
- Frontend and backend are workspace packages
- No separate `node_modules` in frontend/backend folders

## Future Installs

For fresh installs, use the root-level script:
```bash
npm run install:all
```

This handles the installation order correctly.

## Status
✅ **RESOLVED** - npm install now works correctly in both root and frontend directories.
