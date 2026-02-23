#!/bin/bash

echo "=== Testing Brand Patterns Implementation ==="
echo ""

# Check if pattern files exist
echo "✓ Checking SVG pattern files..."
for file in grid.svg dots.svg waves.svg mesh.svg; do
  if [ -f "public/patterns/$file" ]; then
    echo "  ✓ $file exists"
  else
    echo "  ✗ $file missing"
    exit 1
  fi
done

# Check CSS file for pattern classes
echo ""
echo "✓ Checking CSS pattern classes..."
for class in pattern-grid pattern-dots pattern-waves pattern-mesh gradient-stellar gradient-mesh; do
  if grep -q "\.$class" src/styles/globals.css; then
    echo "  ✓ .$class defined"
  else
    echo "  ✗ .$class missing"
    exit 1
  fi
done

# Check Tailwind config
echo ""
echo "✓ Checking Tailwind config..."
if grep -q "pattern-grid" tailwind.config.js; then
  echo "  ✓ Pattern utilities added to Tailwind"
else
  echo "  ✗ Pattern utilities missing from Tailwind"
  exit 1
fi

# Check layout integration
echo ""
echo "✓ Checking layout integration..."
if grep -q "pattern-overlay" src/app/layout.tsx; then
  echo "  ✓ Pattern overlay applied to layout"
else
  echo "  ✗ Pattern overlay missing from layout"
  exit 1
fi

# Validate SVG syntax (basic check)
echo ""
echo "✓ Validating SVG files..."
for file in public/patterns/*.svg; do
  if grep -q "<svg" "$file" && grep -q "</svg>" "$file"; then
    echo "  ✓ $(basename $file) has valid SVG structure"
  else
    echo "  ✗ $(basename $file) has invalid SVG structure"
    exit 1
  fi
done

echo ""
echo "=== All checks passed! ==="
echo ""
echo "Note: To run full CI tests, upgrade Node.js to >= 18.0.0"
echo "Current version: $(node --version)"
echo "Required version: >= 18.0.0"
