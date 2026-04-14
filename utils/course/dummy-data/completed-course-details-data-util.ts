import type { CompletedDetailsViewProps } from "@/types/user/course/course-completed-details-type";
import {
  getCourseBookingDetailsSeed,
  getCourseScheduleSeed,
} from "./course-details-data-util";

export function getCompletedDetailsSeed(courseId: string): CompletedDetailsViewProps {
  return {
    hero: {
      title: "Advanced Difficult Airway Workshop",
      leftBadges: [
        { label: "Course Completed", tone: "success" },
        { label: "12.0 CME Credits Earned", tone: "neutral" },
      ],
      rightPill: { title: "COMPLETED", subtitle: "MAR 12 - 14" },
    },
    strip: {
      locationText: "Houston Sim Center, Room 4B",
      instructorText: "Instructor: Dr. Alan Grant",
      statusText: "Event Finished",
      downloadLabel: "Download Certificate",
      downloadHref: "",
    },
    about: {
      heading: "About this Course",
      paragraphs: [
        "This comprehensive workshop was designed for anesthesia professionals looking to master advanced airway techniques through intensive, hands-on simulation training.",
        "You have completed training with state-of-the-art simulation equipment and high-fidelity manikins.",
      ],
    },
    booking: getCourseBookingDetailsSeed(courseId),
    schedule: getCourseScheduleSeed(courseId),
    certificate: {
      title: "Course Certified",
      subtitle: "Your certificate is now available.",
      congratsTitle: "Congratulations!",
      congratsText:
        "You’ve successfully completed the Advanced Difficult Airway Workshop curriculum.",
      primaryBtnLabel: "Download Certificate",
      secondaryBtnLabel: "Share Achievement",
      referenceLabel: "CERTIFICATE ID",
      referenceValue: "CERT-8829-AC",
      downloadHref: "",
    },
    nextSteps: {
      title: "Next Steps?",
      text: "Want to keep improving? Explore your next clinical competency module or schedule another workshop.",
      actionLabel: "View My Profile →",
    },
  };
}
