//This is only for dummy data will be removed when api will be integrated
import type { ActiveCoursesSectionModel, CourseStats } from "@/types/course/course-type";

export function getCourseStatsSeed(): CourseStats {
  return {
    totalCmeCredits: 12.0,
    totalCmeDeltaText: "+2.5",
    inProgressCount: 3,
    nextLiveSessionText: "Mar 15, 10:00 AM",
  };
}

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