import { ScheduledBroadcastViewPageData } from "@/app/(admin)/newsletters/view-scheduled-broadcast/types/scheduled-broadcast-view.type";

export const scheduledBroadcastViewData: ScheduledBroadcastViewPageData = {
  header: {
    title: "View Scheduled Broadcast",
    subtitle: "Review details for the upcoming clinical communication",
    status: "scheduled",
  },

  overviewStats: [
    {
      key: "recipients",
      label: "Recipients",
      value: "2,450",
      helper: "Subscribers & Fellows",
    },
    {
      key: "scheduled_for",
      label: "Scheduled For",
      value: "Nov 22, 2026",
      helper: "at 09:00 AM CST",
    },
    {
      key: "frequency",
      label: "Frequency",
      value: "Weekly",
      helper: "Friday Morning Anchor",
    },
  ],

  contentOverview: {
    subjectLine:
      "Administrative Update: Upcoming Clinical Rotation & Pediatric Research Review",
    preHeader:
      "Essential updates for the Q4 clinical cycle and latest findings from the pediatric airway department.",
  },

  messageContent: {
    greetingPrefix: "Dear ",
    personalizationTag: "{{Student_Name}}",
    greetingSuffix: ",",
    introParagraph:
      "This administrative update contains critical information regarding the upcoming clinical rotation schedule and the newly released research paper on Pediatric Airway Management Advances.",
    sectionTitle: "Clinical Rotation Updates",
    sectionParagraph:
      "Please review the attached PDF for the full rotation schedule starting next month. Ensure all credentialing paperwork is submitted by Friday.",
    quote:
      '"The advancement of patient safety in pediatric care relies heavily on the rigid application of standardized airway protocols."',
    closingLine: "Best regards,",
    signature: "Institutional Board, Texas Airway Institute",
  },

  deliveryLogistics: {
    selectedCadenceLabel: "Weekly Broadcast",
    selectedCadenceSubLabel: "Every Friday at 09:00 AM",
    availableCadenceDate: "Friday, Nov 22, 2026",
    scheduledTime: "09:00 AM CST",
    timeHint: "Time is fixed according to global cadence settings.",
  },

  audienceTargets: [
    { id: "all_subscribers", label: "All Subscribers" },
    { id: "anesthesiologists", label: "Anesthesiologists" },
    { id: "clinical_fellows", label: "Clinical Fellows" },
  ],

  attachments: [
    {
      id: "att-1",
      fileName: "Clinical_Rotation_Schedule.pdf",
      meta: "2.4 MB • PDF Document",
      type: "pdf",
    },
    {
      id: "att-2",
      fileName: "Airway_Diagram_V2.png",
      meta: "1.1 MB • PNG Image",
      type: "image",
    },
  ],
};
