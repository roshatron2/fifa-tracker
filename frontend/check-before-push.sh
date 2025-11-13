#!/bin/bash

# FIFA Tracker - Pre-push validation script
echo "🚀 FIFA Tracker - Pre-push Validation"
echo "======================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📝 You have uncommitted changes. Please commit or stash them first."
    exit 1
fi

echo "🔍 Running comprehensive checks..."

# Run the pre-push script
npm run pre-push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All checks passed! Your code is ready to push."
    echo "🚀 You can now safely run: git push"
else
    echo ""
    echo "❌ Checks failed. Please fix the issues above before pushing."
    exit 1
fi
