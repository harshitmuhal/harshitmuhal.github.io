# GitHub Pages Troubleshooting Guide

## Scope
Use this guide to diagnose portfolio asset loading and the `/notes/` workspace. The navigation-without-styling issue below is historical context, not a statement that the deployed site is currently broken.

## Files Added for Debugging

### 1. `.nojekyll` 
- Prevents Jekyll from processing the site
- Keeps the repository's static files available without Jekyll processing

### 2. `_config.yml`
- Legacy Jekyll configuration; `.nojekyll` bypasses Jekyll when serving this static site

### 3. `test.html`
- Debug page to test file accessibility
- Visit `yourusername.github.io/test.html` to check asset loading
- For this repository: `https://harshitmuhal.github.io/test.html`

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

## Notes Troubleshooting

The route is `https://harshitmuhal.github.io/notes/`, with local testing at `http://localhost:8000/notes/`. Start an HTTP server from the repository root; do not open `notes/index.html` as a `file://` URL. Setup instructions are in [notes/SETUP.md](notes/SETUP.md).

### Notes Page Is Missing or the Editor Does Not Load

- Confirm `notes/index.html` and its `.js` and `.css` files were published from the same branch and root directory.
- Check the Network and Console tabs for failures loading the Supabase SDK or Quill from jsDelivr. Notes need an internet connection for these libraries and for cloud sync.
- Check that JavaScript modules are served as JavaScript, not a 404 HTML page or plain text.
- If the page looks like an earlier layout, reload or clear cached site assets. Do not delete browser authentication data or an unsaved draft unnecessarily.

### Sign-in Errors or an Unexpected Account

- **Cloud sync is not configured yet**: Fill in the public project URL and publishable/anon key in `notes/config.js`.
- **Email link cannot be sent**: Check the Email provider, rate limits, and SMTP configuration. Supabase's default mail delivery has restrictions.
- **Google provider is not enabled**: Enable Google under Supabase Authentication > Sign In / Providers and enter its OAuth credentials there.
- **Redirect mismatch**: Google's authorized redirect URI is the **Supabase callback URL**. Supabase's allowed app redirects are the production/local `/notes/` URLs. Google JavaScript origins omit `/notes/`.
- **Want another Google account**: Sign out of the notes page, then use Continue with Google. The request includes `prompt: select_account`; it does not require typing an email or re-entering a Google password.
- **Google shows a Supabase domain instead of a friendly name**: Configure Google Auth Platform branding; brand verification may be required. Replacing the callback domain itself requires a Supabase custom domain. Renaming the Supabase project alone does not change it.

### Notes Do Not Save, or Another Device Looks Outdated

- Make sure `notes_vaults` exists and its row-level policies allow authenticated users to read, insert, and update **their own** row. Never disable those policies to fix an error.
- Wait for **Synced to cloud** in the workspace header before closing the page. Drafts after a failed save exist in memory only: keep the tab open and retry, or copy unsaved text somewhere safe.
- Cloud refresh happens on return to the tab and periodically while visible and not editing; it is not real-time collaboration.
- On a conflict, copy unsaved note text somewhere safe before choosing **Reload cloud copy**. The revision check deliberately blocks a stale device from overwriting newer edits.
- Different Supabase accounts have separate vaults. An empty vault on another account is not proof that your notes were deleted.

### Folder Selection and Formatting

- **Folder** moves the current note. Its destination becomes the active folder, counts update, and the breadcrumb shows the note's actual folder even when browsing All notes.
- **Text / Heading 1 / Heading 2 / Heading 3** formats content inside the editor; it does not change the note's folder or title.
- The file title and content heading sizes are intentionally different. Inline checklist boxes toggle completion and strikethrough in the same note.

### Mobile Focus Zoom or a Missing Sidebar

- Current mobile/touch inputs, selects, and the editable note body use at least 16px text to avoid the small-font focus-zoom trigger. This includes the login email, search, and new-folder dialog.
- If focusing still shows the old zoom behavior, check the loaded stylesheet and reload the latest deployment. Pinch-to-zoom is intentionally not disabled.
- On mobile the explorer is a drawer and closes when you select a note. Reopen it with the sidebar or search icon in the rail. Its chosen open/closed state is preserved across layout changes.
- Test on a physical phone as well as browser emulation; an emulated viewport does not reproduce every OS keyboard or browser zoom behavior.

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
✅ `/notes/` loads the single editor and supports email/Google sign-in
✅ A folder move and a checked list item persist after reload with the same account
✅ Light/dark switching works, and mobile focus does not pan the icon rail out of view