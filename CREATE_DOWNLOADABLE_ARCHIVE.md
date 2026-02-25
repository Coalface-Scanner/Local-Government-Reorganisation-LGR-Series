# Create Downloadable Archive

## Quick Method

Run this command in your terminal from the project root:

```bash
./create-archive.sh
```

This will create a file named `LGR-Series-Complete-YYYYMMDD.tar.gz` containing all your project files (excluding node_modules, .git, dist, and .env).

## Manual Method

If the script doesn't work, you can create the archive manually:

### Using tar (macOS/Linux):
```bash
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='.env' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    -czf LGR-Series-Complete.tar.gz .
```

### Using zip (macOS/Linux/Windows):
```bash
zip -r LGR-Series-Complete.zip . \
    -x "node_modules/*" \
    -x ".git/*" \
    -x "dist/*" \
    -x ".env" \
    -x "*.log" \
    -x ".DS_Store"
```

## What's Included

✅ All source code (`src/`)  
✅ Configuration files (`package.json`, `vite.config.ts`, `tailwind.config.js`, etc.)  
✅ Documentation files (`.md` files)  
✅ Public assets (`public/`)  
✅ SQL migrations (`supabase/migrations/`)  
✅ Scripts (`scripts/`)  
✅ Content templates (`content-to-upload/`)  

## What's Excluded

❌ `node_modules/` (can be reinstalled with `npm install`)  
❌ `.git/` (version control history)  
❌ `dist/` (build output - can be regenerated)  
❌ `.env` (sensitive environment variables)  
❌ `*.log` (log files)  
❌ `.DS_Store` (macOS system files)  

## After Creating the Archive

1. **Verify the archive**:
   ```bash
   tar -tzf LGR-Series-Complete.tar.gz | head -20
   ```

2. **Extract to test** (optional):
   ```bash
   mkdir test-extract
   cd test-extract
   tar -xzf ../LGR-Series-Complete.tar.gz
   ```

3. **Share or backup** the `.tar.gz` or `.zip` file as needed.

## File Size

The archive should be approximately **5-15 MB** (depending on content), much smaller than the full project with node_modules.

## Notes

- The `.env` file is excluded for security - make sure to back it up separately if needed
- You'll need to run `npm install` after extracting to restore dependencies
- The archive preserves all file permissions and structure


