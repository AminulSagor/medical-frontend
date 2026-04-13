import type { WebinarPlatformOption } from "./workshop-create.types";

export const WEBINAR_PLATFORM_OPTIONS: WebinarPlatformOption[] = [
    { value: "zoom", label: "Zoom" },
    { value: "google_meet", label: "Google Meet" },
    { value: "microsoft_teams", label: "Microsoft Teams" },
    { value: "webex", label: "Cisco Webex" },
    { value: "goto_webinar", label: "GoTo Webinar" },
];