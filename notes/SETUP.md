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

For Google authorized JavaScript origins, use `https://harshitmuhal.github.io` and `http://localhost:8000` for local testing. Keep `https://harshitmuhal.github.io/notes/` and `http://localhost:8000/notes/` in Supabase's allowed redirect URLs. The same button uses the current site's origin to return to `/notes/`, so it works locally and on GitHub Pages. No notes database changes are required. A different Supabase account still has a separate private vault.

## How saving works

Notes and categories autosave after a short pause. The sidebar contains your notes; the main area is one editor. Use **Text / Heading 1 / Heading 2 / Heading 3**, **Bullet list**, or **Checklist** to mix paragraphs and multiple lists in the same note. Click a checklist box to check it and strike through its text; click again to undo. Press Enter for another list item and Enter twice to return to a paragraph. Bold, italic, and strikethrough are also available. Each note belongs to one category. Deleting a category moves its notes into Inbox.

The icon rail toggles the file explorer and opens search. The explorer shows folders and note files; the active note appears in the tab strip. On small screens the explorer opens as a drawer and closes when you select a note. The + button in the tab strip creates a note even when the explorer is hidden. Sync state and word count appear in the bottom status bar.

The editor uses the full available width with compact spacing. Light is the default theme; the moon/sun button in the icon rail switches between light and dark. Your theme choice is saved in this browser, independently of your cloud notes.

Rich formatting is stored as Quill text operations, not executable HTML, alongside a plain-text copy for searching. Older plain-text notes remain readable; Markdown headings and task lists are recognized when opened. Any tasks from the previous separate to-do panel are automatically preserved in a **Things to do** note in Inbox, with their completion state intact. No database changes are needed.

The page fetches cloud changes on return to the tab and every 30 seconds while visible and not editing. Concurrent saves use a revision check: a stale device cannot silently overwrite newer changes. On a conflict, export your draft, reload the cloud copy, then copy any desired draft content back into the editor. This is cross-device sync, not real-time collaborative editing.

If saving fails or you are offline, the page shows an error and retains the unsaved draft **in memory only**. Keep the tab open, retry syncing, or use **Export vault**. There is no offline persistent cache of note content. Exported JSON is a readable backup, not an automatic import format. Authentication persists in browser storage; sign out on shared devices. Browser sessions can expire, so export unsaved work before signing in again.

## Local development

From the repository root, run `python -m http.server 8000`, then open `http://localhost:8000/notes/`. Use an HTTP server rather than opening the file directly. The Supabase browser library and Quill editor load from jsDelivr and require an internet connection.

Run the focused sync, content, and theme tests with `node --test notes/vault.test.mjs notes/content.test.mjs notes/theme.test.mjs`.

## Verify your deployment

Sign in with the same account in two browser profiles. Create a category, note, and task in the first, wait for **Synced to cloud**, then reload the second. Check and uncheck the task and confirm its state persists after reloading. A different account must see an empty, separate vault. To check conflict handling, edit the same previously loaded vault in both profiles before either refreshes: the second save should report a conflict, not overwrite the first.
