export function normalizeTimeDisplay(value?: string | null): string {
    if (!value) return "";

    const trimmed = value.trim();
    const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

    if (twentyFourHourMatch) {
        const hour = Number(twentyFourHourMatch[1]);
        const minute = twentyFourHourMatch[2];

        if (!Number.isNaN(hour)) {
            const normalizedHour = hour % 12 || 12;
            const meridiem = hour >= 12 ? "PM" : "AM";
            return `${String(normalizedHour).padStart(2, "0")}:${minute} ${meridiem}`;
        }
    }

    return trimmed
        .replace(/\s*(AM|PM)$/i, " $1")
        .replace(/\s+/g, " ")
        .toUpperCase();
}

export function toNativeTimeValue(value?: string | null): string {
    if (!value) return "";

    const trimmed = value.trim().toUpperCase();
    const meridiemMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

    if (meridiemMatch) {
        const rawHour = Number(meridiemMatch[1]);
        const minute = meridiemMatch[2];
        const meridiem = meridiemMatch[3];

        let hour = rawHour % 12;
        if (meridiem === "PM") hour += 12;

        return `${String(hour).padStart(2, "0")}:${minute}`;
    }

    const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

    if (twentyFourHourMatch) {
        return `${String(Number(twentyFourHourMatch[1])).padStart(2, "0")}:${twentyFourHourMatch[2]}`;
    }

    return "";
}

export function formatLastSavedLabel(lastSavedAt: Date | null): string {
    if (!lastSavedAt) return "Not saved yet";

    const diffMs = Date.now() - lastSavedAt.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "just now";

    if (diffMinutes < 60) {
        return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }

    const hours = lastSavedAt.getHours();
    const minutes = String(lastSavedAt.getMinutes()).padStart(2, "0");
    const normalizedHours = hours % 12 || 12;
    const meridiem = hours >= 12 ? "PM" : "AM";
    const day = lastSavedAt.getDate();
    const month = lastSavedAt.toLocaleString("en-US", { month: "long" });
    const year = lastSavedAt.getFullYear();

    return `${normalizedHours}:${minutes}${meridiem} ${day} ${month}, ${year}`;
}