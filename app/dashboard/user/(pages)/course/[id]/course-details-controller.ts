import type { OnlineDetailsViewProps } from "@/types/user/course/course-online-details-type";
import type { CompletedDetailsViewProps } from "@/types/user/course/course-completed-details-type";

import {
  getCourseDetailsHeroSeed,
  getCourseDetailsSummarySeed,
  getCourseAboutSeed,
  getCourseBookingDetailsSeed,
  getCourseScheduleSeed,
  getCourseCheckinSeed,
  getCourseHelpSeed,
} from "@/utils/course/dummy-data/course-details-data-util";

import { getOnlineDetailsSeed } from "@/utils/course/dummy-data/online-course-details-data-util";
import { getCompletedDetailsSeed } from "@/utils/course/dummy-data/completed-course-details-data-util";
import { getCourseDeliveryTypeSeed } from "@/utils/course/course-data-util";

export type CourseProgressStatus = "active" | "completed";
export type CourseDeliveryType = "inPerson" | "online";

export type CourseDetailsControllerState =
  | {
      deliveryType: "inPerson";
      progressStatus: "active";
      hero: ReturnType<typeof getCourseDetailsHeroSeed>;
      summary: ReturnType<typeof getCourseDetailsSummarySeed>;
      about: ReturnType<typeof getCourseAboutSeed>;
      booking: ReturnType<typeof getCourseBookingDetailsSeed>;
      schedule: ReturnType<typeof getCourseScheduleSeed>;
      checkin: ReturnType<typeof getCourseCheckinSeed>;
      help: ReturnType<typeof getCourseHelpSeed>;
    }
  | {
      deliveryType: "online";
      progressStatus: "active";
      online: OnlineDetailsViewProps;
    }
  | {
      deliveryType: CourseDeliveryType;
      progressStatus: "completed";
      completed: CompletedDetailsViewProps;
    };

function getProgressStatusSeed(courseId: string): CourseProgressStatus {
  const v = courseId.toLowerCase();
  if (v.includes("completed") || v.includes("done") || v.includes("finished")) {
    return "completed";
  }
  return "active";
}

export async function getCourseDetailsController(
  courseId: string,
): Promise<CourseDetailsControllerState> {
  const deliveryType = getCourseDeliveryTypeSeed(
    courseId,
  ) as CourseDeliveryType;
  const progressStatus = getProgressStatusSeed(courseId);

  // ✅ completed is independent of deliveryType
  if (progressStatus === "completed") {
    return {
      deliveryType,
      progressStatus: "completed",
      completed: getCompletedDetailsSeed(courseId),
    };
  }

  // active
  if (deliveryType === "online") {
    return {
      deliveryType: "online",
      progressStatus: "active",
      online: getOnlineDetailsSeed(courseId),
    };
  }

  return {
    deliveryType: "inPerson",
    progressStatus: "active",
    hero: getCourseDetailsHeroSeed(courseId),
    summary: getCourseDetailsSummarySeed(courseId),
    about: getCourseAboutSeed(courseId),
    booking: getCourseBookingDetailsSeed(courseId),
    schedule: getCourseScheduleSeed(courseId),
    checkin: getCourseCheckinSeed(courseId),
    help: getCourseHelpSeed(courseId),
  };
}
