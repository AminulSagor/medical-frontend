import { CourseAnnouncementBroadcastDetails } from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";

export const test: CourseAnnouncementBroadcastDetails = {
  header: {
    title: "Broadcast Announcement",
    cohort: {
      id: "dbc8d3bd-4a73-43f4-9f66-ba337088b54f",
      name: "Advanced Surgical Techniques Workshop",
    },
    scheduledDate: "2026-04-15T00:00:00.000Z",
    systemReady: false,
  },
  form: {
    priority: "GENERAL_UPDATE",
    subjectLine: "Course Announcement",
    messageBodyHtml: "<p></p>",
    messageBodyText: null,
    pushToStudentPanel: false,
  },
  recipients: {
    recipientMode: "ALL",
    totalInCohort: 0,
    selectedCount: 0,
    preview: [],
  },
  attachments: [],
  status: "DRAFT",
  actionsAllowed: {
    send: true,
    edit: true,
  },
};
