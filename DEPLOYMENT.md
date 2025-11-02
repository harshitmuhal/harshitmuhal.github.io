# Deployment Guide for GitHub Pages

This guide will help you deploy your portfolio website to GitHub Pages.

## Prerequisites

1. GitHub account
2. Git installed on your computer
3. Your portfolio files ready

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

3. **Optimize images** before uploading (compress them)

4. **Test on mobile devices** to ensure responsiveness

## Security

- Never commit sensitive information (API keys, passwords)
- Use environment variables for any secrets
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