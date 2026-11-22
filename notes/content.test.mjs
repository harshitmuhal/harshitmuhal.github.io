import test from "node:test";
import assert from "node:assert/strict";
import {
  contentFromText,
  contentText,
  migrateLegacyTasks,
  validateContent,
} from "./content.js";
import { emptyVault, validateVault, VaultStore } from "./vault.js";

test("legacy notes support paragraphs, headings and multiple independent checklists", () => {
  const content = contentFromText(
    "A paragraph\n\n# Work\n- [ ] First\n- [x] Done\n\n## Home\n- [ ] Second\n- A bullet"
  );
  assert.equal(validateContent(content), true);
  assert.deepEqual(
    content.ops.filter((op) => op.attributes).map((op) => op.attributes),
    [
      { header: 1 },
      { list: "unchecked" },
      { list: "checked" },
      { header: 2 },
      { list: "unchecked" },
      { list: "bullet" },
    ]
  );
  assert.equal(
    contentText(content),
    "A paragraph\n\nWork\nFirst\nDone\n\nHome\nSecond\nA bullet"
  );
});

test("plain text and markup-looking text stay literal", () => {
  const text = '<script>alert("literal")</script>\nA <b>thought</b>\n';
  const content = contentFromText(text);
  assert.equal(contentText(content), text);
  assert.equal(validateContent(content), true);
});

test("legacy tasks migrate once into a note without losing completion or existing notes", () => {
  const vault = emptyVault();
  vault.notes.push({
    id: "existing",
    categoryId: "inbox",
    title: "Keep me",
    body: "Original",
    updatedAt: "2026-11-22T00:00:00.000Z",
  });
  vault.tasks.push(
    { id: "a", text: "Open task", done: false },
    { id: "b", text: "Finished task", done: true }
  );
  assert.equal(
    migrateLegacyTasks(vault, "migrated", "2026-11-22T01:00:00.000Z"),
    true
  );
  assert.equal(vault.notes[0].body, "Original");
  assert.equal(vault.notes[1].title, "Things to do");
  assert.deepEqual(
    vault.notes[1].content.ops
      .filter((op) => op.attributes?.list)
      .map((op) => op.attributes.list),
    ["unchecked", "checked"]
  );
  assert.deepEqual(vault.tasks, []);
  assert.equal(
    migrateLegacyTasks(vault, "another", "2026-11-22T01:00:00.000Z"),
    false
  );
  assert.equal(vault.notes.length, 2);
  assert.equal(validateVault(vault), vault);
});

test("rich content rejects embeds and unsupported attributes", () => {
  for (const content of [
    { ops: [{ insert: { image: "https://example.com" } }] },
    {
      ops: [{ insert: "text\n", attributes: { link: "javascript:alert(1)" } }],
    },
    { ops: [{ insert: "text\n", attributes: { header: 7 } }] },
    { ops: [{ insert: "text without a terminal newline" }] },
  ])
    assert.equal(validateContent(content), false);
  const vault = emptyVault();
  vault.notes.push({
    id: "bad",
    categoryId: "inbox",
    title: "",
    body: "",
    content: { ops: [{ insert: { image: "bad" } }] },
    updatedAt: "2026-11-22T00:00:00.000Z",
  });
  assert.throws(() => validateVault(vault), /unsupported format/);
});

test("heading and checklist formatting survive a cloud save and reload", async () => {
  let row = null;
  const client = {
    from() {
      let values;
      const query = {
        select() {
          return query;
        },
        eq() {
          return query;
        },
        insert(value) {
          values = value;
          return query;
        },
        async maybeSingle() {
          if (values) row = structuredClone(values);
          return { data: structuredClone(row), error: null };
        },
      };
      return query;
    },
  };
  const first = new VaultStore(client, "owner");
  await first.load();
  const content = contentFromText(
    "# Today\n- [x] Ship it\n\n## Tomorrow\n- [ ] Next step"
  );
  first.data.notes.push({
    id: "note",
    title: "Plans",
    body: contentText(content),
    content,
    categoryId: "inbox",
    updatedAt: "2026-11-22T00:00:00.000Z",
  });
  first.changed();
  await first.save();
  const second = new VaultStore(client, "owner");
  await second.load();
  assert.deepEqual(second.data.notes[0].content, content);
});
