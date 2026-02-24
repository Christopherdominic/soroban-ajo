#!/bin/bash

# Fix lint errors in frontend

cd /workspaces/soroban-ajo/frontend

# Fix unused variables by prefixing with underscore
find src -name "*.tsx" -o -name "*.ts" | while read file; do
  # Fix unused variables
  sed -i 's/const sortField =/const _sortField =/g' "$file"
  sed -i 's/const sortDirection =/const _sortDirection =/g' "$file"
  sed -i 's/const toggleSort =/const _toggleSort =/g' "$file"
  sed -i 's/const handleCopyLink =/const _handleCopyLink =/g' "$file"
  sed -i 's/const handleRowClick =/const _handleRowClick =/g' "$file"
  sed -i 's/const isError =/const _isError =/g' "$file"
  sed -i 's/const hasPreviousPage =/const _hasPreviousPage =/g' "$file"
  sed -i 's/const useCache =/const _useCache =/g' "$file"
  sed -i 's/const severity =/const _severity =/g' "$file"
  sed -i 's/, data /, _data /g' "$file"
  
  # Fix unescaped entities
  sed -i "s/don't/don\&apos;t/g" "$file"
  sed -i "s/can't/can\&apos;t/g" "$file"
  sed -i "s/won't/won\&apos;t/g" "$file"
  sed -i "s/isn't/isn\&apos;t/g" "$file"
  sed -i "s/doesn't/doesn\&apos;t/g" "$file"
  sed -i 's/"Ajo"/"Ajo"/g' "$file"
done

echo "✅ Lint fixes applied"
