import { validateContent } from "./content.js";

export function emptyVault() {
  return { categories: [{ id: "inbox", name: "Inbox" }], notes: [], tasks: [] };
}

export function validateVault(value) {
  const invalid = () => {
    throw new Error(
      "The cloud vault has an unsupported format. No data has been overwritten."
    );
  };
  if (
    !value ||
    !Array.isArray(value.categories) ||
    !Array.isArray(value.notes) ||
    !Array.isArray(value.tasks)
  )
    invalid();
  const ids = new Set();
  const checkId = (item) => {
    if (!item || typeof item.id !== "string" || !item.id || ids.has(item.id))
      invalid();
    ids.add(item.id);
  };
  for (const category of value.categories) {
    checkId(category);
    if (typeof category.name !== "string" || !category.name.trim()) invalid();
  }
  const categories = new Set(value.categories.map((category) => category.id));
  if (!categories.has("inbox")) invalid();
  for (const note of value.notes) {
    checkId(note);
    if (
      !categories.has(note.categoryId) ||
      typeof note.title !== "string" ||
      typeof note.body !== "string" ||
      typeof note.updatedAt !== "string" ||
      !Number.isFinite(Date.parse(note.updatedAt))
    )
      invalid();
    if (note.content !== undefined && !validateContent(note.content)) invalid();
  }
  for (const task of value.tasks) {
    checkId(task);
    if (
      typeof task.text !== "string" ||
      !task.text.trim() ||
      typeof task.done !== "boolean"
    )
      invalid();
  }
  return value;
}

export class VaultStore {
  constructor(client, userId, onStatus = () => {}) {
    this.client = client;
    this.userId = userId;
    this.onStatus = onStatus;
    this.data = emptyVault();
    this.revision = null;
    this.generation = 0;
    this.savedGeneration = 0;
    this.conflict = false;
    this.pending = null;
  }

  get dirty() {
    return this.generation !== this.savedGeneration;
  }

  async load() {
    if (this.pending)
      throw new Error("Wait for the current save before reloading.");
    const generation = this.generation;
    const { data, error } = await this.client
      .from("notes_vaults")
      .select("data, revision")
      .eq("user_id", this.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (this.generation !== generation) return false;
    const vault = data ? validateVault(data.data) : emptyVault();
    if (data && (!Number.isSafeInteger(data.revision) || data.revision < 1))
      throw new Error("Invalid cloud vault revision.");
    this.data = structuredClone(vault);
    this.revision = data ? data.revision : null;
    this.generation = 0;
    this.savedGeneration = 0;
    this.conflict = false;
    this.onStatus("saved");
    return true;
  }

  changed() {
    this.generation += 1;
    this.onStatus(this.conflict ? "conflict" : "dirty");
  }

  save() {
    if (this.pending) return this.pending;
    this.pending = this.flush().finally(() => {
      this.pending = null;
    });
    return this.pending;
  }

  async flush() {
    if (this.conflict)
      throw new Error(
        "Another device updated this vault. Copy unsaved text somewhere safe, then reload the cloud copy before editing further."
      );
    while (this.dirty) {
      this.onStatus("saving");
      const generation = this.generation;
      const snapshot = structuredClone(validateVault(this.data));
      const revision = (this.revision || 0) + 1;
      const table = this.client.from("notes_vaults");
      const request =
        this.revision === null
          ? table.insert({ user_id: this.userId, data: snapshot, revision })
          : table
              .update({ data: snapshot, revision })
              .eq("user_id", this.userId)
              .eq("revision", this.revision);
      const { data, error } = await request.select("revision").maybeSingle();
      if ((error && error.code === "23505") || (!error && !data)) {
        this.conflict = true;
        this.onStatus("conflict");
        throw new Error(
          "Another device updated this vault. Your draft is still on this page. Copy unsaved text somewhere safe before reloading the cloud copy."
        );
      }
      if (error) {
        this.onStatus("error");
        throw new Error(error.message);
      }
      this.revision = data.revision;
      this.savedGeneration = generation;
    }
    this.onStatus("saved");
  }
}
