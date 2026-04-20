export function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export function benefitTone(tone: "teal" | "blue" | "purple" | "orange") {
    if (tone === "blue") {
        return "bg-blue-50 text-blue-600 ring-1 ring-blue-200/60";
    }

    if (tone === "purple") {
        return "bg-purple-50 text-purple-600 ring-1 ring-purple-200/60";
    }

    if (tone === "orange") {
        return "bg-orange-50 text-orange-600 ring-1 ring-orange-200/60";
    }

    return "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15";
}