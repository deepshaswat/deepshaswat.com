/**
 * Server-side converter: BlockNote JSON → email-safe inline-styled HTML.
 *
 * Parses raw JSON from BlockNote and converts each block to inline-styled HTML
 * suitable for email clients (no CSS classes, no external stylesheets).
 *
 * Adapted from stockbook-monorepo with dark theme colors to match
 * the existing NewsletterTemplate (white text on dark background).
 */

// ── Types ──────────────────────────────────────────────────

interface InlineStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  textColor?: string;
  backgroundColor?: string;
}

interface TextContent {
  type: "text";
  text: string;
  styles: InlineStyle;
}

interface LinkContent {
  type: "link";
  href: string;
  content: TextContent[];
}

type InlineContent = TextContent | LinkContent;

interface Block {
  type: string;
  props: Record<string, unknown>;
  content?: InlineContent[] | string;
  children?: Block[];
}

// ── Inline content → HTML ──────────────────────────────────

function renderInlineContent(items: InlineContent[]): string {
  if (!items || !Array.isArray(items)) return "";

  return items
    .map((item) => {
      if (item.type === "text") {
        let html = escapeHtml(item.text);
        const s = item.styles || {};
        if (s.bold) html = `<strong>${html}</strong>`;
        if (s.italic) html = `<em>${html}</em>`;
        if (s.underline)
          html = `<span style="text-decoration:underline;">${html}</span>`;
        if (s.strikethrough)
          html = `<span style="text-decoration:line-through;">${html}</span>`;
        if (s.code)
          html = `<code style="background-color:#1e293b;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em;color:#e2e8f0;">${html}</code>`;
        return html;
      }
      if (item.type === "link") {
        const inner = renderInlineContent(item.content || []);
        return `<a href="${escapeAttr(item.href)}" style="color:#3b82f6;text-decoration:underline;" target="_blank">${inner}</a>`;
      }
      return "";
    })
    .join("");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text: string): string {
  return text.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ── Block → HTML ───────────────────────────────────────────

function blockToHtml(block: Block): string {
  const alignment =
    (block.props?.textAlignment as string) === "center"
      ? "center"
      : (block.props?.textAlignment as string) === "right"
        ? "right"
        : "left";

  const content = Array.isArray(block.content)
    ? renderInlineContent(block.content as InlineContent[])
    : "";

  switch (block.type) {
    case "paragraph": {
      if (!content.trim()) return "<br />";
      return `<p style="margin:16px 0;line-height:1.6;font-size:16px;color:#ffffff;text-align:${alignment};">${content}</p>`;
    }

    case "heading": {
      const level = (block.props?.level as number) || 1;
      const sizes: Record<number, string> = {
        1: "28px",
        2: "24px",
        3: "20px",
      };
      const fontSize = sizes[level] || "20px";
      return `<h${level} style="margin:24px 0 12px;font-size:${fontSize};font-weight:bold;color:#ffffff;text-align:${alignment};">${content}</h${level}>`;
    }

    case "bulletListItem": {
      const childrenHtml = renderChildren(block.children);
      return `<li style="margin:6px 0;line-height:1.6;font-size:16px;color:#ffffff;">${content}${childrenHtml}</li>`;
    }

    case "numberedListItem": {
      const childrenHtml = renderChildren(block.children);
      return `<li style="margin:6px 0;line-height:1.6;font-size:16px;color:#ffffff;">${content}${childrenHtml}</li>`;
    }

    case "checkListItem": {
      const checked = block.props?.checked as boolean;
      const icon = checked ? "&#9745;" : "&#9744;";
      return `<p style="margin:6px 0;line-height:1.6;font-size:16px;color:#ffffff;">${icon} ${content}</p>`;
    }

    case "image": {
      const src = block.props?.url as string;
      const alt = (block.props?.caption as string) || "";
      const width = (block.props?.width as number) || 600;
      if (!src) return "";
      return `<div style="text-align:${alignment};margin:16px 0;">
  <img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" width="${width}" style="max-width:100%;height:auto;border-radius:8px;" />
  ${alt ? `<p style="margin:8px 0 0;font-size:13px;color:#a3a3a3;text-align:center;">${escapeHtml(alt)}</p>` : ""}
</div>`;
    }

    case "codeBlock": {
      const code =
        typeof block.content === "string" ? escapeHtml(block.content) : content;
      return `<pre style="background-color:#1e293b;padding:16px;border-radius:8px;overflow-x:auto;color:#e2e8f0;font-family:monospace;font-size:14px;line-height:1.5;margin:16px 0;">${code}</pre>`;
    }

    case "table": {
      return renderTable(block);
    }

    case "youtube": {
      const ytSrc = block.props?.url as string;
      if (ytSrc) return renderYouTubeEmbed(ytSrc);
      return "";
    }

    case "video": {
      const videoUrl = block.props?.url as string;
      const caption = (block.props?.caption as string) || "";
      if (!videoUrl) return "";
      return `<table style="width:100%;border-spacing:0;margin:16px 0;">
  <tr>
    <td style="text-align:center;">
      <a href="${escapeAttr(videoUrl)}" target="_blank" style="text-decoration:none;">
        <div style="background-color:#000000;border-radius:8px;padding:40px;text-align:center;">
          <p style="margin:0;color:#ffffff;font-size:14px;font-weight:500;">Click to watch video</p>
          ${caption ? `<p style="margin:8px 0 0;color:#666666;font-size:12px;">${escapeHtml(caption)}</p>` : ""}
        </div>
      </a>
    </td>
  </tr>
</table>`;
    }

    case "callout": {
      const bgColor = (block.props?.bgColor as string) || "#1e293b";
      const textColor = (block.props?.textColor as string) || "#ffffff";
      const showEmoji = block.props?.showEmoji as boolean;
      const emoji = (block.props?.emoji as string) || "";
      const text = (block.props?.text as string) || content;
      return `<table style="width:100%;border-spacing:0;margin:16px 0;">
  <tr>
    <td style="background-color:${bgColor};color:${textColor};padding:16px;border-radius:8px;">
      ${showEmoji ? `<span style="margin-right:8px;font-size:1.2em;">${emoji}</span>` : ""}${text}
    </td>
  </tr>
</table>`;
    }

    case "divider": {
      return `<hr style="border:none;border-top:1px solid #333333;margin:24px 0;" />`;
    }

    case "markdown": {
      const mdContent = (block.props?.content as string) || "";
      return `<pre style="background-color:#1e293b;padding:16px;border-radius:8px;overflow-x:auto;color:#e2e8f0;font-family:monospace;font-size:14px;line-height:1.5;margin:16px 0;">${escapeHtml(mdContent)}</pre>`;
    }

    default:
      // Fallback for unknown block types — render content if available
      if (content) {
        return `<div style="margin:12px 0;font-size:16px;color:#ffffff;text-align:${alignment};">${content}</div>`;
      }
      return "";
  }
}

// ── Helpers ─────────────────────────────────────────────────

function renderChildren(children?: Block[]): string {
  if (!children || children.length === 0) return "";
  return `<ul style="margin:4px 0 4px 20px;padding:0;">${children.map(blockToHtml).join("")}</ul>`;
}

function renderTable(block: Block): string {
  const rows = block.content as unknown as {
    cells: InlineContent[][];
  }[];
  if (!rows || !Array.isArray(rows)) return "";

  const tableRows = rows
    .map((row) => {
      const cells = row.cells || [];
      const tds = cells
        .map(
          (cell) =>
            `<td style="padding:10px 12px;border:1px solid #333333;font-size:14px;color:#ffffff;">${renderInlineContent(cell)}</td>`,
        )
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");

  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;background-color:#111111;">${tableRows}</table>`;
}

function renderYouTubeEmbed(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  let videoId: string | null = null;
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) {
      videoId = m[1];
      break;
    }
  }
  if (!videoId) return "";

  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  return `<table style="width:100%;border-spacing:0;margin:16px 0;">
  <tr>
    <td style="text-align:center;">
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" style="display:inline-block;text-decoration:none;">
        <img src="${thumbnail}" alt="YouTube Video" style="max-width:100%;height:auto;border-radius:8px;" />
        <p style="margin:8px 0 0;color:#3b82f6;text-align:center;font-size:14px;font-weight:bold;">▶ Watch on YouTube</p>
      </a>
    </td>
  </tr>
</table>`;
}

// ── Group consecutive list items ───────────────────────────

function groupListItems(blocks: Block[]): string {
  const parts: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i]!;

    if (block.type === "bulletListItem") {
      const items: string[] = [];
      while (i < blocks.length && blocks[i]!.type === "bulletListItem") {
        items.push(blockToHtml(blocks[i]!));
        i++;
      }
      parts.push(
        `<ul style="margin:12px 0;padding-left:24px;color:#ffffff;">${items.join("")}</ul>`,
      );
      continue;
    }

    if (block.type === "numberedListItem") {
      const items: string[] = [];
      while (i < blocks.length && blocks[i]!.type === "numberedListItem") {
        items.push(blockToHtml(blocks[i]!));
        i++;
      }
      parts.push(
        `<ol style="margin:12px 0;padding-left:24px;color:#ffffff;">${items.join("")}</ol>`,
      );
      continue;
    }

    parts.push(blockToHtml(block));
    i++;
  }

  return parts.join("\n");
}

// ── Public API ──────────────────────────────────────────────

/**
 * Convert BlockNote JSON content (string or parsed array) to email-safe HTML.
 * Server-side pure function — no React hooks, no editor instance.
 * Returns raw HTML string with inline styles for email clients.
 */
export function blocknoteToEmailHtml(content: string | unknown[]): string {
  let blocks: Block[];
  if (typeof content === "string") {
    try {
      blocks = JSON.parse(content) as Block[];
    } catch {
      // Not JSON — treat as plain text
      return `<p style="margin:16px 0;line-height:1.6;font-size:16px;color:#ffffff;">${escapeHtml(content)}</p>`;
    }
  } else {
    blocks = content as Block[];
  }

  if (!Array.isArray(blocks) || blocks.length === 0) return "";

  return groupListItems(blocks);
}
