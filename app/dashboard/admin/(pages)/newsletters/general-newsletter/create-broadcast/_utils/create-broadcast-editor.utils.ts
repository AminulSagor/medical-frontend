export const DEFAULT_CUSTOM_MESSAGE_HTML = "";
export const DEFAULT_CUSTOM_MESSAGE_TEXT = "";

export function applyEditorCommand(command: string, value?: string) {
  if (typeof document === "undefined") return;
  document.execCommand(command, false, value);
}

function unwrapElement(element: Element) {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
}

function replaceElementTag(
  element: Element,
  tagName: keyof HTMLElementTagNameMap,
) {
  const replacement = document.createElement(tagName);

  while (element.firstChild) {
    replacement.appendChild(element.firstChild);
  }

  element.parentNode?.replaceChild(replacement, element);
  return replacement;
}

function hasBlockChildren(element: Element) {
  const blockTags = new Set([
    "P",
    "DIV",
    "UL",
    "OL",
    "LI",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "BLOCKQUOTE",
  ]);

  return Array.from(element.children).some((child) =>
    blockTags.has(child.tagName),
  );
}

export function sanitizeBroadcastHtml(rawHtml: string): string {
  if (typeof window === "undefined") {
    return rawHtml.trim();
  }

  const container = document.createElement("div");
  container.innerHTML = rawHtml;

  container
    .querySelectorAll("script, style, meta")
    .forEach((node) => node.remove());

  container.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();

      const isAllowedAnchorAttribute =
        node.tagName === "A" &&
        ["href", "target", "rel"].includes(attributeName);

      if (
        attributeName.startsWith("data-") ||
        attributeName === "class" ||
        attributeName === "style" ||
        attributeName.startsWith("aria-") ||
        (!isAllowedAnchorAttribute && attributeName !== "contenteditable")
      ) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  container.querySelectorAll("span").forEach((span) => unwrapElement(span));
  container
    .querySelectorAll("b")
    .forEach((node) => replaceElementTag(node, "strong"));
  container
    .querySelectorAll("i")
    .forEach((node) => replaceElementTag(node, "em"));

  container.querySelectorAll("div").forEach((div) => {
    if (hasBlockChildren(div)) {
      unwrapElement(div);
      return;
    }

    replaceElementTag(div, "p");
  });

  container.querySelectorAll("a").forEach((anchor) => {
    const href = anchor.getAttribute("href")?.trim();

    if (!href) {
      unwrapElement(anchor);
      return;
    }

    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  });

  container.querySelectorAll("p").forEach((paragraph) => {
    const text = paragraph.textContent?.replace(/\u00A0/g, " ").trim() || "";
    const hasMeaningfulChild =
      paragraph.querySelector("br, a, strong, em, ul, ol, li") !== null;

    if (!text && !hasMeaningfulChild) {
      paragraph.remove();
    }
  });

  return container.innerHTML
    .replace(/&nbsp;/g, " ")
    .replace(/\s*(<br\s*\/?>\s*){3,}/gi, "<br /><br />")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
}

export function htmlToPlainText(html: string): string {
  if (typeof window === "undefined") {
    return html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const temp = document.createElement("div");
  temp.innerHTML = sanitizeBroadcastHtml(html);
  return temp.innerText.replace(/\n{3,}/g, "\n\n").trim();
}

export function normalizeEditorHtml(html: string): string {
  const sanitized = sanitizeBroadcastHtml(html);

  if (
    sanitized === "<br>" ||
    sanitized === "<p><br></p>" ||
    sanitized === "<p></p>"
  ) {
    return "";
  }

  return sanitized;
}
