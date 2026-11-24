# Enable private notes sync

The `/notes/` page is a static GitHub Pages page. Supabase provides email sign-in and a private database; GitHub Pages needs no server or build step.

1. Create a Supabase project at https://supabase.com/dashboard.
2. Run `notes/supabase.sql` in its SQL editor. The row-level policies restrict each account to its own vault. Never disable row-level security.
3. In Supabase Authentication, enable the Email provider. Set the Site URL to `https://harshitmuhal.github.io/notes/` and add that exact URL to allowed redirect URLs. For local development, also allow `http://localhost:8000/notes/`.
4. Fill `supabaseUrl` and `supabaseKey` in `notes/config.js` with your project URL and **publishable key** (or legacy **anon** key). These are intentionally public. Never use a secret or service-role key; those bypass database policies.
5. Deploy the files to the branch used by GitHub Pages. Visit `/notes/`, enter your email, and open the sign-in link on the same device. Repeat on other devices with the same email to access the same vault.

For a personal-only installation, create/invite your account in the Supabase dashboard first, then disable **Allow new users to sign up** in Authentication settings. Other accounts otherwise get their own separate vaults, not access to yours. Supabase's default email service has delivery restrictions and rate limits; configure custom SMTP for reliable delivery to other addresses.

## Google sign-in

The login page also offers **Continue with Google**. Enable **Google** under Supabase Authentication > Sign In / Providers. Create a **Web application** OAuth client in Google Auth Platform, add your Supabase provider's callback URL as its authorized redirect URI, then paste the Google Client ID and Client Secret into Supabase's Google provider settings. Keep the secret in Supabase only; never add it to `config.js` or the repository.

Each new Google sign-in requests `prompt: select_account`. If the notes page is already signed in, sign out first to switch accounts. Google may already know your account and verified email from your browser session; the site does not receive your Google password. Email sign-in remains available alongside Google.

For Google authorized JavaScript origins, use `https://harshitmuhal.github.io` and `http://localhost:8000` for local testing. Keep `https://harshitmuhal.github.io/notes/` and `http://localhost:8000/notes/` in Supabase's allowed redirect URLs. The same button uses the current site's origin to return to `/notes/`, so it works locally and on GitHub Pages. No notes database changes are required. A different Supabase account still has a separate private vault.

Google's authorized redirect URI is your hosted Supabase project's `/auth/v1/callback` URL, copied from the provider settings, not either of the app's `/notes/` URLs. To show a friendly app name on Google's consent screen, configure Google Auth Platform > Branding; Google may require brand verification. Replacing the Supabase hostname itself requires a custom Supabase domain. Renaming the Supabase project does not change that hostname.

## How saving works

Notes and categories autosave after a short pause. The sidebar contains your notes; the main area is one editor. Use **Text / Heading 1 / Heading 2 / Heading 3**, **Bullet list**, or **Checklist** to mix paragraphs and multiple lists in the same note. Click a checklist box to check it and strike through its text; click again to undo. Press Enter for another list item and Enter twice to return to a paragraph. Bold, italic, and strikethrough are also available. Each note belongs to one category. Deleting a category moves its notes into Inbox.

Press **Tab** anywhere in a list or checklist item to nest it; **Shift+Tab** moves it back a level. Select multiple items to indent or outdent them together. The **Indent / Outdent** toolbar buttons provide the same controls on mobile. Up to eight indentation levels are supported, and nesting and checkbox completion persist in cloud saves. Checking a parent does not automatically check its nested items.

The **Folder** dropdown above the title moves the current note, updates folder counts, and selects the destination folder. The breadcrumb shows the current note's actual folder, including when browsing All notes. The note title is separate from the editor's content headings and has a larger, bolder style. Existing tasks from the old standalone to-do panel remain in the migrated **Things to do** note.

The icon rail toggles the file explorer and opens search. The explorer shows folders and note files; the active note appears in the tab strip. On small screens the explorer opens as a drawer and closes when you select a note. The + button in the tab strip creates a note even when the explorer is hidden. Sync state, retry, and cloud-reload controls appear in the workspace header. There is no footer, word counter, or export/import feature.

The editor uses the full available width with compact spacing. Light is the default theme; the moon/sun button in the icon rail switches between light and dark. Your theme choice is saved in this browser, independently of your cloud notes.

On mobile and touch devices, editable fields use at least 16px text to avoid the small-font focus-zoom trigger. This applies to login email, search, folder/style selectors, the new-folder dialog, and the note body. Pinch-to-zoom remains available. Resizing across responsive breakpoints preserves the explorer's selected open/closed state rather than resetting it. After updating the site, reload to pick up the latest styles; validate focus and keyboard behavior on an actual phone as well as an emulator.

Rich formatting is stored as Quill text operations, not executable HTML, alongside a plain-text copy for searching. Older plain-text notes remain readable; Markdown headings and task lists are recognized when opened. Any tasks from the previous separate to-do panel are automatically preserved in a **Things to do** note in Inbox, with their completion state intact. No database changes are needed.

The page fetches cloud changes on return to the tab and every 30 seconds while visible and not editing. Concurrent saves use a revision check: a stale device cannot silently overwrite newer changes. On a conflict, copy unsaved note text somewhere safe, reload the cloud copy, then add any desired draft content back into the editor. A plain-text copy does not preserve rich formatting. This is cross-device sync, not real-time collaborative editing.

If saving fails or you are offline, the page shows an error and retains the unsaved draft **in memory only**. Keep the tab open and retry syncing, or copy unsaved text somewhere safe before leaving. There is no offline persistent cache of note content. Authentication persists in browser storage; sign out on shared devices. Browser sessions can expire, so preserve unsaved text before signing in again.

## Local development

From the repository root, run `python -m http.server 8000 --bind 127.0.0.1`, then open `http://localhost:8000/notes/`. Use an HTTP server rather than opening the file directly. The Supabase browser library and Quill editor load from jsDelivr and require an internet connection. Keep the production Supabase Site URL unchanged when adding the local allowed redirect URL.

Run the focused sync, content, and theme tests with `node --test notes/vault.test.mjs notes/content.test.mjs notes/theme.test.mjs`.

## Verify your deployment

Sign in with the same account in two browser profiles. Create a category, note, and task in the first, wait for **Synced to cloud**, then reload the second. Check and uncheck the task and confirm its state persists after reloading. A different account must see an empty, separate vault. To check conflict handling, edit the same previously loaded vault in both profiles before either refreshes: the second save should report a conflict, not overwrite the first.

Also verify Google account selection after signing out, a folder move from All notes, title versus H1/H2/H3 formatting, and the light/dark toggle. On a phone, focus the login email and note/search inputs, type, and confirm that the icon rail remains reachable without manually zooming out.

## Files and Data Safety

- `index.html`, `style.css`, and `app.js`: workspace UI, sign-in actions, and interactions.
- `content.js`: rich-text operations, legacy text conversion, and standalone-task migration.
- `vault.js`: cloud loading, saves, revision checks, and data validation.
- `theme.js`: browser-local light/dark preference, restored before styles render.
- `config.js`: public Supabase URL and publishable/anon key only.
- `supabase.sql`: initial table and row-level policies; run once, not as a repeat deployment migration.

Static site files and documentation are public. Privacy comes from Supabase authentication and row-level policies, not the `/notes/` URL or `noindex` metadata. Do not commit private note backups, access tokens, or note screenshots to the repository.
