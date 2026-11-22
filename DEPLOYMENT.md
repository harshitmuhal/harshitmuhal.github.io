# Deployment Guide for GitHub Pages

This guide covers the portfolio and the `/notes/` workspace on GitHub Pages. Both are static pages; Supabase handles notes authentication and private data storage separately. See [notes/SETUP.md](notes/SETUP.md) for the backend setup.

## Prerequisites

1. GitHub account
2. Git installed on your computer
3. Your portfolio files ready
4. A configured Supabase project if you want notes sign-in and cloud sync

## Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. **Important**: Name your repository `username.github.io` (replace `username` with your actual GitHub username)
   - Example: If your username is `harshitmuhal`, name it `harshitmuhal.github.io`
4. Make sure it's set to **Public**
5. Check "Add a README file"
6. Click "Create repository"

### 2. Clone Repository Locally

```bash
git clone https://github.com/yourusername/yourusername.github.io.git
cd yourusername.github.io
```

### 3. Add Your Portfolio Files

1. Copy all files from your portfolio folder to the cloned repository folder
2. Make sure `index.html` is in the root directory
3. Keep `.nojekyll` and the complete `notes/` directory, including `index.html`, `app.js`, `content.js`, `vault.js`, `theme.js`, `style.css`, and `config.js`
4. Run `notes/supabase.sql` once in Supabase's SQL editor and configure authentication before expecting the notes page to work

### 4. Commit and Push

```bash
# Add all files
git add .

# Commit with a message
git commit -m "Initial portfolio website"

# Push to GitHub
git push origin main
```

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### 6. Access Your Website

Your website will be available at: `https://yourusername.github.io`

**Note**: It may take a few minutes for the site to be live after the first deployment.

## Deploying the Notes Page

For this repository, the portfolio URL is `https://harshitmuhal.github.io/` and the notes URL is `https://harshitmuhal.github.io/notes/`. The directory's `index.html` provides the `/notes/` route; no frontend build or SPA rewrite is needed. The current asset and callback paths assume this root-hosted site, not a project site under an extra repository prefix.

1. Set `supabaseUrl` and `supabaseKey` in `notes/config.js` using the project URL and a **publishable or legacy anon key**.
2. In Supabase Authentication > URL Configuration, set the production Site URL to `https://harshitmuhal.github.io/notes/` and allow that same redirect URL.
3. Enable Email and, if desired, Google under **Sign In / Providers**. Keep Google's Client Secret in Supabase, not in the static site.
4. For Google OAuth, use the Supabase callback URL copied from its Google provider settings as Google's authorized redirect URI. The app then returns from Supabase to `/notes/`; these are two different redirect settings.
5. Deploy the entire notes directory, then test sign-in, note creation, folder moves, inline checklists, and persistence after reloading.

No SQL migration is needed for themes, account selection, mobile input sizing, or the unified rich-text editor. The original `notes_vaults` table and per-account policies remain in use. Do not rerun the create-table script against an already configured database as an update step.

### Local Notes Testing

From the repository root:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/notes/`. Add that exact URL to Supabase's allowed redirect URLs; keep the production Site URL unchanged. For Google, also allow `http://localhost:8000` as an authorized JavaScript origin. The OAuth callback still goes to the hosted Supabase project, not to your local notes page. Local and deployed pages access the same cloud vault when using the same Supabase account.

## Custom Domain (Optional)

If you want to use a custom domain like `www.yourname.com`:

1. Buy a domain from a registrar
2. In your repository, create a file named `CNAME` (no extension)
3. Add your domain name to this file: `www.yourname.com`
4. Configure your domain's DNS settings to point to GitHub Pages
5. In GitHub repository settings > Pages, add your custom domain

## Updating Your Website

To update your website:

```bash
# Make your changes to the files
# Then commit and push
git add .
git commit -m "Update portfolio content"
git push origin main
```

Changes will be live within a few minutes.

## Troubleshooting

### Common Issues:

1. **Site not loading**: Wait 10-15 minutes after first deployment
2. **404 Error**: Make sure `index.html` is in the root directory
3. **Images not showing**: Check image paths are correct and images are committed
4. **CSS/JS not loading**: Verify file paths in `index.html`
5. **Notes configuration or sign-in errors**: Follow [notes/SETUP.md](notes/SETUP.md) and [GITHUB_PAGES_DEBUG.md](GITHUB_PAGES_DEBUG.md); deploying HTML alone does not configure Supabase
6. **Old notes UI or mobile focus zoom after an update**: Reload the page or clear stale site assets; ensure the latest `notes/style.css` and `notes/app.js` were deployed

### Check Deployment Status:

1. Go to your repository on GitHub
2. Click on "Actions" tab to see deployment status
3. Look for any error messages

## SEO and Performance Tips

1. **Add robots.txt**:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://yourusername.github.io/sitemap.xml
   ```

2. **Add sitemap.xml** for better SEO
   - Include public portfolio content, not the private notes workspace

3. **Optimize images** before uploading (compress them)

4. **Test on mobile devices** to ensure responsiveness

## Security

- Never commit passwords, access tokens, Google Client Secrets, Supabase secret keys, or service-role keys
- Supabase's **publishable/anon key** is intentionally public and belongs in `notes/config.js`; row-level security must remain enabled
- Store private authentication secrets in Supabase provider settings. Environment variables do not protect a secret if it is embedded in browser JavaScript
- Do not commit private note backups or screenshots containing private notes to this public repository
- Keep dependencies updated

## Analytics (Optional)

Add Google Analytics to track visitors:

1. Create Google Analytics account
2. Get tracking code
3. Add to your `index.html` before closing `</head>` tag

## Support

If you encounter issues:

1. Check [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Ask for help on [GitHub Community](https://github.community/)
3. Contact me at hrshtmuhal8@gmail.com

---

**Congratulations! Your portfolio is now live on the internet! 🎉**