import type { ThemeDropdownOption } from "@/app/dashboard/admin/(pages)/users/faculty/register-faculty/_components/theme-dropdown";

export type DeliveryMode = "in_person" | "online";

export type Segment = {
    id: string;
    topic: string;
    details: string;
    date: string;
    startTime: string;
    endTime: string;
};

export type DayAgenda = {
    id: string;
    label: string;
    segments: Segment[];
};

export type FacultyChip = {
    id: string;
    name: string;
    role: string;
};

export type WebinarPlatform =
    | "zoom"
    | "google_meet"
    | "microsoft_teams"
    | "webex"
    | "goto_webinar";

export type FacilityLocation = string;

export type WebinarPlatformOption = ThemeDropdownOption<WebinarPlatform>;