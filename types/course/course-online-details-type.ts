export type OnlineHeroProps = {
    title: string;
    subtitle: string;
    badges: string[]; // ["ONLINE WORKSHOP", "12.0 CME CREDITS"]
    coverImageSrc?: string; // optional if you use real image later
};

export type OnlineSummaryStripProps = {
  statusPillText: string;

  // like in-person top paragraph
  description?: string;

  // bottom strip (online + instructor)
  instructorText: string;

  // right top blue pill
  sessionCard?: {
    dateRange: string; // "MAR 12 - 14"
    label: string;     // "3-DAY WORKSHOP"
    time: string;      // "10:30 AM - 01:00 PM"
  };

  addToCalendarLabel: string;
};

export type OnlineAboutCardProps = {
    heading: string; // "ABOUT THIS COURSE"
    paragraph: string;
    highlights: Array<{ iconKey: "check"; text: string }>;
};

export type OnlineTechnicalRequirement = {
    iconKey: "wifi" | "camera" | "mic";
    title: string;
    desc: string;
};

export type OnlineTechnicalRequirementsCardProps = {
    heading: string; // "TECHNICAL REQUIREMENTS"
    items: OnlineTechnicalRequirement[];
};

export type OnlineBookingCardProps = {
    heading: string; // "BOOKING DETAILS"
    bookedText: string; // "Booked for: 1 Attendee"
    joinLiveLabel: string; // "Join Live Room"
    totalFeeLabel: string; // "Total Fee:"
    totalFeeValue: string; // "$550.00"
    refundLabel: string; // "Request Refund"
    refundNote: string;
};

export type OnlineScheduleDayKey = "day1" | "day2" | "day3";

export type OnlineScheduleItem = {
    id: string;
    day: OnlineScheduleDayKey;
    partLabel: string; // "PART A: THEORY"
    timeText: string; // "10:30 AM - 11:30 AM"
    title: string;
    subtitle: string;
    status: "completed" | "live" | "upcoming";
    joinLiveLabel?: string; // only for live
};

export type OnlineScheduleProps = {
    heading: string; // "ONLINE COURSE SCHEDULE"
    days: Array<{ key: OnlineScheduleDayKey; label: string }>; // Day 1/2/3
    items: OnlineScheduleItem[];
};

export type OnlineSidebarHelpProps = {
    title: string; // "Need Tech Help?"
    subtitle: string;
    actionLabel: string; // "Contact Support"
};

export type OnlineRegistrationPreferenceProps = {
    heading: string;
    value: string; // "ONL-0981-AOW"
};

export type OnlinePrepMaterial = {
    title: string; // "Algorithm Handbook.pdf"
    sub?: string; // optional
};

export type OnlinePrepMaterialsProps = {
    heading: string; // "PREPARATION MATERIALS"
    items: OnlinePrepMaterial[];
};

export type OnlineDetailsViewProps = {
    hero: OnlineHeroProps;
    summary: OnlineSummaryStripProps;
    about: OnlineAboutCardProps;
    requirements: OnlineTechnicalRequirementsCardProps;
    booking: OnlineBookingCardProps;
    schedule: OnlineScheduleProps;
    supportAndRegistration: OnlineSupportAndRegistrationCardProps;

    materials: OnlinePrepMaterialsProps;
};

export type OnlineSupportAndRegistrationCardProps = {
    help: {
        title: string;
        subtitle: string;
        actionLabel: string; // "Contact Support"
    };
    registration: {
        heading: string; // "REGISTRATION REFERENCE"
        value: string;   // "#ONL-9981-ADW"
    };
};