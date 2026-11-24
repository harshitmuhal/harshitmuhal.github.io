export function contentFromText(text) {
  const ops = [];
  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    const heading = line.match(/^(#{1,3}) (.*)$/);
    const task = line.match(/^[-*] \[([ xX])\] (.*)$/);
    const bullet = line.match(/^[-*] (.*)$/);
    const ordered = line.match(/^\d+\. (.*)$/);
    let value = line;
    let attributes;
    if (heading) {
      value = heading[2];
      attributes = { header: heading[1].length };
    } else if (task) {
      value = task[2];
      attributes = { list: task[1] === " " ? "unchecked" : "checked" };
    } else if (bullet || ordered) {
      value = (bullet || ordered)[1];
      attributes = { list: bullet ? "bullet" : "ordered" };
    }
    if (value) ops.push({ insert: value });
    ops.push(attributes ? { insert: "\n", attributes } : { insert: "\n" });
  }
  return { ops };
}

export function validateContent(content) {
  if (!content || !Array.isArray(content.ops) || !content.ops.length)
    return false;
  for (const op of content.ops) {
    if (
      !op ||
      typeof op.insert !== "string" ||
      !op.insert ||
      Object.keys(op).some((key) => !["insert", "attributes"].includes(key))
    )
      return false;
    if (op.attributes !== undefined) {
      if (
        !op.attributes ||
        typeof op.attributes !== "object" ||
        Array.isArray(op.attributes)
      )
        return false;
      for (const [key, value] of Object.entries(op.attributes)) {
        if (
          ["bold", "italic", "strike"].includes(key) &&
          typeof value === "boolean"
        )
          continue;
        if (key === "header" && [1, 2, 3].includes(value)) continue;
        if (
          key === "indent" &&
          Number.isInteger(value) &&
          value >= 1 &&
          value <= 8
        )
          continue;
        if (
          key === "list" &&
          ["bullet", "ordered", "checked", "unchecked"].includes(value)
        )
          continue;
        return false;
      }
    }
  }
  return content.ops.at(-1).insert.endsWith("\n");
}

export function contentText(content) {
  return content.ops
    .map((op) => op.insert)
    .join("")
    .replace(/\n$/, "");
}

export function migrateLegacyTasks(vault, id, updatedAt) {
  if (!vault.tasks.length) return false;
  const content = {
    ops: [
      { insert: "Things to do" },
      { insert: "\n", attributes: { header: 1 } },
      { insert: "\n" },
    ],
  };
  for (const task of vault.tasks) {
    content.ops.push(
      { insert: task.text },
      {
        insert: "\n",
        attributes: { list: task.done ? "checked" : "unchecked" },
      }
    );
  }
  vault.notes.push({
    id,
    categoryId: "inbox",
    title: "Things to do",
    body: contentText(content),
    content,
    updatedAt,
  });
  vault.tasks = [];
  return true;
}
