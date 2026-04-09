import type {
  OnlineDetailsViewProps,
  OnlineScheduleDayKey,
} from "@/types/user/course/course-online-details-type";

export function getOnlineDetailsSeed(
  _courseId: string,
): OnlineDetailsViewProps {
  return {
    hero: {
      title: "Advanced Difficult Airway Workshop",
      subtitle:
        "Comprehensive 3-day virtual intensive for complex airway management scenarios.",
      badges: ["ONLINE WORKSHOP", "12.0 CME CREDITS"],
      coverImageSrc: "/photos/child.png",
    },

    summary: {
      statusPillText: "ONLINE REGISTRATION CONFIRMED",
      description:
        "Comprehensive 3-day virtual intensive for complex airway management scenarios.",
      instructorText: "Lead Instructor: Dr. Alan Grant",
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
        "This advanced workshop is designed for anesthesia providers, emergency physicians, and critical care specialists. The curriculum focuses on the latest evidence-based algorithms for managing the predicted and unpredicted difficult airway in both adult and pediatric populations.",
      highlights: [
        { iconKey: "check", text: "Includes Digital Handbook & Case Studies" },
        { iconKey: "check", text: "Interactive Q&A with Global Experts" },
        {
          iconKey: "check",
          text: "Accredited for 12 AMA PRA Category 1 Credits",
        },
        { iconKey: "check", text: "Recorded Sessions for Post-Event Review" },
      ],
    },

    requirements: {
      heading: "TECHNICAL REQUIREMENTS",
      items: [
        {
          iconKey: "wifi",
          title: "Stable Internet",
          desc: "Minimum 10 Mbps recommended.",
        },
        {
          iconKey: "camera",
          title: "HD Web Camera",
          desc: "Required for participation.",
        },
        {
          iconKey: "mic",
          title: "Noise-Canceling Mic",
          desc: "Recommended for clarity.",
        },
      ],
    },

    booking: {
      heading: "BOOKING DETAILS",
      bookedText: "Booked for: 1 Attendee",
      joinLiveLabel: "Join Live Room",
      totalFeeLabel: "Total Fee:",
      totalFeeValue: "$550.00",
      refundLabel: "Request Refund",
      refundNote: "Refunds are available up to 48 hours before the event.",
    },

    schedule: {
      heading: "ONLINE COURSE SCHEDULE",
      days: [
        { key: "day1", label: "Day 1" },
        { key: "day2", label: "Day 2" },
        { key: "day3", label: "Day 3" },
      ],
      items: [
        {
          id: "d1a",
          day: "day1",
          partLabel: "PART A: THEORY",
          timeText: "10:30 AM - 11:30 AM",
          title: "Anatomical Predictions & Assessment",
          subtitle:
            "Deep dive into airway anatomy and the latest assessment scores for predicting difficulty.",
          status: "completed",
        },
        {
          id: "d1b",
          day: "day1",
          partLabel: "PART B: PRACTICAL",
          timeText: "11:45 AM - 01:00 PM",
          title: "Virtual Simulation: Algorithm Navigation",
          subtitle:
            "Interactive software-based simulation of ASA Difficult Airway Algorithm decision points.",
          status: "live",
          joinLiveLabel: "JOIN LIVE",
        },
        {
          id: "d2a",
          day: "day2",
          partLabel: "DAY 2: ADVANCED EQUIPMENT & DEVICES",
          timeText: "10:30 AM - 11:30 AM",
          title: "Advanced Equipment & Devices",
          subtitle: "Schedule unlocks at completion of Day 1.",
          status: "upcoming",
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
      items: [
        { title: "Algorithm Handbook.pdf" },
        { title: "Pre-course Video Module" },
      ],
    },
  };
}
