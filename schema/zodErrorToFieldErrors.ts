import type { z } from "zod";

export function zodErrorToFieldErrors<TFields extends Record<string, unknown>>(
  error: z.ZodError
): Partial<Record<keyof TFields, string>> {
  const fieldErrors: Partial<Record<keyof TFields, string>> = {};

  for (const issue of error.issues) {
    const key = issue.path[0] as keyof TFields | undefined;
    if (!key) continue;

    // keep the first error per field (simpler UX)
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }

  return fieldErrors;
}
