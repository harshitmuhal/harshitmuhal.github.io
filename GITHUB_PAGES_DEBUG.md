# GitHub Pages Troubleshooting Guide

## Current Issue
The portfolio is not displaying correctly on GitHub Pages - only showing navigation menu without styling.

## Files Added for Debugging

### 1. `.nojekyll` 
- Prevents Jekyll from processing the site
- Required for proper asset loading

### 2. `_config.yml`
- GitHub Pages configuration
- Ensures proper file inclusion

### 3. `test.html`
- Debug page to test file accessibility
- Visit `yourusername.github.io/test.html` to check asset loading

### 4. Updated `index.html`
- Added critical CSS inline for fallback
- Updated asset paths with `./` prefix
- Added CSS loading verification script

## Deployment Steps

1. **Push all files to GitHub repository**
   ```bash
   git add .
   git commit -m "Fix GitHub Pages deployment with debug files"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to Pages section
   - Select source branch (usually `main`)
   - Save settings

3. **Wait for deployment** (2-10 minutes)

4. **Test the debug page first**
   - Visit: `https://yourusername.github.io/test.html`
   - Check if CSS and JS files are accessible

5. **Check main portfolio**
   - Visit: `https://yourusername.github.io/`

## Common Issues & Solutions

### CSS Not Loading
- **Cause**: Case-sensitive file paths
- **Solution**: Ensure all paths use lowercase and relative paths (`./assets/`)

### JavaScript Errors
- **Cause**: External CDN blocking or path issues
- **Solution**: Check browser console for errors

### Blank Page
- **Cause**: Jekyll processing interfering
- **Solution**: `.nojekyll` file added to prevent this

### 404 Errors
- **Cause**: Incorrect repository name or branch
- **Solution**: Verify GitHub Pages settings point to correct branch

## Browser Developer Tools
Press F12 and check:
1. **Console tab** - JavaScript errors
2. **Network tab** - Failed resource loading
3. **Sources tab** - Verify files are loaded

## Success Indicators
✅ `test.html` loads with green checkmarks
✅ Browser console shows "AOS initialized successfully"
✅ No 404 errors in Network tab
✅ Portfolio displays with full styling and animations