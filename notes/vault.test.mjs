import test from "node:test";
import assert from "node:assert/strict";
import { emptyVault, validateVault, VaultStore } from "./vault.js";

function database() {
  const rows = new Map();
  let failure = null;
  let pause = null;
  return {
    rows,
    failNext(message) {
      failure = { message };
    },
    pauseNext(promise) {
      pause = promise;
    },
    from(name) {
      assert.equal(name, "notes_vaults");
      let operation = "read";
      let values;
      const filters = {};
      const query = {
        select() {
          return query;
        },
        eq(key, value) {
          filters[key] = value;
          return query;
        },
        insert(value) {
          operation = "insert";
          values = value;
          return query;
        },
        update(value) {
          operation = "update";
          values = value;
          return query;
        },
        async maybeSingle() {
          const gate = pause;
          pause = null;
          if (gate) await gate;
          if (failure) {
            const error = failure;
            failure = null;
            return { data: null, error };
          }
          const id = filters.user_id || values?.user_id;
          const row = rows.get(id);
          if (operation === "read")
            return { data: row ? structuredClone(row) : null, error: null };
          if (operation === "insert" && row)
            return { data: null, error: { code: "23505" } };
          if (
            operation === "update" &&
            (!row || row.revision !== filters.revision)
          )
            return { data: null, error: null };
          rows.set(id, structuredClone({ ...values, user_id: id }));
          return { data: { revision: values.revision }, error: null };
        },
      };
      return query;
    },
  };
}

function addTask(store, text = "Write a note") {
  store.data.tasks.push({
    id: `task-${store.data.tasks.length}`,
    text,
    done: false,
  });
  store.changed();
}

test("categories, notes and task completion persist across device loads", async () => {
  const db = database();
  const first = new VaultStore(db, "owner");
  await first.load();
  first.data.categories.push({ id: "work", name: "Work" });
  first.data.notes.push({
    id: "note",
    categoryId: "work",
    title: "Plan",
    body: "# Next steps",
    updatedAt: new Date().toISOString(),
  });
  addTask(first);
  await first.save();
  const second = new VaultStore(db, "owner");
  await second.load();
  assert.deepEqual(second.data, first.data);
  second.data.tasks[0].done = true;
  second.changed();
  await second.save();
  await first.load();
  assert.equal(first.data.tasks[0].done, true);
  assert.equal(first.dirty, false);
  const otherAccount = new VaultStore(db, "other");
  await otherAccount.load();
  assert.deepEqual(otherAccount.data, emptyVault());
});

test("a stale device cannot overwrite newer cloud edits", async () => {
  const db = database();
  const first = new VaultStore(db, "owner");
  await first.load();
  addTask(first, "Initial");
  await first.save();
  const second = new VaultStore(db, "owner");
  await second.load();
  addTask(first, "First device");
  await first.save();
  addTask(second, "Second device draft");
  await assert.rejects(second.save(), /Another device/);
  assert.equal(second.conflict, true);
  assert.equal(second.dirty, true);
  assert.equal(second.data.tasks[1].text, "Second device draft");
  assert.equal(db.rows.get("owner").data.tasks[1].text, "First device");
  await assert.rejects(second.save(), /Another device/);
});

test("simultaneous first saves report a conflict instead of replacing a vault", async () => {
  const db = database();
  const first = new VaultStore(db, "owner");
  const second = new VaultStore(db, "owner");
  await Promise.all([first.load(), second.load()]);
  addTask(first, "First");
  addTask(second, "Second");
  await first.save();
  await assert.rejects(second.save(), /Another device/);
  assert.equal(db.rows.get("owner").data.tasks[0].text, "First");
});

test("network errors preserve dirty drafts and allow retry", async () => {
  const db = database();
  const store = new VaultStore(db, "owner");
  await store.load();
  addTask(store);
  db.failNext("Offline");
  await assert.rejects(store.save(), /Offline/);
  assert.equal(store.dirty, true);
  assert.equal(store.revision, null);
  await store.save();
  assert.equal(store.dirty, false);
  assert.equal(db.rows.get("owner").revision, 1);
});

test("edits made during a save are serialized into the next revision", async () => {
  const db = database();
  const store = new VaultStore(db, "owner");
  await store.load();
  let resume;
  db.pauseNext(
    new Promise((resolve) => {
      resume = resolve;
    })
  );
  addTask(store, "First");
  const saving = store.save();
  addTask(store, "While saving");
  assert.equal(store.save(), saving);
  resume();
  await saving;
  assert.equal(db.rows.get("owner").revision, 2);
  assert.equal(db.rows.get("owner").data.tasks.length, 2);
  assert.equal(store.dirty, false);
});

test("a background read never discards edits made while it was loading", async () => {
  const db = database();
  const store = new VaultStore(db, "owner");
  await store.load();
  let resume;
  db.pauseNext(
    new Promise((resolve) => {
      resume = resolve;
    })
  );
  const loading = store.load();
  addTask(store, "Keep this draft");
  resume();
  assert.equal(await loading, false);
  assert.equal(store.data.tasks[0].text, "Keep this draft");
  assert.equal(store.dirty, true);
});

test("invalid cloud data is rejected without replacing the current draft", async () => {
  const db = database();
  const store = new VaultStore(db, "owner");
  await store.load();
  const bad = emptyVault();
  bad.notes.push({
    id: "note",
    categoryId: "missing",
    title: "",
    body: "",
    updatedAt: "bad-date",
  });
  db.rows.set("owner", { data: bad, revision: 1 });
  await assert.rejects(store.load(), /unsupported format/);
  assert.deepEqual(store.data, emptyVault());
  const duplicate = emptyVault();
  duplicate.categories.push({ id: "inbox", name: "Duplicate" });
  assert.throws(() => validateVault(duplicate), /unsupported format/);
});
