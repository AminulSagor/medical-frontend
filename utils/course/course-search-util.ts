import type { ActiveCoursesSectionModel } from "@/types/course/course-type";

export function filterActiveCourses(
  data: ActiveCoursesSectionModel,
  search: string
): ActiveCoursesSectionModel {
  if (!search.trim()) return data;

  const q = search.toLowerCase();

  const inPersonMatch = data.inPerson?.title.toLowerCase().includes(q) ?? false;
  const onlineMatch = data.online?.title.toLowerCase().includes(q) ?? false;

  return {
    inPerson: inPersonMatch ? data.inPerson : null,
    online: onlineMatch ? data.online : null,
  };
}

export function hasAnyCourse(data: ActiveCoursesSectionModel) {
  return Boolean(data.inPerson || data.online);
}