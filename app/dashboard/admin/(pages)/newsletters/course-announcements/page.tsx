import { Suspense } from "react";
import CourseAnnouncements from "@/app/dashboard/admin/(pages)/newsletters/course-announcements/_components/course-annoucement";

function CourseAnnouncementsPageContent() {
  return <CourseAnnouncements />;
}

export default function CourseAnnouncementsPage() {
  return (
    <Suspense fallback={null}>
      <CourseAnnouncementsPageContent />
    </Suspense>
  );
}
