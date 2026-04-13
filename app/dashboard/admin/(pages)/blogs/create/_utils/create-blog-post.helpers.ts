type BuildBlogContentParams = {
  title: string;
  excerpt: string;
  coverImageUrl: string;
};

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function countWords(values: string[]) {
  const content = values.join(" ").trim();

  if (!content) return 0;

  return content.split(/\s+/).filter(Boolean).length;
}

export function estimateReadTime(wordCount: number) {
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

export function toggleStringSelection(items: string[], value: string) {
  if (items.includes(value)) {
    return items.filter((item) => item !== value);
  }

  return [...items, value];
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildBlogPostHtmlContent({
  title,
  excerpt,
  coverImageUrl,
}: BuildBlogContentParams) {
  const safeTitle = escapeHtml(title.trim() || "Untitled Post");
  const safeExcerpt = escapeHtml(
    excerpt.trim() ||
      "Effective airway management in pediatric patients remains one of the most critical skills for emergency physicians and anesthesiologists.",
  );
  const safeCoverImageUrl = escapeHtml(coverImageUrl.trim());

  return `
    <article>
      <figure>
        <img src="${safeCoverImageUrl}" alt="${safeTitle}" />
      </figure>
      <h1>${safeTitle}</h1>
      <p>${safeExcerpt}</p>
      <h2>Anatomical Considerations</h2>
      <p>
        The pediatric larynx is situated higher in the neck, typically at the level of C3-C4 in infants,
        compared to C4-C5 in adults. This anterior and superior position can make visualization of the
        glottic opening more difficult during direct laryngoscopy.
      </p>
      <p>
        Furthermore, the epiglottis in young children is relatively large, floppy, and omega-shaped,
        often obscuring the view of the vocal cords.
      </p>
      <figure>
        <img src="${safeCoverImageUrl}" alt="Advanced pediatric airway equipment set layout" />
        <figcaption>Figure 1: Advanced pediatric airway equipment set layout.</figcaption>
      </figure>
      <h2>Recent Clinical Guidelines</h2>
      <p>
        The latest guidelines from the Pediatric Airway Association emphasize the importance of early
        recognition of difficult airways. Pre-oxygenation strategies have also been updated to include
        high-flow nasal cannula therapy during the apneic phase.
      </p>
    </article>
  `.trim();
}

export function buildScheduledPublishDateFromDisplay(
  dateLabel: string,
  timeLabel: string,
) {
  const parsed = new Date(`${dateLabel} ${timeLabel}`);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

export function buildScheduledPublishDateFromInputs(
  date: string,
  time: string,
) {
  if (!date || !time) {
    return undefined;
  }

  return new Date(`${date}T${time}:00`).toISOString();
}

export const toggleStringItem = (items: string[], value: string): string[] => {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
};
