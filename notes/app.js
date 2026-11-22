import { VaultStore } from "./vault.js";
import { contentFromText, contentText, migrateLegacyTasks } from "./content.js";

const $ = (id) => document.getElementById(id);
let client;
let store;
let activeCategory = "all";
let selectedNote = null;
let saveTimer;
let ready = false;
let loading = false;
let sessionVersion = 0;
let richEditor;
const mobileLayout = window.matchMedia("(max-width: 760px)");

function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === "dark";
  $("toggle-theme").setAttribute("aria-pressed", String(dark));
  $("toggle-theme").title = dark
    ? "Switch to light theme"
    : "Switch to dark theme";
  $("theme-icon").setAttribute("href", dark ? "#icon-sun" : "#icon-moon");
}

updateThemeButton();
$("toggle-theme").addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  updateThemeButton();
  try {
    localStorage.setItem("hm-notes-theme", theme);
  } catch (error) {
    console.warn(
      "Theme preference could not be saved to browser storage.",
      error
    );
    showError(
      "Theme changed for this tab, but browser storage is unavailable. Your theme preference cannot be remembered."
    );
  }
});

function setSidebarOpen(open) {
  $("workspace").classList.toggle(
    "sidebar-collapsed",
    !open && !mobileLayout.matches
  );
  $("workspace").classList.toggle("sidebar-open", open && mobileLayout.matches);
  $("toggle-sidebar").setAttribute("aria-expanded", String(open));
}

setSidebarOpen(!mobileLayout.matches);
mobileLayout.addEventListener("change", () =>
  setSidebarOpen($("toggle-sidebar").getAttribute("aria-expanded") === "true")
);
$("toggle-sidebar").addEventListener("click", () =>
  setSidebarOpen($("toggle-sidebar").getAttribute("aria-expanded") !== "true")
);
$("sidebar-backdrop").addEventListener("click", () => setSidebarOpen(false));
$("focus-search").addEventListener("click", () => {
  setSidebarOpen(true);
  $("search").focus();
});
$("quick-new-note").addEventListener("click", () => {
  $("new-note").click();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    mobileLayout.matches &&
    $("workspace").classList.contains("sidebar-open")
  ) {
    setSidebarOpen(false);
    $("toggle-sidebar").focus();
  }
});

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#icon-${name}`);
  svg.append(use);
  return svg;
}

function updateNoteLabel() {
  const item = note();
  const title =
    item?.title.trim() || (selectedNote ? "Untitled note" : "New tab");
  const folder = store.data.categories.find(
    (category) => category.id === (item?.categoryId || activeCategory)
  );
  $("breadcrumb").textContent = folder?.name || "All notes";
  $("note-tab-title").textContent = title;
  $("path-note").textContent = title;
  document.title = `${title} | Personal vault`;
}

function showError(message) {
  $("workspace-error").textContent = message;
  $("workspace-error").hidden = false;
}

function clearError() {
  $("workspace-error").hidden = true;
  $("workspace-error").textContent = "";
}

function status(state) {
  const labels = {
    saved: "Synced to cloud",
    saving: "Saving...",
    dirty: "Unsaved changes",
    error: "Sync failed - draft not saved",
    conflict: "Sync conflict - draft not saved",
  };
  $("sync-status").textContent = labels[state];
  $("sync-status").dataset.state = state;
  $("retry").hidden = !["error", "dirty"].includes(state);
  $("reload").hidden = state !== "conflict";
}

async function save() {
  clearTimeout(saveTimer);
  if (!store || !ready) return;
  const current = store;
  try {
    await current.save();
    if (store === current) clearError();
  } catch (error) {
    if (store === current)
      showError(
        `Could not save: ${error.message} Keep this tab open and retry syncing. Copy unsaved text somewhere safe before leaving.`
      );
  }
}

function changed() {
  store.changed();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 600);
}

function note() {
  return store.data.notes.find((item) => item.id === selectedNote);
}

