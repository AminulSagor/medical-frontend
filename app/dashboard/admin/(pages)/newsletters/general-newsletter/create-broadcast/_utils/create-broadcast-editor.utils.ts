export const DEFAULT_CUSTOM_MESSAGE_HTML = `
<p>Dear {{Student_Name}},</p>
<p>We are pleased to share the finalized clinical rotation schedule for the upcoming winter quarter. Please review the attached documentation carefully as it contains critical updates.</p>
<p><i>Note: All fellows are required to complete their simulation lab hours prior to the commencement of the new rotation cycle.</i></p>
<p>Best regards,<br /><b>Department of Clinical Affairs</b><br />Texas Airway Institute</p>
`.trim();

export const DEFAULT_CUSTOM_MESSAGE_TEXT = `Dear {{Student_Name}},

We are pleased to share the finalized clinical rotation schedule for the upcoming winter quarter. Please review the attached documentation carefully as it contains critical updates.

Note: All fellows are required to complete their simulation lab hours prior to the commencement of the new rotation cycle.

Best regards,
Department of Clinical Affairs
Texas Airway Institute`;

export function applyEditorCommand(command: string, value?: string) {
  if (typeof document === "undefined") return;

  document.execCommand(command, false, value);
}

export function htmlToPlainText(html: string): string {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.innerText.replace(/\n{3,}/g, "\n\n").trim();
}

export function normalizeEditorHtml(html: string): string {
  return html.trim() === "<br>" ? "" : html.trim();
}