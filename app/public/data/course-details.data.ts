import { CourseDetails } from "@/app/public/types/course.details.types";
import { IMAGE } from "@/constant/image-config";

export const COURSE_DETAILS_DATA: CourseDetails = {
  id: "advanced-difficult-airway",

  hero: {
    title: "Advanced Difficult\nAirway Workshop",
    badges: [
      { label: "3-DAY WORKSHOP", tone: "primary" },
      { label: "12.0 CME CREDITS", tone: "muted" },
    ],
    backgroundSrc: IMAGE.course_details_cover,
    backgroundAlt: "Course cover",
  },

  about: {
    title: "About this Course",
    description:
      "This elite residency-level training program provides clinicians with advanced technical expertise in managing complex airway crises. Through high-fidelity simulation and didactic excellence, we bridge the gap between theory and emergency theater performance.",
  },

  info: [
    {
      key: "location",
      title: "LOCATION",
      lines: ["Houston Sim Center", "Medical District, TX"],
    },
    {
      key: "dates",
      title: "DATES",
      lines: ["March 12 - 14, 2024", "3-Day Intensive"],
    },
    {
      key: "time",
      title: "TIME SLOT",
      lines: ["08:00 AM - 04:00 PM", "Lunch Included"],
    },
  ],

  pricing: {
    feeLabel: "REGISTRATION FEE",
    price: 450,
    perLabel: "Per Participant",
    features: [
      { id: "f1", label: "Full 3-Day Curriculum Access" },
      { id: "f2", label: "Hands-on Sim Lab Materials" },
      { id: "f3", label: "CME Certificate of Completion" },
    ],
    groupSave: {
      title: "GROUP & SAVE",
      oldPrice: 450,
      newPrice: 382.5,
      discountLabel: "15% OFF",
      note: "Special Institutional Pricing for 6+ attendees",
    },
    ctaLabel: "Enroll Now",
    warningLabel: "Only 8 seats remaining!",
    footnote: "LIMITED SLOTS: ONLY 48 AVAILABLE ANNUALLY",
  },

  itinerary: {
    title: "Workshop Itinerary",
    days: [
      {
        dayNumber: 1,
        dayPill: "DAY ONE",
        dateLabel: "TUESDAY, MARCH 12",
        trackLabel: "FOUNDATION & THEORY",
        title: "Core Concepts & Clinical Orientation",
        description:
          "Baseline knowledge assessment, airway algorithm review, and detailed equipment familiarization via high-definition camera feeds.",
        expanded: true,
        schedule: [
          {
            id: "d1s1",
            at: "08:30 AM",
            title: "Virtual Room Link provided upon registration",
            description: "Platform orientation and technical troubleshooting.",
          },
          {
            id: "d1s2",
            at: "10:30 AM",
            title: "Part A: Initial Assessment",
            description:
              "Identifying high-risk predictors through interactive case studies.",
          },
          {
            id: "d1s3",
            at: "12:15 PM",
            title: "Part B: Technical Review",
            description:
              "Virtual equipment suite walkthrough: Laryngoscopes to surgical kits.",
          },
        ],
      },
      {
        dayNumber: 2,
        dayPill: "DAY TWO",
        dateLabel: "WEDNESDAY, MARCH 13",
        trackLabel: "HANDS-ON MASTERY",
        title: "Fiberoptic & Video Laryngoscopy",
        description:
          "High-fidelity remote simulation focusing on the \"Can't Intubate, Can't Oxygenate\" (CICO) protocols.",
        expanded: false,
      },
      {
        dayNumber: 3,
        dayPill: "DAY THREE",
        dateLabel: "THURSDAY, MARCH 14",
        trackLabel: "EVALUATION & CERTIFICATION",
        title: "Practical Competency Check",
        description:
          "Individual skill assessments under lead clinical instructors via private breakout rooms.",
        expanded: false,
      },
    ],
  },

  instructors: {
    title: "Course Instructors",
    list: [
      {
        id: "alan-grant",
        name: "Dr. Alan Grant, MD",
        role: "Lead Clinical Instructor",
        quote:
          "Our mission is to ensure every clinician leaves with the muscle memory and mental clarity required to save lives during airway emergencies.",
        avatarSrc: IMAGE.instructor_1,
        avatarAlt: "Instructor",
      },
    ],
  },

  trustedBy: {
    label: "TRUSTED BY EXPERTS FROM:",
    brands: ["MEDCORE", "UNI-HEALTH", "TEXAS MED"],
  },
};
