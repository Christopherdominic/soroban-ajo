#!/bin/bash

echo "🔍 Verifying Monorepo Structure"
echo "================================"
echo ""

# Check root structure
echo "✅ Root directory:"
ls -1 | grep -E "^(backend|frontend|contracts|docs|documentation|package.json|README.md|setup.sh)$" | wc -l
echo "   Expected: 8 items"
echo ""

# Check frontend structure
echo "✅ Frontend structure:"
cd frontend
echo "   Config files:"
ls -1 | grep -E "\.(js|json)$" | wc -l
echo "   Expected: 5 (next.config.js, package.json, package-lock.json, postcss.config.js, tailwind.config.js, tsconfig.json)"
echo ""

echo "   Source folders:"
cd src
ls -1 -d */ | wc -l
echo "   Expected: 8 (app/, components/, hooks/, services/, styles/, tests/, types/, utils/)"
echo ""

cd ../..

# Check backend structure
echo "✅ Backend structure:"
cd backend/src
ls -1 -d */ | wc -l
echo "   Expected: 6 (routes/, controllers/, services/, middleware/, types/, utils/)"
echo ""

cd ../..

# Check for old files
echo "❌ Checking for old Vite files:"
find . -name "vite.config.*" -o -name "vitest.*" 2>/dev/null | wc -l
echo "   Expected: 0"
echo ""

echo "✨ Verification complete!"
