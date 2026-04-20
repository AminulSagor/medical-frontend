export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

export function stripHtml(value?: string | null): string {
  if (!value) return '';

  return decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+\n/g, '\n')
      .replace(/\n\s+/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
}

export function hasMeaningfulHtmlContent(value?: string | null): boolean {
  return stripHtml(value).length > 0;
}

export function extractListItemsFromHtml(value?: string | null): string[] {
  if (!value) return [];

  const listMatches = Array.from(value.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);

  if (listMatches.length > 0) {
    return listMatches;
  }

  return splitHtmlIntoParagraphs(value);
}

export function splitHtmlIntoParagraphs(value?: string | null): string[] {
  if (!value) return [];

  const normalized = decodeHtmlEntities(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|section|article|ul|ol|li|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  );

  return normalized
    .split(/\n+/)
    .map((item) => item.replace(/[ \t]{2,}/g, ' ').trim())
    .filter(Boolean);
}
