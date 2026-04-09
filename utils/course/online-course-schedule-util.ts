import type {
  OnlineScheduleDayKey,
  OnlineScheduleItem,
} from "@/types/user/course/course-online-details-type";

export function filterScheduleByDay(
  items: OnlineScheduleItem[],
  day: OnlineScheduleDayKey,
) {
  return items.filter((x) => x.day === day);
}
