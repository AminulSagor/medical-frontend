import Image from "next/image";
import { Calendar, Clock, Eye } from "lucide-react";

import CourseDetailsSectionCard from "./course-details-section-card";
import CourseDetailsSideCard from "./course-details-side-card";
import CourseDetailsRowLine from "./course-details-row-line";
import CourseDetailsTinyPill from "./course-details-tiny-pill";
import type { CourseDetailsModel } from "../_utils/course-details.types";

function formatTime12Hour(time?: string | null): string {
    if (!time) return "—";

    const [hours = "0", minutes = "00"] = time.split(":");
    const hourNum = Number(hours);
    const suffix = hourNum >= 12 ? "PM" : "AM";
    const twelveHour = hourNum % 12 || 12;

    return `${String(twelveHour).padStart(2, "0")}:${minutes} ${suffix}`;
}

function formatAgendaDate(date?: string | null): string {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function CourseDetailsOnline({
    model,
}: {
    model: CourseDetailsModel;
}) {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
                <CourseDetailsSectionCard title="Essentials">
                    <CourseDetailsRowLine label="Delivery Mode" value="Online Webinar" />
                    <CourseDetailsRowLine
                        label="Brief Description"
                        value={model.shortBlurb || "—"}
                    />
                </CourseDetailsSectionCard>

                <CourseDetailsSectionCard
                    title="Syllabus & Details"
                    right={
                        <CourseDetailsTinyPill>
                            CME CREDITS: {model.offersCmeCredits ? model.cmeCreditsCount : "0"}
                        </CourseDetailsTinyPill>
                    }
                >
                    <p className="text-sm text-slate-600">
                        {model.learningObjectives || "—"}
                    </p>
                </CourseDetailsSectionCard>

                <CourseDetailsSectionCard
                    title="Webinar Configuration"
                    right={
                        <CourseDetailsTinyPill>ACTION CONFIGURATION</CourseDetailsTinyPill>
                    }
                >
                    <CourseDetailsRowLine
                        label="Webinar Platform"
                        value={model.webinarPlatform || "—"}
                    />
                    <CourseDetailsRowLine
                        label="Meeting Link"
                        value={model.meetingLink || "—"}
                    />
                    <CourseDetailsRowLine
                        label="Meeting Password"
                        value={model.meetingPassword || "••••••"}
                    />
                    <CourseDetailsRowLine
                        label="Automatic Recording"
                        value={model.autoRecordSession ? "Yes" : "No"}
                    />
                </CourseDetailsSectionCard>

                <CourseDetailsSectionCard title="Course Agenda">
                    {model.days.length > 0 ? (
                        <div className="space-y-3">
                            {model.days.map((day, idx) => (
                                <div
                                    key={day.id || idx}
                                    className="border-l-2 border-slate-200 pl-4"
                                >
                                    <p className="text-sm font-semibold text-slate-900">
                                        Day {day.dayNumber || idx + 1}:{" "}
                                        {formatAgendaDate(day.date)}
                                    </p>

                                    {day.segments.length > 0 ? (
                                        <div className="mt-2 space-y-2">
                                            {day.segments.map((segment, segmentIdx) => (
                                                <div
                                                    key={segment.id || segmentIdx}
                                                    className="text-xs text-slate-600"
                                                >
                                                    <span className="font-medium">
                                                        {segment.courseTopic || "—"}
                                                    </span>
                                                    {segment.topicDetails ? (
                                                        <p className="mt-1">{segment.topicDetails}</p>
                                                    ) : null}
                                                    <p className="text-slate-400">
                                                        {formatTime12Hour(segment.startTime)} - {formatTime12Hour(segment.endTime)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600">No agenda available</p>
                    )}
                </CourseDetailsSectionCard>

                <CourseDetailsSectionCard title="Faculty">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                            {model.instructorAvatarUrl ? (
                                <Image
                                    src={model.instructorAvatarUrl}
                                    alt={model.instructorName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : null}
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                {model.instructorName}
                            </p>
                            <p className="text-xs text-slate-500">Virtual Lead</p>
                        </div>
                    </div>
                </CourseDetailsSectionCard>
            </div>

            <div className="space-y-5">
                <CourseDetailsSideCard title="Scheduled Summary">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{model.dateLabel || "—"}</span>
                        <span className="text-slate-300">•</span>
                        <Clock size={14} className="text-slate-400" />
                        <span>{model.timeLabel || "—"}</span>
                    </div>

                    <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Facility / Location
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                            {model.facilityLabel}
                        </p>
                        {model.facilitySubLabel ? (
                            <p className="mt-1 text-xs text-slate-500">
                                {model.facilitySubLabel}
                            </p>
                        ) : null}
                    </div>
                </CourseDetailsSideCard>

                <CourseDetailsSideCard
                    title="Enrollment Status"
                    right={<Eye size={16} className="text-slate-400" />}
                >
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-900">
                        <p>{model.capacityUsed} / {model.capacityTotal} Attendees</p>
                        <p className="text-[var(--primary)]">
                            {model.capacityTotal <= 0
                                ? 0
                                : Math.min(100, Math.round((model.capacityUsed / model.capacityTotal) * 100))}% Capacity
                        </p>
                    </div>

                    <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                        <div
                            className="h-2 rounded-full bg-[var(--primary)]"
                            style={{
                                width:
                                    model.capacityTotal <= 0
                                        ? "0%"
                                        : `${Math.min(
                                            100,
                                            (model.capacityUsed / model.capacityTotal) * 100,
                                        )}%`,
                            }}
                        />
                    </div>
                </CourseDetailsSideCard>

                <CourseDetailsSideCard title="Pricing">
                    <CourseDetailsRowLine
                        label="Base Rate"
                        value={
                            model.standardBaseRate ? `$${model.standardBaseRate}` : "$—"
                        }
                    />

                    {model.groupDiscounts.length > 0 ? (
                        model.groupDiscounts.map((discount, idx) => (
                            <CourseDetailsRowLine
                                key={discount.id || idx}
                                label={`Group ${discount.minimumAttendees}+`}
                                value={`$${discount.groupRatePerPerson}/person`}
                            />
                        ))
                    ) : (
                        <CourseDetailsRowLine label="Group Rate" value="$—" />
                    )}
                </CourseDetailsSideCard>
            </div>
        </div>
    );
}