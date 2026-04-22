import {
    Calendar,
    CheckCircle2,
    ClipboardList,
    Clock,
    Eye,
    Info,
    MonitorPlay,
    Users,
} from "lucide-react";

import CourseDetailsSectionCard from "./course-details-section-card";
import CourseDetailsSideCard from "./course-details-side-card";
import CourseDetailsRowLine from "./course-details-row-line";
import CourseDetailsTinyPill from "./course-details-tiny-pill";
import type { CourseDetailsModel } from "../_utils/course-details.types";
import NetworkImageFallback from "@/utils/network-image-fallback";
import { extractListItemsFromHtml, splitHtmlIntoParagraphs, stripHtml } from "@/utils/html-content";

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
        month: "numeric",
        day: "numeric",
        year: "numeric",
    });
}

function getFacultyName(faculty: CourseDetailsModel["faculty"][number]) {
    return faculty.fullName || [faculty.firstName, faculty.lastName].filter(Boolean).join(" ") || "—";
}

function getFacultyRole(faculty: CourseDetailsModel["faculty"][number]) {
    return [faculty.medicalDesignation, faculty.primaryClinicalRole].filter(Boolean).join(", ") || "Faculty";
}

function getLearningObjectives(value?: string | null) {
    return extractListItemsFromHtml(value);
}

function getDescription(value?: string | null) {
    return stripHtml(value) || "—";
}

function renderAgenda(days: CourseDetailsModel["days"]) {
    if (days.length === 0) {
        return <p className="text-sm text-slate-500">No agenda available</p>;
    }

    return (
        <div className="space-y-6">
            {days.map((day, idx) => (
                <div key={day.id || idx} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-100" />
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-400">
                            DAY {day.dayNumber || idx + 1} AGENDA ({formatAgendaDate(day.date)})
                        </p>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <div className="space-y-3">
                        {day.segments.map((segment, segmentIdx) => (
                            <div
                                key={segment.id || segmentIdx}
                                className="grid gap-4 rounded-2xl bg-slate-50 px-4 py-4 md:grid-cols-[160px_1fr] md:items-start"
                            >
                                <div className="text-[14px] font-extrabold leading-tight text-[#18c3b2]">
                                    {formatTime12Hour(segment.startTime)} - {formatTime12Hour(segment.endTime)}
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-slate-900">
                                        {segment.courseTopic || "—"}
                                    </p>
                                    {segment.topicDetails ? (
                                        <p className="mt-1 text-[13px] leading-6 text-slate-500">
                                            {segment.topicDetails}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function renderFaculty(facultyList: CourseDetailsModel["faculty"]) {
    if (facultyList.length === 0) {
        return <p className="text-sm text-slate-500">No faculty assigned</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {facultyList.map((faculty) => (
                <div
                    key={faculty.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4"
                >
                    <div className="relative h-14 w-14 overflow-hidden rounded-full">
                        <NetworkImageFallback
                            src={faculty.imageUrl}
                            alt={getFacultyName(faculty)}
                            className="h-full w-full object-cover"
                            fallbackVariant="avatar"
                            fallbackClassName="h-full w-full"
                            iconClassName="h-6 w-6"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold text-slate-900">
                            {getFacultyName(faculty)}
                        </p>
                        <p className="text-[12px] leading-5 text-slate-500">
                            {getFacultyRole(faculty)}
                        </p>
                        {faculty.institutionOrHospital ? (
                            <p className="mt-0.5 text-[12px] text-slate-400">
                                {faculty.institutionOrHospital}
                            </p>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function CourseDetailsOnline({
    model,
}: {
    model: CourseDetailsModel;
}) {
    const learningObjectives = getLearningObjectives(model.learningObjectives);
    const learningObjectiveFallback = splitHtmlIntoParagraphs(model.learningObjectives);

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
                <CourseDetailsSectionCard title="Essentials" icon={Info}>
                    <div className="space-y-4">
                        <CourseDetailsRowLine label="Delivery Mode" value="Online Webinar" />
                        <CourseDetailsRowLine
                            label="Brief Description"
                            value={getDescription(model.shortBlurb)}
                        />
                    </div>
                </CourseDetailsSectionCard>

                <CourseDetailsSectionCard
                    title="Syllabus & Details"
                    icon={ClipboardList}
                    right={
                        <CourseDetailsTinyPill>
                            CME CREDITS: {model.offersCmeCredits ? model.cmeCreditsCount : "0.0"}
                        </CourseDetailsTinyPill>
                    }
                >
                    <div className="space-y-4">
                        <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                            Learning Objectives
                        </p>

                        {learningObjectives.length > 0 ? (
                            <div className="space-y-3">
                                {learningObjectives.map((item, index) => (
                                    <div key={`${item}-${index}`} className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#18c3b2]" />
                                        <p className="text-[14px] leading-6 text-slate-600">{item}</p>
                                    </div>
                                ))}
                            </div>
                        ) : learningObjectiveFallback.length > 0 ? (
                            <div className="space-y-2 text-[14px] leading-6 text-slate-600">
                                {learningObjectiveFallback.map((item, index) => (
                                    <p key={`${item}-${index}`}>{item}</p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">No learning objectives added</p>
                        )}
                    </div>
                </CourseDetailsSectionCard>

                <CourseDetailsSectionCard
                    title="Webinar Configuration"
                    icon={MonitorPlay}
                    right={<CourseDetailsTinyPill>ACTION CONFIGURATION</CourseDetailsTinyPill>}
                >
                    <div className="space-y-4">
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
                    </div>
                </CourseDetailsSectionCard>

                <CourseDetailsSectionCard title="Course Agenda" icon={Calendar}>
                    {renderAgenda(model.days)}
                </CourseDetailsSectionCard>

                <CourseDetailsSectionCard title="Faculty" icon={Users}>
                    {renderFaculty(model.faculty)}
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
