import type { OnlineDetailsViewProps } from "@/types/user/course/course-online-details-type";

export function getOnlineDetailsSeed(courseId: string): OnlineDetailsViewProps {
  return {
    hero: {
      title: "Advanced Difficult Airway Workshop",
      subtitle:
        "Comprehensive 3-day virtual intensive for complex airway management scenarios.",
      badges: ["ONLINE WORKSHOP", "12.0 CME CREDITS"],
      coverImageSrc: "/photos/child.png",
    },
    summary: {
      courseId,
      imageSrc: "/photos/child.png",
      eventTitle: "Advanced Difficult Airway Workshop",
      statusPillText: "ONLINE REGISTRATION CONFIRMED",
      description:
        "Comprehensive 3-day virtual intensive for complex airway management scenarios.",
      instructorText: "Dr. Alan Grant",
      platformText: "Zoom",
      addToCalendarLabel: "Add to Calendar",
      sessionCard: {
        dateRange: "MAR 12 - 14",
        label: "3-DAY WORKSHOP",
        time: "10:30 AM - 01:00 PM",
      },
    },
    about: {
      heading: "ABOUT THIS COURSE",
      paragraph:
        "This advanced workshop is designed for anesthesia providers, emergency physicians, and critical care specialists.",
      highlights: [
        { iconKey: "check", text: "Includes Digital Handbook & Case Studies" },
      ],
    },
    requirements: {
      heading: "TECHNICAL REQUIREMENTS",
      items: [
        { iconKey: "wifi", title: "Stable Internet", desc: "Minimum 10 Mbps recommended." },
        { iconKey: "camera", title: "HD Web Camera", desc: "Required for participation." },
        { iconKey: "mic", title: "Noise-Canceling Mic", desc: "Recommended for clarity." },
      ],
    },
    booking: {
      courseId,
      heading: "BOOKING DETAILS",
      bookedText: "Booked for: 1 Attendee",
      joinLiveLabel: "Join Live Room",
      totalFeeLabel: "Total Fee:",
      totalFeeValue: "$550.00",
      refundLabel: "Request Refund",
      refundNote: "Refunds are available up to 48 hours before the event.",
      refundEnabled: true,
      refundTitle: "Refund Available",
      refundDescription: "Refunds are available up to 48 hours before the event.",
      refundAmount: "$550.00",
      daysBeforeStart: 2,
      courseTitle: "Advanced Difficult Airway Workshop",
      courseDateText: "MAR 12 - 14",
    },
    schedule: {
      heading: "ONLINE COURSE SCHEDULE",
      days: [
        { key: "day1", label: "Day 1" },
        { key: "day2", label: "Day 2" },
      ],
      items: [
        {
          id: "d1a",
          day: "day1",
          partLabel: "PART A: THEORY",
          timeText: "10:30 AM - 11:30 AM",
          title: "Anatomical Predictions & Assessment",
          subtitle: "Deep dive into airway anatomy and the latest assessment scores.",
          status: "completed",
        },
        {
          id: "d1b",
          day: "day1",
          partLabel: "PART B: PRACTICAL",
          timeText: "11:45 AM - 01:00 PM",
          title: "Virtual Simulation",
          subtitle: "Interactive software-based simulation.",
          status: "live",
          joinLiveLabel: "JOIN LIVE",
        },
      ],
    },
    supportAndRegistration: {
      help: {
        title: "Need Tech Help?",
        subtitle: "Trouble accessing links?",
        actionLabel: "Contact Support",
      },
      registration: {
        heading: "REGISTRATION REFERENCE",
        value: "#ONL-9981-ADW",
      },
    },
    materials: {
      heading: "PREPARATION MATERIALS",
      items: [{ title: "Algorithm Handbook.pdf" }],
    },
  };
}
