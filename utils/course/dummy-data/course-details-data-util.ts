import type {
  CourseDetailsHeroProps,
  CourseDetailsSummaryProps,
  CourseAboutCardProps,
  CourseBookingDetailsCardProps,
  CourseScheduleItem,
  CourseCheckinCardProps,
  CourseHelpCardProps,
} from "@/types/course/course-details-type";

export function getCourseDetailsHeroSeed(_courseId: string): CourseDetailsHeroProps {
  return {
    badges: ["IN-PERSON WORKSHOP", "6.0 CME CREDITS"],
    title: "Advanced Difficult Airway Workshop",
    imageSrc: "/photos/child.png",
  };
}

export function getCourseDetailsSummarySeed(_courseId: string): CourseDetailsSummaryProps {
  return {
    organizerLabel: "Registered Course",
    organizerText:
      "Texas Airway Institute training for complex airway management scenarios. Master the latest techniques with hands-on practice.",
    chips: [
      { iconKey: "clock", text: "10:30 AM – 6:00 PM" },
      { iconKey: "pin", text: "Houston, TX" },
      { iconKey: "users", text: "Booked: 2 People" },
    ],
    session: {
      venueTitle: "Houston, TX",
      dayText: "Mar 12",
      timeText: "10:30 AM - 6:00 PM",
      ctaLabel: "Add to Calendar",
    },
  };
}

export function getCourseAboutSeed(_courseId: string): CourseAboutCardProps {
  return {
    title: "About this Course",
    paragraphs: [
      "This comprehensive workshop is designed for anesthesia professionals looking to master advanced airway techniques through intensive hands-on simulation training.",
      "Participants will engage with state-of-the-art simulation equipment and high-fidelity manikins to practice fiberoptic intubation, surgical airway access, video laryngoscopy, and emergency algorithms.",
    ],
  };
}

export function getCourseBookingDetailsSeed(
  _courseId: string
): CourseBookingDetailsCardProps {
  return {
    status: {
      label: "STATUS",
      value: "Booked for: 2 People",
    },

    payment: {
      label: "TOTAL PAYMENT",
      title: "Total Fee",
      amount: "$450.00",
      refundNote:
        "Refunds are available up to 48 hours before the event.",
    },

    refund: {
      label: "Refund",
    },
  };
}

export function getCourseScheduleSeed(_courseId: string): CourseScheduleItem[] {
  return [
    {
      id: "t1",
      dayLabel: "TUESDAY, MAR 12",
      timeRange: "10:30 AM",
      partLabel: "PART A: THEORY",
      badgeText: "(COMPLETED)",
      title: "Core Concepts & Clinical Orientation",
      subtitle:
        "Focus on baseline knowledge, airway algorithm review, and equipment familiarization.",
      status: "done",
    },
    {
      id: "t2",
      dayLabel: "TUESDAY, MAR 12",
      timeRange: "11:45 AM",
      partLabel: "PART B: PRACTICAL",
      badgeText: "(COMPLETED)",
      title: "Initial Simulation Maneuvers",
      subtitle:
        "Introduction to high-fidelity manikins and standard intubation techniques.",
      status: "done",
    },
    {
      id: "w1",
      dayLabel: "WEDNESDAY, MAR 13",
      timeRange: "10:30 AM",
      partLabel: "PART A: ADVANCED TECHNIQUES",
      badgeText: "(COMPLETED)",
      title: "Fiberoptic & Video Laryngoscopy",
      subtitle:
        "Demonstration and guided practice of specialized airway devices.",
      status: "done",
    },
    {
      id: "w2",
      dayLabel: "WEDNESDAY, MAR 13",
      timeRange: "11:45 AM",
      partLabel: "PART B: CRISIS MANAGEMENT",
      badgeText: "(CURRENT)",
      title: "Complex Scenario Drills",
      subtitle:
        "High-fidelity simulations focusing on CICV emergency protocols.",
      status: "active",
    },
    {
      id: "th1",
      dayLabel: "THURSDAY, MAR 14",
      timeRange: "10:30 AM",
      partLabel: "PART A: ASSESSMENT",
      title: "Practical Competency Check",
      subtitle:
        "Individual skill assessments under lead clinical instructors.",
      status: "upcoming",
    },
    {
      id: "th2",
      dayLabel: "THURSDAY, MAR 14",
      timeRange: "12:15 PM",
      partLabel: "PART B: WRAP-UP",
      title: "Debrief & Certification",
      subtitle: "Final clinical pearls and distribution of certificates.",
      status: "upcoming",
    },
  ];
}

export function getCourseCheckinSeed(_courseId: string): CourseCheckinCardProps {
  return {
    title: "Workshop Check-in",
    subtitle: "Present this QR code at the venue entrance for check-in.",
    qrImageSrc: "/photos/qr.png",
    primaryBtnLabel: "How to check-in at venue",
    secondaryBtnLabel: "Download Ticket (PDF)",
    ticketCodeLabel: "Ticket Code",
    ticketCodeValue: "HST-2924",
  };
}

export function getCourseHelpSeed(_courseId: string): CourseHelpCardProps {
  return {
    title: "Need Help?",
    subtitle: "Having trouble finding the venue or joining the workshop?",
    actionLabel: "Contact Support",
  };
}