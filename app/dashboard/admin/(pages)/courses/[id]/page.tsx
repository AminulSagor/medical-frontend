import CourseDetailsClient from "./_components/course-details-client";

export default async function CourseDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <CourseDetailsClient workshopId={id} />;
}