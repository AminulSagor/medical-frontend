import type { DayAgenda, FacultyChip } from "./workshop-create.types";
import { uid } from "./workshop-create.helpers";

export const INITIAL_DAYS: DayAgenda[] = [
    {
        id: uid("day"),
        label: "Day 1 Agenda",
        segments: [
            {
                id: uid("seg"),
                topic: "",
                details: "",
                date: "11/15/2024",
                startTime: "08:00 AM",
                endTime: "12:00 PM",
            },
            {
                id: uid("seg"),
                topic: "",
                details: "",
                date: "11/15/2024",
                startTime: "01:00 PM",
                endTime: "05:00 PM",
            },
        ],
    },
    {
        id: uid("day"),
        label: "Day 2 Agenda",
        segments: [
            {
                id: uid("seg"),
                topic: "",
                details: "",
                date: "11/16/2024",
                startTime: "09:00 AM",
                endTime: "03:00 PM",
            },
        ],
    },
];

export const INITIAL_SELECTED_FACULTY: FacultyChip[] = [
    { id: uid("fac"), name: "Dr. Sarah Chen", role: "LEAD" },
    { id: uid("fac"), name: "James Wilson, RN", role: "ASSISTANT" },
];