
export type CourseDeliveryType = "inPerson" | "online" | "completed";

export type CourseDetailsHeroProps = {
  badges: string[]; // ["IN-PERSON WORKSHOP", "6.0 CME CREDITS"]
  title: string; // "Advanced Difficult Airway Workshop"
  imageSrc: string;
};

export type CourseDetailsSummaryProps = {
  organizerLabel: string; // "Registered Course"
  organizerText: string;
  chips: Array<{ iconKey: "clock" | "pin" | "users"; text: string }>;

  session: {
    venueTitle: string; // "Houston, TX"
    dayText: string; // "Mar 12"
    timeText: string; // "10:30 AM - 6:00 PM"
    ctaLabel: string; // "Add to Calendar"
  };
};

export type CourseAboutCardProps = {
  title: string; // "About this Course"
  paragraphs: string[];
};

export type CourseBookingDetailsCardProps = {
  status: {
    label: string;   // "STATUS"
    value: string;   // "Booked for: 2 People"
  };

  payment: {
    label: string;   // "TOTAL PAYMENT"
    title: string;   // "Total Fee"
    amount: string;  // "$450.00"
    refundNote: string;
  };

  refund: {
    label: string;   // "Refund"
  };
};

export type CourseScheduleItem = {
  id: string;

  dayLabel: string;        // "TUESDAY, MAR 12"
  dayIndex?: number;       // 1,2,3 (optional)
  dayState?: "done" | "active" | "upcoming"; // for left big marker

  timeRange: string;       // "10:30 AM"
  partLabel?: string;      // "PART A: THEORY"
  badgeText?: string;      // "(COMPLETED)" | "(CURRENT)"
  title: string;
  subtitle: string;

  status: "done" | "active" | "upcoming";
};

export type CourseCheckinCardProps = {
  title: string; // "Workshop Check-in"
  subtitle: string;
  qrImageSrc: string;
  primaryBtnLabel: string; // "How to check-in at venue"
  secondaryBtnLabel: string; // "Download Ticket (PDF)"
  ticketCodeLabel: string; // "Ticket Code"
  ticketCodeValue: string; // "HST-2924"
};

export type CourseHelpCardProps = {
  title: string; // "Need Help?"
  subtitle: string;
  actionLabel: string; // "Contact Support"
};