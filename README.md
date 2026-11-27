# Harshit Muhal - Portfolio Website

A static portfolio website showcasing the professional journey and achievements of Harshit Muhal, with a private, cross-device notes workspace at `/notes/`.

## 🌟 Features

- **Cinematic wizarding-inspired design**: A panoramic original moonlit castle, monumental editorial typography, dark chapter scenes, parchment details, and antique gold; no borrowed franchise images or logos
- **Animated magic throughout**: Midnight castle sky with nine staggered floating candles, warm layered glow, and a gentle drifting motion. The candle beside the center cost-savings statistic is omitted. A wizard chases a roaming golden snitch within the Home section only; the chase follows a shared route with a short lead for the snitch, is clipped to Home, and pauses offscreen. A bounded pointer spell trail and scroll-following Hedwig remain available throughout the portfolio. The project archive uses the serpent chamber, real achievements have a blue-flame Triwizard Cup, skills feature a separate catchable golden snitch, and Hedwig's Owl Post leads into the contact form. Animations run automatically, including when the operating system requests reduced motion.
- **Responsive Layout**: The hero uses a concise introduction with larger body text and quiet credential labels. Centered statistics and contact/CV actions form one compact footer beneath a subtle divider. Height-aware spacing keeps actions visible at common desktop viewport sizes; the technology strip and scroll prompt are omitted. Very small screens retain readable, scrollable content rather than clipping it. Notes have an independent mobile file-explorer drawer.
- **Scroll companion**: A small, original snowy-owl illustration with white plumage, dark feather markings, and subdued golden eyes follows scrolling on the left. She keeps her horizontal position instead of crossing the page. After scrolling stops, her feathered wings continue beating through the approach, her feet lower toward the lower-left screen edge, and her wings fold only on arrival. Resuming scrolling interrupts the landing and returns her to flight. Desktop/mobile widths are 64px/56px. She never intercepts clicks and disappears while the tab is hidden. The contact section retains its own Owl Post illustration.
- **Chapter navigation**: An active chapter rail on desktop and a native CSS reading-progress line where supported. Scrolling and arrow keys retain normal browser behavior; there is no artificial loading delay.
- **Always-on animation**: The main portfolio does not offer animation-control buttons, ask for opt-in, read browser-stored motion preferences, or suppress effects based on `prefers-reduced-motion`. Previously saved overrides are ignored. Wizard/snitch flight, Hedwig, CSS effects, and typing start automatically. Hidden tabs still suspend activity; chapter animations pause offscreen. The independent notes workspace is unchanged.
- **About letter**: The Howler starts as a sealed red envelope when JavaScript is available. Its closed cover matches the open envelope's width, height, and position, including after resizing or font loading. Once the upper flap is visible, the wax seal releases, the flap unfolds, and the parchment introduction slides out in place. The sequence plays once per page visit, needs no click, and keeps the final layout space reserved to avoid shifting surrounding sections. Without JavaScript, the introduction is already open and readable. The open design retains white paper teeth, a tongue, side folds, and a wax seal.
- **Portfolio order**: Home, About, Experience, Skills, Research, Achievements, Projects, Contact. Projects sits immediately above Contact; the navigation, chapter rail, and Roman-numeral labels follow this order.
- **Journey phoenix**: The Experience heading, subtitle, and original crimson-and-gold phoenix share a centered axis. Individually layered flight feathers lift in a 3.2-second wing cycle, with delayed feather-tip movement and a continuous underwing/belly silhouette beneath the articulated shoulders to prevent gaps during motion. A gently hovering body, fine-veined tail feathers, breathing ember light, and rising sparks complete the illustration. It stays within that chapter and follows its offscreen/background animation suspension. Short desktop viewports use a smaller composition so the sticky heading and bird remain reachable; mobile uses a non-sticky layout.
- **Interactive Elements**: Automatic typing effects, smooth scrolling, and hover animations
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

- **Hero Section**: Professional introduction with an original, decorative wizarding castle illustration
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
- **Particles**: Legacy Particles.js support is retained but disabled in the castle theme
- **Icons**: Font Awesome 6
- **Fonts**: Inter and Cormorant Garamond (Google Fonts), with local fallback fonts
- **Homepage name**: Readable, single-line Cormorant Garamond lettering, with an italic gold surname and no trailing dot. The experimental fantasy fonts and custom SVG lettering have been removed. The main page retains its original HM SVG favicon; the notes workspace keeps its independent typography.
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

Select text and use the chain-link button to add a web URL. Use it inside an existing link to edit the URL, or leave the URL blank to remove it. Ctrl/Cmd-click to open links on desktop, or tap them on touch devices. Links support `http://` and `https://` and sync with your notes.

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
- The main portfolio loads `assets/css/wizard-theme.css` after the base and fallback styles for shared colors, typography, and components. `assets/css/wizard-magic.css` supplies the cinematic composition: the original panoramic artwork is `assets/images/midnight-castle.svg`, with transform/opacity-based atmosphere layered over it. The notes workspace does not load these themes.
- `assets/css/wizard-magic.css` and `assets/js/wizard-magic.js` carry the theme through every portfolio chapter: a parchment dossier, career milestones, a serpent-guarded project archive, snitch-lit skills, book-spine research cards, a trophy cabinet, and owl-post stationery. Chamber/cup SVG templates are mounted into their relevant section headings; there is no separate relic showcase. Projects and awards stay directly accessible. Hedwig's **Write a letter** action focuses the existing name field and does not send a message. All illustrations are original SVG; chapter animations pause offscreen and in background tabs, pointer trails use a fixed pool of 16 sparks, and no new animation libraries or remote image assets are required. These effects do not run in `/notes/`.
- CSS variables in `:root` for easy theme customization
- Responsive breakpoints for different screen sizes
- Notes have standalone styles in `notes/style.css`; light/dark colors are CSS variables, and `notes/theme.js` restores the browser's theme preference

The cinematic direction was developed through three visual studies: an enchanted archive, a celestial atlas, and a moonlit landscape. The landscape direction was selected, with the archive's editorial restraint. Research references were [Codrops' discussion of cinematic rhythm and hierarchy](https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/), [web.dev's performant animation guidance](https://web.dev/articles/animations-guide), and [MDN's scroll-driven animation guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines). These informed principles, not copied source code or visual assets.

The wizard/snitch chase uses two compositor-driven Web Animations API animations on the same Home-relative route with a 950ms lead for the snitch. The chase stage is positioned inside Home, not fixed to the viewport. Resizing rebuilds the two animations while retaining their phase; offscreen and background-tab suspension are handled explicitly. It does not use a JavaScript frame loop or intercept clicks.

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