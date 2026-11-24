# Harshit Muhal - Portfolio Website

A static portfolio website showcasing the professional journey and achievements of Harshit Muhal, with a private, cross-device notes workspace at `/notes/`.

## 🌟 Features

- **Modern Design**: Clean, professional design with smooth animations and modern UI/UX
- **Responsive Layout**: Responsive portfolio layout and a mobile file-explorer drawer for notes
- **Interactive Elements**: Particle background, typing effects, smooth scrolling, and hover animations
- **Performance Optimized**: Fast loading with optimized assets and lazy loading
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Accessibility**: Labeled notes controls and keyboard-operable checklist items
- **Notes workspace**: An Obsidian-inspired file explorer and a single editor for text, headings, bullet lists, and checkable to-dos
- **Private cloud sync**: Supabase email or Google sign-in, per-account data access, autosave, and conflict detection
- **Light and dark themes**: Light by default, with a browser-saved theme toggle and a full-width editor

## 🚀 Live Demo

Visit the live website: [https://harshitmuhal.github.io](https://harshitmuhal.github.io)

Notes page: [https://harshitmuhal.github.io/notes/](https://harshitmuhal.github.io/notes/). Sign-in and syncing require the Supabase configuration described in [notes/SETUP.md](notes/SETUP.md).

## 📱 Sections

- **Hero Section**: Animated introduction with particle background
- **About**: Professional summary with animated statistics
- **Experience**: Interactive timeline of career progression at Microsoft
- **Projects**: Filterable portfolio of technical projects
- **Skills**: Categorized technology skills with animations
- **Achievements**: Awards, publications, and competitive programming accomplishments
- **Contact**: Contact form and social media links
- **Notes**: Private notes and inline checklists, organized into folders

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animations**: AOS (Animate On Scroll), Custom CSS animations
- **Particles**: Particles.js for background effects
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)
- **Deployment**: GitHub Pages
- **Notes editor**: Quill 2, with rich text stored as text operations rather than executable HTML
- **Authentication and notes database**: Supabase Auth and Postgres with row-level security

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshitmuhal/harshitmuhal.github.io.git
   cd harshitmuhal.github.io
   ```

2. **Open locally**
   - From the repository root, run `python -m http.server 8000 --bind 127.0.0.1`
   - Open `http://localhost:8000/` for the portfolio or `http://localhost:8000/notes/` for notes
   - Use an HTTP server, not a `file://` URL, for the notes page's JavaScript modules
   - Follow [notes/SETUP.md](notes/SETUP.md) to create the Supabase table and configure email/Google sign-in and local redirect URLs

3. **Deploy to GitHub Pages**
   - Push to your GitHub repository
   - Enable GitHub Pages in repository settings
   - Select source as "Deploy from a branch" and choose "main"
   - Publish the root directory, including `notes/` and `.nojekyll`; see [DEPLOYMENT.md](DEPLOYMENT.md)

## Notes workspace

Select or create a note in the file explorer. The **Folder** dropdown moves that note and updates the active folder and breadcrumb; the separate **Text / Heading** dropdown changes formatting inside the note. The note title is visually distinct from H1, H2, and H3 content headings. Mix paragraphs and multiple checklists in one note, and check an item to strike it through.

Use **Tab / Shift+Tab** to nest or unnest list and checklist items, or use the **Indent / Outdent** toolbar buttons on mobile. Nesting is saved with your notes; checking a parent does not change its subtasks.

**Continue with Google** requests account selection on each new Google sign-in. Sign out first to switch the site's account. Email sign-in remains available. Notes belong to your Supabase account, not to the browser's theme setting. The page and its source files are public; database policies protect each account's private note content.

On mobile, the explorer is a drawer that closes when you select a note. Use the icon rail to reopen it or search. Editable fields use at least 16px text to avoid the small-text focus-zoom trigger, while pinch-to-zoom remains enabled. Sidebar open/closed state is preserved across layout changes.

Changes autosave to the cloud after a short pause. Sync status and recovery controls appear in the workspace header; there is no footer, word counter, or export/import feature. Offline or failed saves remain **in memory only**: keep the tab open and retry, or copy unsaved text somewhere safe before leaving. On a concurrent-device conflict, preserve your draft text before reloading the cloud copy; this is not real-time collaborative editing.

### Notes checks

From the repository root:

```powershell
node --test notes\vault.test.mjs notes\content.test.mjs notes\theme.test.mjs
```

## 🔧 Customization

### Updating Content
- Edit personal information in `index.html`
- Update projects in the projects section
- Modify experience timeline
- Change contact information

### Styling
- Main styles are in `assets/css/style.css`
- CSS variables in `:root` for easy theme customization
- Responsive breakpoints for different screen sizes
- Notes have standalone styles in `notes/style.css`; light/dark colors are CSS variables, and `notes/theme.js` restores the browser's theme preference

### Adding Projects
```html
<div class="project-card" data-category="your-category" data-aos="fade-up">
    <!-- Project content -->
</div>
```

### Color Scheme
Update CSS variables in `:root`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    /* ... other variables */
}
```

## 📊 Performance

The site has no frontend build step. Portfolio animation libraries, the Supabase browser SDK, and Quill load from external CDNs. Measure the deployed site with Lighthouse and browser developer tools rather than assuming a fixed score or load time. The private notes page uses `noindex` metadata and should not be added to a public sitemap.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: hrshtmuhal8@gmail.com
- **LinkedIn**: [linkedin.com/in/harshitmuhal](https://www.linkedin.com/in/harshitmuhal/)
- **GitHub**: [github.com/harshitmuhal](https://github.com/harshitmuhal)
- **Website**: [harshitmuhal.github.io](https://harshitmuhal.github.io)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- AOS library for scroll animations
- Particles.js for background effects
- Inspiration from modern web design trends

---

**Made with ❤️ by Harshit Muhal**