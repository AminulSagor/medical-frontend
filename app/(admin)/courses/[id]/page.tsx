import CourseDetailsClient from "./_components/course-details-client";

type Search = Record<string, string | string[] | undefined>;

function s(v: Search[string]) {
    return Array.isArray(v) ? v[0] : v ?? "";
}

export default function CourseDetailsPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: Search;
}) {
    const model = {
        id: params.id,
        title: s(searchParams.title),
        dateLabel: s(searchParams.dateLabel),
        timeLabel: s(searchParams.timeLabel),
        instructorName: s(searchParams.instructorName),
        instructorAvatarUrl: s(searchParams.instructorAvatarUrl),
        capacityUsed: Number(s(searchParams.capacityUsed) || 0),
        capacityTotal: Number(s(searchParams.capacityTotal) || 0),
        refundRequests: Number(s(searchParams.refundRequests) || 0),

        // ✅ REQUIRED: once you tell me the rule/field,
        // pass: deliveryMode: s(searchParams.deliveryMode) as "in_person" | "online",
        deliveryMode: s(searchParams.deliveryMode),
    };

    return <CourseDetailsClient model={model} />;
}