import CourseAnnouncements from "./_components/course-annoucement";
import { COURSE_ANNOUNCEMENTS_MOCK } from "./_components/course-annoucement-mock";

export default function CourseAnnouncementsPage() {
  return <CourseAnnouncements data={COURSE_ANNOUNCEMENTS_MOCK} />;
}