function visibleNotes() {
  const query = $("search").value.trim().toLowerCase();
  return store.data.notes
    .filter(
      (item) =>
        (activeCategory === "all" || item.categoryId === activeCategory) &&
        `${item.title}\n${item.body}`.toLowerCase().includes(query)
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function renderCategories() {
  const categories = [
    { id: "all", name: "All notes" },
    ...store.data.categories,
  ];
  $("categories").replaceChildren(
    ...categories.map((category) => {
      const button = document.createElement("button");
      button.className = `category-button${
        category.id === activeCategory ? " active" : ""
      }`;
      button.setAttribute(
        "aria-current",
        category.id === activeCategory ? "true" : "false"
      );
      const label = document.createElement("span");
      label.className = "category-label";
      label.textContent = category.name;
      const count = document.createElement("span");
      count.className = "category-count";
      count.textContent = store.data.notes.filter(
        (item) => category.id === "all" || item.categoryId === category.id
      ).length;
      button.append(
        icon(category.id === "all" ? "file" : "folder"),
        label,
        count
      );
      button.addEventListener("click", () => {
        activeCategory = category.id;
        selectedNote = visibleNotes()[0]?.id || null;
        render();
      });
      return button;
    })
  );
  const name =
    categories.find((category) => category.id === activeCategory)?.name ||
    "All notes";
  $("category-title").textContent = name;
  $("breadcrumb").textContent = name;
  $("delete-category").hidden = ["all", "inbox"].includes(activeCategory);
  $("note-category").replaceChildren(
    ...store.data.categories.map((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      return option;
    })
  );
}

function renderNotes() {
  const notes = visibleNotes();
  $("note-count").textContent = notes.length;
  $("empty-notes").hidden = notes.length > 0;
  $("note-list").replaceChildren(
    ...notes.map((item) => {
      const button = document.createElement("button");
      button.className = `note-card${
        item.id === selectedNote ? " active" : ""
      }`;
      button.setAttribute("aria-pressed", String(item.id === selectedNote));
      const title = document.createElement("strong");
      title.textContent = item.title.trim() || "Untitled note";
      const preview = document.createElement("small");
      preview.textContent = item.body.slice(0, 100) || "No content yet";
      const date = document.createElement("time");
      date.dateTime = item.updatedAt;
      date.textContent = new Date(item.updatedAt).toLocaleDateString(
        undefined,
        { month: "short", day: "numeric" }
      );
      button.append(icon("file"), title, preview, date);
      button.addEventListener("click", () => {
        selectedNote = item.id;
        renderNotes();
        renderEditor();
        if (mobileLayout.matches) setSidebarOpen(false);
      });
      return button;
    })
  );
}

function renderEditor() {
  const item = note();
  $("editor").hidden = !item;
  $("empty-editor").hidden = Boolean(item);
  $("note-title").value = item?.title || "";
  updateNoteLabel();
  richEditor.setContents(
    item?.content || contentFromText(item?.body || ""),
    "silent"
  );
  richEditor.history.clear();
  $("note-category").value = item?.categoryId || "inbox";
  decorateChecklist();
}

function decorateChecklist() {
  for (const line of richEditor.root.querySelectorAll("li[data-list]")) {
    const ui = line.querySelector(".ql-ui");
    if (!ui) continue;
    const checklist = ["checked", "unchecked"].includes(line.dataset.list);
    if (!checklist) {
      ui.removeAttribute("role");
      ui.removeAttribute("aria-label");
      ui.removeAttribute("aria-checked");
      ui.removeAttribute("tabindex");
      ui.onkeydown = null;
      continue;
    }
    ui.setAttribute("role", "checkbox");
    ui.setAttribute(
      "aria-label",
      line.textContent.trim() || "Empty checklist item"
    );
    ui.setAttribute("aria-checked", String(line.dataset.list === "checked"));
    ui.tabIndex = 0;
    ui.onkeydown = (event) => {
      if (![" ", "Enter"].includes(event.key)) return;
      event.preventDefault();
      const index = richEditor.getIndex(window.Quill.find(line));
      richEditor.formatLine(
        index,
        1,
        "list",
        line.dataset.list === "checked" ? "unchecked" : "checked",
        "user"
      );
      line.querySelector(".ql-ui")?.focus();
    };
  }
}

function initEditor() {
  if (!window.Quill)
    throw new Error(
      "The note editor could not load. Check your connection and reload."
    );
  richEditor = new window.Quill("#note-body", {
    theme: null,
    placeholder:
      "Start writing... Add a heading or a checklist whenever you need one.",
    formats: ["header", "bold", "italic", "strike", "list"],
    modules: { toolbar: "#format-toolbar", history: { userOnly: true } },
  });
  richEditor.root.setAttribute("role", "textbox");
  richEditor.root.setAttribute("aria-label", "Note content");
  richEditor.root.setAttribute("aria-multiline", "true");
  richEditor.on("editor-change", () => {
    if ($("text-style").selectedIndex < 0 && !richEditor.getSelection())
      $("text-style").value = "";
  });
  richEditor.on("text-change", (_delta, _old, source) => {
    decorateChecklist();
    const item = store && note();
    if (source !== "user" || !ready || !item) return;
    item.content = structuredClone({ ops: richEditor.getContents().ops });
    item.body = contentText(item.content);
    item.updatedAt = new Date().toISOString();
    changed();
    renderNotes();
  });
}

function render() {
  renderCategories();
  renderNotes();
  renderEditor();
}

async function loadCloud(force = false) {
  if (!store || loading || store.pending || (!force && store.dirty)) return;
  loading = true;
  const current = store;
  try {
    const loaded = await current.load();
    if (current !== store || !loaded) return;
    ready = true;
    document.querySelector(".content-grid").inert = false;
    $("new-note").disabled = false;
    $("quick-new-note").disabled = false;
    $("add-category").disabled = false;
    $("delete-category").disabled = false;
    const migrated = migrateLegacyTasks(
      current.data,
      crypto.randomUUID(),
      new Date().toISOString()
    );
    if (
      !current.data.categories.some(
        (category) => category.id === activeCategory
      )
    )
      activeCategory = "all";
    if (!current.data.notes.some((item) => item.id === selectedNote))
      selectedNote = visibleNotes()[0]?.id || null;
    render();
    clearError();
    $("reload").hidden = true;
    if (migrated) changed();
  } catch (error) {
    if (current !== store) return;
    showError(`Could not load cloud notes: ${error.message}`);
    $("sync-status").textContent = "Could not load vault";
    $("sync-status").dataset.state = "error";
    $("reload").hidden = false;
  } finally {
    if (current === store) loading = false;
  }
}

async function applySession(session) {
  if (session?.user.id === store?.userId) return;
  const version = ++sessionVersion;
  clearTimeout(saveTimer);
  store = null;
  ready = false;
  loading = false;
  selectedNote = null;
  activeCategory = "all";
  $("search").value = "";
  richEditor.setContents([{ insert: "\n" }], "silent");
  richEditor.history.clear();
  $("note-tab-title").textContent = "New tab";
  $("path-note").textContent = "New tab";
  document.title = "Notes | Personal vault";
  $("category-dialog").close();
  $("workspace").hidden = true;
  $("auth-screen").hidden = false;
  if (!session) return;
  store = new VaultStore(client, session.user.id, (state) => {
    if (version === sessionVersion) status(state);
  });
  render();
  $("workspace").hidden = false;
  $("auth-screen").hidden = true;
  $("account").textContent = session.user.email;
  document.querySelector(".content-grid").inert = true;
  $("new-note").disabled = true;
  $("quick-new-note").disabled = true;
  $("add-category").disabled = true;
  $("delete-category").disabled = true;
  $("sync-status").textContent = "Loading...";
  $("sync-status").dataset.state = "loading";
  await loadCloud();
}

function setAuthBusy(busy) {
  $("login-button").disabled = busy;
  $("google-login-button").disabled = busy;
}

$("google-login-button").addEventListener("click", async () => {
  if (!client) return;
  setAuthBusy(true);
  $("auth-status").textContent = "Opening Google sign-in...";
  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/notes/`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) throw error;
  } catch (error) {
    $(
      "auth-status"
    ).textContent = `Could not sign in with Google: ${error.message}`;
  } finally {
    setAuthBusy(false);
  }
});

$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client) return;
  setAuthBusy(true);
  $("auth-status").textContent = "Sending your sign-in link...";
  try {
    const { error } = await client.auth.signInWithOtp({
      email: $("email").value.trim(),
      options: { emailRedirectTo: `${location.origin}/notes/` },
    });
    if (error) throw error;
    $("auth-status").textContent =
      "Check your email. Open the sign-in link on this device to enter your vault.";
  } catch (error) {
    $(
      "auth-status"
    ).textContent = `Could not send sign-in link: ${error.message}`;
  } finally {
    setAuthBusy(false);
  }
});

$("new-note").addEventListener("click", () => {
  if (!ready) return;
  const item = {
    id: crypto.randomUUID(),
    categoryId: activeCategory === "all" ? "inbox" : activeCategory,
    title: "",
    body: "",
    updatedAt: new Date().toISOString(),
  };
  store.data.notes.unshift(item);
  selectedNote = item.id;
  $("search").value = "";
  changed();
  render();
  if (mobileLayout.matches) setSidebarOpen(false);
  $("note-title").focus();
});

$("note-title").addEventListener("input", () => {
  const item = note();
  if (!ready || !item) return;
  item.title = $("note-title").value;
  updateNoteLabel();
  item.updatedAt = new Date().toISOString();
  changed();
  renderNotes();
});

$("note-category").addEventListener("change", () => {
  const item = note();
  if (!ready || !item) return;
  item.categoryId = $("note-category").value;
  item.updatedAt = new Date().toISOString();
  activeCategory = item.categoryId;
  changed();
  render();
});

$("delete-note").addEventListener("click", () => {
  if (!ready || !note() || !confirm("Delete this note? This cannot be undone."))
    return;
  store.data.notes = store.data.notes.filter(
    (item) => item.id !== selectedNote
  );
  selectedNote = visibleNotes()[0]?.id || null;
  changed();
  render();
});

$("search").addEventListener("input", () => {
  if (ready) renderNotes();
});
$("add-category").addEventListener("click", () => {
  if (!ready) return;
  $("category-form").reset();
  $("category-error").textContent = "";
  $("category-dialog").showModal();
  $("category-name").focus();
});
$("cancel-category").addEventListener("click", () =>
  $("category-dialog").close()
);
$("category-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!ready) return;
  const name = $("category-name").value.trim();
  if (
    !name ||
    store.data.categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    ) ||
    name.toLowerCase() === "all notes"
  ) {
    $("category-error").textContent =
      "Enter a unique, non-empty category name.";
    return;
  }
  activeCategory = crypto.randomUUID();
  store.data.categories.push({ id: activeCategory, name });
  selectedNote = null;
  changed();
  render();
  $("category-dialog").close();
});
$("delete-category").addEventListener("click", () => {
  if (
    !ready ||
    ["all", "inbox"].includes(activeCategory) ||
    !confirm("Delete this category? Its notes will move to Inbox.")
  )
    return;
  for (const item of store.data.notes)
    if (item.categoryId === activeCategory) item.categoryId = "inbox";
  store.data.categories = store.data.categories.filter(
    (category) => category.id !== activeCategory
  );
  activeCategory = "inbox";
  changed();
  render();
});

$("retry").addEventListener("click", save);
$("reload").addEventListener("click", () => {
  if (
    store?.dirty &&
    !confirm(
      "Discard this unsaved draft and load the cloud copy? Copy unsaved text somewhere safe first if you want to keep your changes."
    )
  )
    return;
  clearTimeout(saveTimer);
  loadCloud(true);
});
$("sign-out").addEventListener("click", async () => {
  if (store?.pending) await save();
  if (
    store?.dirty &&
    !confirm(
      "Your draft is not saved. Sign out and discard it? Copy unsaved text somewhere safe first to keep it."
    )
  )
    return;
  clearTimeout(saveTimer);
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    await applySession(null);
    $("auth-status").textContent = "Signed out.";
  } catch (error) {
    showError(`Could not sign out: ${error.message}`);
  }
});

window.addEventListener("beforeunload", (event) => {
  if (store?.dirty) {
    event.preventDefault();
    event.returnValue = "";
  }
});
window.addEventListener("online", () => {
  if (store?.dirty) save();
  else loadCloud();
});
function isEditing() {
  return (
    ["note-title", "category-name"].includes(document.activeElement?.id) ||
    $("editor").contains(document.activeElement)
  );
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    if (store?.dirty) save();
  } else if (!isEditing()) loadCloud();
});
setInterval(() => {
  if (document.visibilityState === "visible" && !isEditing()) loadCloud();
}, 30000);

async function init() {
  const config = window.NOTES_CONFIG;
  if (!config?.supabaseUrl || !config?.supabaseKey) {
    $("auth-status").textContent =
      "Cloud sync is not configured yet. Follow notes/SETUP.md and fill in notes/config.js to connect your Supabase project.";
    setAuthBusy(true);
    return;
  }
  try {
    const callbackError =
      new URLSearchParams(location.hash.slice(1)).get("error_description") ||
      new URLSearchParams(location.search).get("error_description");
    initEditor();
    if (!window.supabase)
      throw new Error(
        "The sign-in library could not load. Check your connection and reload."
      );
    client = window.supabase.createClient(
      config.supabaseUrl,
      config.supabaseKey
    );
    client.auth.onAuthStateChange((event, session) => {
      if (event !== "INITIAL_SESSION")
        setTimeout(() => applySession(session), 0);
    });
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    await applySession(data.session);
    setAuthBusy(false);
    if (callbackError)
      $("auth-status").textContent = `Sign-in failed: ${callbackError}`;
  } catch (error) {
    $(
      "auth-status"
    ).textContent = `Could not initialize sign-in: ${error.message}`;
    setAuthBusy(true);
  }
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
