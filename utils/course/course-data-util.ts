// utils/course/course-data-util.ts
// This is only for dummy data will be removed when api will be integrated

import { CourseDeliveryType } from "@/types/user/course/course-details-type";

export type CourseStats = {
  totalCmeCredits: number;
  totalCmeDeltaText: string;
  inProgressCount: number;
  nextLiveSessionText: string;
};

export type ActiveCourseCard = {
  badge: string;
  title: string;
  dateLabel?: string;
  locationLabel?: string;
  infoTitle?: string;
  infoText?: string;
  bookedForLabel: string;
  bookingFeeLabel: string;
  progressLabel?: string;
  imageSrc: string;
  onAddToCalendar?: () => void;
  onViewSyllabus?: () => void;
  onJoinLive?: () => void;
};

export type ActiveCoursesSectionModel = {
  inPerson: ActiveCourseCard;
  online: ActiveCourseCard;
};

export type CompletedCourseCard = {
  cmeCreditsLabel: string;
  title: string;
  completedOnText: string;
  imageSrc: string;
  onViewDetails: () => void;
};

export type BrowseFeaturedCourse = {
  badge: string;
  title: string;
  description: string;
  imageSrc: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
};

export type BrowseCourseItem = {
  badge: string;
  title: string;
  description: string;
  imageSrc: string;
  priceLabel: string;
  creditsLabel: string;
  ctaLabel: string;
  onCta: () => void;
};

export type BrowseCoursesModel = {
  featured: BrowseFeaturedCourse;
  items: BrowseCourseItem[];
};

export function getCourseDeliveryTypeSeed(
  courseId: string,
): CourseDeliveryType {
  // ✅ Dummy decision (replace with API value later)
  // Example: courseId contains "online" -> online
  const id = (courseId || "").toLowerCase();
  if (id.includes("online")) return "online";
  if (id.includes("completed")) return "completed";
  return "inPerson";
}

/* --------------------------- STATS (existing) --------------------------- */
export function getCourseStatsSeed(): CourseStats {
  return {
    totalCmeCredits: 12.0,
    totalCmeDeltaText: "+2.5",
    inProgressCount: 3,
    nextLiveSessionText: "Mar 15, 10:00 AM",
  };
}

/* --------------------------- ACTIVE (existing) -------------------------- */
export function getActiveCoursesSeed(): ActiveCoursesSectionModel {
  return {
    inPerson: {
      badge: "ALL IN-PERSON WORKSHOP",
      title: "Advanced Airway Management",
      dateLabel: "Mar 12, 2024",
      locationLabel: "Sim Lab B",
      bookedForLabel: "2 people",
      bookingFeeLabel: "$450.00",
      imageSrc: "/photos/child.png",
      onAddToCalendar: () => console.log("Add to Calendar"),
      onViewSyllabus: () => console.log("View Syllabus"),
    },
    online: {
      badge: "ONLINE SELF-PACED COURSE",
      title: "Ultrasound Physics & Knobology",
      infoTitle: "Live Online Session Included:",
      infoText:
        "A Q&A workshop is scheduled for Mar 15. Check your email for the link.",
      bookedForLabel: "1 person",
      bookingFeeLabel: "$125.00",
      progressLabel: "12% Complete",
      imageSrc: "/photos/strethoscope.png",
      onJoinLive: () => console.log("Join Live"),
    },
  };
}

/* -------------------------- COMPLETED (new) ----------------------------- */
export function getCompletedCoursesSeed(): CompletedCourseCard[] {
  return [
    {
      cmeCreditsLabel: "4.0 CME CREDITS",
      title: "Pediatric Sedation Basics",
      completedOnText: "Completed on Dec 20, 2023",
      imageSrc: "/photos/strethoscope.png",
      onViewDetails: () =>
        console.log("View Course Details: Pediatric Sedation"),
    },
    {
      cmeCreditsLabel: "6.0 CME CREDITS",
      title: "Advanced Cardiovascular Life Support",
      completedOnText: "Completed on Nov 12, 2023",
      imageSrc: "/photos/child.png",
      onViewDetails: () => console.log("View Course Details: ACLS"),
    },
    {
      cmeCreditsLabel: "6.5 CME CREDITS",
      title: "Emergency Airway Fundamentals",
      completedOnText: "Completed on Oct 05, 2023",
      imageSrc: "/photos/child.png",
      onViewDetails: () => console.log("View Course Details: Airway"),
    },
    {
      cmeCreditsLabel: "5.0 CME CREDITS",
      title: "Leadership in Critical Care",
      completedOnText: "Completed on Aug 15, 2023",
      imageSrc: "/photos/child.png",
      onViewDetails: () => console.log("View Course Details: Leadership"),
    },
  ];
}

/* ---------------------------- BROWSE (new) ------------------------------ */
export function getBrowseCoursesSeed(): BrowseCoursesModel {
  return {
    featured: {
      badge: "FEATURED COURSE",
      title: "Advanced Trauma Life Support",
      description:
        "Master the latest protocols in rapid trauma assessment and management. This intensive course provides hands-on…",
      imageSrc: "/photos/child.png",
      primaryActionLabel: "Enroll Now - $750",
      secondaryActionLabel: "View Syllabus",
      onPrimaryAction: () => console.log("Enroll Featured Course"),
      onSecondaryAction: () => console.log("View Featured Syllabus"),
    },

    items: [
      {
        badge: "ONLINE",
        title: "Pediatric Sedation & Procedural Safety",
        description:
          "Evidence-based techniques for safe sedation in pediatric patients during emergency and elective…",
        imageSrc: "/photos/strethoscope.png",
        priceLabel: "$295.00",
        creditsLabel: "4.0 CME CREDITS",
        ctaLabel: "View Details",
        onCta: () => console.log("Browse: View Details 1"),
      },
      {
        badge: "IN-PERSON",
        title: "Crisis Resource Management & Leadership",
        description:
          "High-fidelity simulation training focusing on communication, teamwork, and leadership during…",
        imageSrc: "/photos/child.png",
        priceLabel: "$550.00",
        creditsLabel: "8.0 CME CREDITS",
        ctaLabel: "Enroll Now",
        onCta: () => console.log("Browse: Enroll 2"),
      },
      {
        badge: "IN-PERSON",
        title: "Emergency Airway Skills Lab",
        description:
          "Hands-on workshop for difficult airway management including fiberoptic intubation and surgical airways…",
        imageSrc: "/photos/child.png",
        priceLabel: "$425.00",
        creditsLabel: "6.0 CME CREDITS",
        ctaLabel: "View Details",
        onCta: () => console.log("Browse: View Details 3"),
      },
    ],
  };
}
