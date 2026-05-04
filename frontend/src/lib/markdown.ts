/**
 * Minimal, dependency-free markdown → HTML renderer for assistant dispatches.
 * Handles: headings, hr, bold, italic, inline code, code fences, links,
 * lists, GFM-style tables, paragraphs. Escapes HTML in source content.
 * Not a full spec implementation — intentionally tiny.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(s: string): string {
  let out = escapeHtml(s);

  out = out.replace(/`([^`\n]+)`/g, (_m, c) => `<code>${c}</code>`);
  out = out.replace(
    /\[([^\]]+)\]\((https?:[^\s)]+)\)/g,
    (_m, label, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`,
  );
  out = out.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/(^|[\s(])_([^_\n]+)_/g, "$1<em>$2</em>");

  return out;
}

const TABLE_ROW_RE = /^\s*\|(.+)\|\s*$/;
const TABLE_SEP_RE = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/;

function splitRow(line: string): string[] {
  const stripped = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return stripped.split("|").map((c) => c.trim());
}

function parseAlign(sepCells: string[]): Array<"left" | "right" | "center" | "default"> {
  return sepCells.map((c) => {
    const s = c.trim();
    const left = s.startsWith(":");
    const right = s.endsWith(":");
    if (left && right) return "center";
    if (right) return "right";
    if (left) return "left";
    return "default";
  });
}

export function renderMarkdown(input: string): string {
  if (!input) return "";

  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];

  let i = 0;
  let inUL = false;
  let inOL = false;
  let paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length) {
      html.push(`<p>${renderInline(paraBuf.join(" "))}</p>`);
      paraBuf = [];
    }
  };
  const closeLists = () => {
    if (inUL) {
      html.push("</ul>");
      inUL = false;
    }
    if (inOL) {
      html.push("</ol>");
      inOL = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      flushPara();
      closeLists();
      const lang = line.replace(/^```/, "").trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      html.push(`<pre><code${cls}>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line) || /^---+\s*$/.test(line)) {
      flushPara();
      closeLists();
      html.push("<hr />");
      i++;
      continue;
    }

    if (
      TABLE_ROW_RE.test(line) &&
      i + 1 < lines.length &&
      TABLE_SEP_RE.test(lines[i + 1])
    ) {
      flushPara();
      closeLists();
      const headerCells = splitRow(line);
      const aligns = parseAlign(splitRow(lines[i + 1]));
      i += 2;
      const bodyRows: string[][] = [];
      while (i < lines.length && TABLE_ROW_RE.test(lines[i])) {
        bodyRows.push(splitRow(lines[i]));
        i++;
      }
      html.push("<div class=\"md-table-wrap\"><table><thead><tr>");
      headerCells.forEach((c, idx) => {
        const a = aligns[idx] ?? "default";
        const align =
          a === "default" ? "" : ` style="text-align:${a}"`;
        html.push(`<th${align}>${renderInline(c)}</th>`);
      });
      html.push("</tr></thead><tbody>");
      for (const row of bodyRows) {
        html.push("<tr>");
        const cols = Math.max(headerCells.length, row.length);
        for (let k = 0; k < cols; k++) {
          const cell = row[k] ?? "";
          const a = aligns[k] ?? "default";
          const align =
            a === "default" ? "" : ` style="text-align:${a}"`;
          html.push(`<td${align}>${renderInline(cell)}</td>`);
        }
        html.push("</tr>");
      }
      html.push("</tbody></table></div>");
      continue;
    }

    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      closeLists();
      const level = h[1].length;
      html.push(`<h${level}>${renderInline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    const ul = /^[-*+]\s+(.*)$/.exec(line);
    if (ul) {
      flushPara();
      if (inOL) {
        html.push("</ol>");
        inOL = false;
      }
      if (!inUL) {
        html.push("<ul>");
        inUL = true;
      }
      html.push(`<li>${renderInline(ul[1])}</li>`);
      i++;
      continue;
    }

    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ol) {
      flushPara();
      if (inUL) {
        html.push("</ul>");
        inUL = false;
      }
      if (!inOL) {
        html.push("<ol>");
        inOL = true;
      }
      html.push(`<li>${renderInline(ol[1])}</li>`);
      i++;
      continue;
    }

    if (line.trim() === "") {
      flushPara();
      closeLists();
      i++;
      continue;
    }

    paraBuf.push(line.trim());
    i++;
  }

  flushPara();
  closeLists();
  return html.join("\n");
}
