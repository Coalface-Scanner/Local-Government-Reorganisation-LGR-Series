#!/bin/bash

# Script to create a downloadable archive of the LGR Series project
# Excludes node_modules, .git, dist, and sensitive files

PROJECT_NAME="LGR-Series-Complete"
DATE=$(date +%Y%m%d)
ARCHIVE_NAME="${PROJECT_NAME}-${DATE}.tar.gz"

echo "📦 Creating archive: ${ARCHIVE_NAME}..."
echo ""

# Create archive excluding unnecessary files
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='.env' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='*.swp' \
    --exclude='*.swo' \
    --exclude='.vscode' \
    --exclude='.idea' \
    -czf "${ARCHIVE_NAME}" .

if [ $? -eq 0 ]; then
    FILE_SIZE=$(du -h "${ARCHIVE_NAME}" | cut -f1)
    echo "✅ Archive created successfully!"
    echo "📁 File: ${ARCHIVE_NAME}"
    echo "📊 Size: ${FILE_SIZE}"
    echo ""
    echo "📍 Location: $(pwd)/${ARCHIVE_NAME}"
else
    echo "❌ Error creating archive"
    exit 1
fi


