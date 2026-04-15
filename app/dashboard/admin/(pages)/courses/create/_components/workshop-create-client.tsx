"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ImageIcon,
  Plus,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import ThemeDropdown, {
  ThemeDropdownOption,
} from "@/app/dashboard/admin/(pages)/users/faculty/register-faculty/_components/theme-dropdown";
import ManageClinicalLocationsModal from "../../_components/manage-clinical-locations-modal";
import { searchFaculty } from "@/service/admin/faculty.service";
import { listFacilities } from "@/service/admin/facility.service";
import { createWorkshop } from "@/service/admin/workshop.service";
import { useDebounce } from "@/hooks/useDebounce";
import {
  createWorkshopSchema,
  shortCreateWorkshopSchema,
} from "@/schema/admin/workshop.schema";
import type { Faculty } from "@/types/admin/faculty.types";
import type { Facility } from "@/types/admin/facility.types";
import type { WorkshopStatus } from "@/types/admin/workshop.types";

import RichTextEditor from "./workshop-create/_components/shared/rich-text-editor";
import SeatMap from "./workshop-create/_components/shared/seat-map";
import WorkshopCard from "./workshop-create/_components/shared/workshop-card";
import {
  Label,
  SectionLabel,
  TextArea,
  TextInput,
} from "./workshop-create/_components/shared/workshop-field";
import {
  PrimaryButton,
  SecondaryButton,
  TinyPill,
} from "./workshop-create/_components/shared/workshop-buttons";
import { WEBINAR_PLATFORM_OPTIONS } from "./workshop-create/_utils/workshop-create.constants";
import { buildWorkshopPayload } from "./workshop-create/_utils/workshop-create.payload";
import type {
  DayAgenda,
  DeliveryMode,
  FacultyChip,
  FacilityLocation,
  Segment,
  WebinarPlatform,
} from "./workshop-create/_utils/workshop-create.types";

const COURSES_LIST_ROUTE = "/dashboard/admin/courses";

export default function WorkshopCreateClient() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<DeliveryMode>("in_person");
  const isOnline = mode === "online";

  const [webinarPlatform, setWebinarPlatform] =
    useState<WebinarPlatform | null>("zoom");
  const [meetingPassword, setMeetingPassword] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [recordAutomatically, setRecordAutomatically] = useState(false);

  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [learningObjectives, setLearningObjectives] = useState("");
  const [cme, setCme] = useState(false);
  const [registrationDeadline, setRegistrationDeadline] = useState("");

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facility, setFacility] = useState<FacilityLocation | null>(null);
  const [openLocations, setOpenLocations] = useState(false);

  const facilityOptions: Array<ThemeDropdownOption<FacilityLocation>> =
    useMemo(
      () =>
        facilities.map((item) => ({
          value: item.id,
          label: item.roomNumber
            ? `${item.name} (${item.roomNumber})`
            : item.name,
        })),
      [facilities],
    );

  useEffect(() => {
    listFacilities()
      .then((res) => {
        setFacilities(res.items);
        if (res.items.length > 0) {
          setFacility(res.items[0].id);
        }
      })
      .catch((error) => {
        console.error("Failed to load facilities:", error);
      });
  }, []);

  const [days, setDays] = useState<DayAgenda[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyChip[]>([]);

  const [facultyQuery, setFacultyQuery] = useState("");
  const [facultyResults, setFacultyResults] = useState<Faculty[]>([]);
  const [facultySearching, setFacultySearching] = useState(false);
  const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
  const facultySearchRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debouncedFacultyQuery = useDebounce(facultyQuery, 300);

  useEffect(() => {
    if (debouncedFacultyQuery.length < 3) {
      setFacultyResults([]);
      setFacultyDropdownOpen(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFacultySearching(true);

    searchFaculty(debouncedFacultyQuery, 1, 10, controller.signal)
      .then((res) => {
        setFacultyResults(res.data);
        setFacultyDropdownOpen(true);
      })
      .catch((error) => {
        if (error?.name !== "AbortError" && error?.code !== "ERR_CANCELED") {
          console.error("Faculty search failed:", error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setFacultySearching(false);
        }
      });

    return () => controller.abort();
  }, [debouncedFacultyQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        facultySearchRef.current &&
        !facultySearchRef.current.contains(event.target as Node)
      ) {
        setFacultyDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function selectFacultyFromSearch(facultyItem: Faculty) {
    const alreadySelected = selectedFaculty.some(
      (item) => item.id === facultyItem.id,
    );

    if (!alreadySelected) {
      setSelectedFaculty((prev) => [
        ...prev,
        {
          id: facultyItem.id,
          name: `${facultyItem.firstName} ${facultyItem.lastName}`,
          role: facultyItem.medicalDesignation || facultyItem.primaryClinicalRole || "N/A",
        },
      ]);
    }

    setFacultyQuery("");
    setFacultyDropdownOpen(false);
    setFacultyResults([]);
  }

  const [capacity, setCapacity] = useState(24);
  const [alert, setAlert] = useState(5);
  const [standardRate, setStandardRate] = useState(450);
  const [minAttendees, setMinAttendees] = useState(0);
  const [groupRate, setGroupRate] = useState(0);
  const [draftStatus, setDraftStatus] = useState<"Draft" | "Ready">("Draft");

  const derivedTotalDays = useMemo(() => days.length, [days.length]);

  function addDay() {
    setDays((prev) => [
      ...prev,
      {
        id: `day_${Date.now()}_${prev.length + 1}`,
        label: `Day ${prev.length + 1} Agenda`,
        segments: [
          {
            id: `seg_${Date.now()}`,
            topic: "",
            details: "",
            date: "",
            startTime: "",
            endTime: "",
          },
        ],
      },
    ]);
  }

  function removeDay(dayId: string) {
    setDays((prev) => prev.filter((day) => day.id !== dayId));
  }

  function addSegment(dayId: string) {
    setDays((prev) =>
      prev.map((day) =>
        day.id !== dayId
          ? day
          : {
            ...day,
            segments: [
              ...day.segments,
              {
                id: `seg_${Date.now()}`,
                topic: "",
                details: "",
                date: "",
                startTime: "",
                endTime: "",
              },
            ],
          },
      ),
    );
  }

  function removeSegment(dayId: string, segmentId: string) {
    setDays((prev) =>
      prev.map((day) =>
        day.id !== dayId
          ? day
          : {
            ...day,
            segments: day.segments.filter(
              (segment) => segment.id !== segmentId,
            ),
          },
      ),
    );
  }

  function updateSegment(
    dayId: string,
    segmentId: string,
    patch: Partial<Segment>,
  ) {
    setDays((prev) =>
      prev.map((day) =>
        day.id !== dayId
          ? day
          : {
            ...day,
            segments: day.segments.map((segment) =>
              segment.id === segmentId
                ? { ...segment, ...patch }
                : segment,
            ),
          },
      ),
    );
  }

  function removeFaculty(id: string) {
    setSelectedFaculty((prev) => prev.filter((item) => item.id !== id));
  }

  function navigateToCourses() {
    router.push(COURSES_LIST_ROUTE);
  }

  async function handleSubmit(status: WorkshopStatus) {
    const payload = buildWorkshopPayload({
      mode,
      title,
      blurb,
      coverImageUrl,
      learningObjectives,
      cme,
      facility,
      webinarPlatform,
      meetingLink,
      meetingPassword,
      recordAutomatically,
      capacity,
      alert,
      standardRate,
      minAttendees,
      groupRate,
      selectedFaculty,
      days,
      status,
      registrationDeadline,
    });

    const parsed = createWorkshopSchema.safeParse(payload);

    if (!parsed.success) {
      setDraftStatus("Draft");
      window.alert(parsed.error.issues[0]?.message ?? "Validation error");
      return;
    }

    setSubmitting(true);

    try {
      await createWorkshop(payload);
      setDraftStatus("Ready");
      navigateToCourses();
    } catch (error: any) {
      console.error("Failed to create workshop:", error);
      window.alert(
        error?.response?.data?.message ||
        "Failed to create workshop. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isShortPayload = shortCreateWorkshopSchema.safeParse(
    buildWorkshopPayload({
      mode,
      title,
      blurb,
      coverImageUrl,
      learningObjectives,
      cme,
      facility,
      webinarPlatform,
      meetingLink,
      meetingPassword,
      recordAutomatically,
      capacity,
      alert,
      standardRate,
      minAttendees,
      groupRate,
      selectedFaculty,
      days,
      status: "published",
      registrationDeadline,
    }),
  ).success;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href={COURSES_LIST_ROUTE}
            className="mt-1 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Create New Clinical Workshop
              </h1>

              <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200">
                {isShortPayload ? "SHORT PAYLOAD" : draftStatus}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Configure workshop details, faculty, and logistics for upcoming
              sessions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SecondaryButton type="button" onClick={navigateToCourses}>
            Discard
          </SecondaryButton>

          <PrimaryButton
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("published")}
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </PrimaryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <WorkshopCard
            title="Delivery Mode"
            subtitle="Select how this clinical training will be conducted."
            icon={<span className="text-[var(--primary)]">⎈</span>}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("in_person")}
                className={[
                  "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition",
                  mode === "in_person"
                    ? "border-[var(--primary)]/25 bg-[var(--primary-50)] ring-2 ring-[var(--primary)]/15"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                    <span className="text-[var(--primary)]">🧪</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      In-Person Lab
                    </p>
                    <p className="text-xs text-slate-500">
                      Hands-on training at facility
                    </p>
                  </div>
                </div>

                <span className="grid h-6 w-6 place-items-center rounded-full border border-cyan-300 bg-white">
                  {mode === "in_person" ? (
                    <Check size={14} className="text-[var(--primary)]" />
                  ) : null}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode("online")}
                className={[
                  "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition",
                  mode === "online"
                    ? "border-[var(--primary)]/25 bg-[var(--primary-50)] ring-2 ring-[var(--primary)]/15"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                    <span className="text-[var(--primary)]">🖥️</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Online Webinar
                    </p>
                    <p className="text-xs text-slate-500">
                      Live virtual session
                    </p>
                  </div>
                </div>

                <span className="grid h-6 w-6 place-items-center rounded-full border border-cyan-300 bg-white">
                  {mode === "online" ? (
                    <Check size={14} className="text-[var(--primary)]" />
                  ) : null}
                </span>
              </button>
            </div>
          </WorkshopCard>

          <WorkshopCard
            title="Essentials"
            subtitle="Define the core attributes of the workshop."
            icon={<span className="text-[var(--primary)]">📄</span>}
          >
            <div className="space-y-4">
              <div>
                <Label>Workshop Title</Label>
                <TextInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Advanced Airway Management"
                />
              </div>

              <div>
                <Label>Short Blurb</Label>
                <TextArea
                  value={blurb}
                  onChange={(e) => setBlurb(e.target.value)}
                  placeholder="Leave empty to use short API"
                />
              </div>

              <div>
                <Label>Registration Deadline</Label>
                <TextInput
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>
          </WorkshopCard>

          {isOnline ? (
            <WorkshopCard
              title="Webinar Configuration"
              subtitle="Required for online full payload."
              icon={<span className="text-[var(--primary)]">🛰️</span>}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <Label>Webinar Platform</Label>
                    <ThemeDropdown<WebinarPlatform>
                      value={webinarPlatform}
                      options={WEBINAR_PLATFORM_OPTIONS}
                      placeholder="Select webinar platform"
                      onChange={setWebinarPlatform}
                      buttonClassName="mt-0 h-10 rounded-md px-3 py-0"
                    />
                  </div>

                  <div>
                    <Label>Meeting Password</Label>
                    <TextInput
                      value={meetingPassword}
                      onChange={(e) => setMeetingPassword(e.target.value)}
                      placeholder="e.g., Med2026!"
                    />
                  </div>
                </div>

                <div>
                  <Label>Meeting Link</Label>
                  <TextInput
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <label className="flex items-center gap-3 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={() => setRecordAutomatically((prev) => !prev)}
                    className={[
                      "relative h-6 w-11 rounded-full border transition",
                      recordAutomatically
                        ? "border-[var(--primary)] bg-[var(--primary)]"
                        : "border-slate-200 bg-slate-100",
                    ].join(" ")}
                    aria-label="Record session automatically"
                  >
                    <span
                      className={[
                        "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition",
                        recordAutomatically ? "left-[22px]" : "left-[2px]",
                      ].join(" ")}
                    />
                  </button>
                  Record Session Automatically
                </label>
              </div>
            </WorkshopCard>
          ) : null}

          <WorkshopCard
            title="Syllabus & Details"
            subtitle="Fill any advanced field to use the full payload."
            icon={<Calendar size={16} className="text-[var(--primary)]" />}
          >
            <div className="space-y-4">
              <div>
                <SectionLabel>Learning Objectives</SectionLabel>
                <RichTextEditor
                  value={learningObjectives}
                  onChange={setLearningObjectives}
                  placeholder="Leave empty to use short API"
                />
              </div>

              <label className="flex items-center gap-3 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={cme}
                  onChange={(e) => setCme(e.target.checked)}
                  className="h-5 w-5 rounded-md border-slate-300 text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
                This course offers CME credits
              </label>
            </div>
          </WorkshopCard>

          <WorkshopCard
            title="Course Schedule"
            subtitle="Leave empty to use short payload."
            icon={<Calendar size={16} className="text-[var(--primary)]" />}
            right={
              <SecondaryButton type="button" onClick={addDay}>
                <Plus size={14} />
                Add Day
              </SecondaryButton>
            }
          >
            <div className="space-y-6">
              {days.map((day, dayIndex) => (
                <div
                  key={day.id}
                  className="rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {dayIndex + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-900">
                        {day.label}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeDay(day.id)}
                      className="text-xs font-semibold text-[var(--primary)] hover:underline"
                    >
                      REMOVE DAY
                    </button>
                  </div>

                  <div className="space-y-4 px-4 pb-4">
                    {day.segments.map((segment, segmentIndex) => (
                      <div
                        key={segment.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Segment {segmentIndex + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeSegment(day.id, segment.id)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-white"
                            aria-label="Remove segment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <Label>Course Topic</Label>
                            <TextInput
                              value={segment.topic}
                              onChange={(e) =>
                                updateSegment(day.id, segment.id, {
                                  topic: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label>Topic Details</Label>
                            <TextArea
                              value={segment.details}
                              onChange={(e) =>
                                updateSegment(day.id, segment.id, {
                                  details: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label>Date</Label>
                            <TextInput
                              value={segment.date}
                              onChange={(e) =>
                                updateSegment(day.id, segment.id, {
                                  date: e.target.value,
                                })
                              }
                              placeholder="MM/DD/YYYY"
                            />
                          </div>

                          <div>
                            <Label>Start Time</Label>
                            <TextInput
                              value={segment.startTime}
                              onChange={(e) =>
                                updateSegment(day.id, segment.id, {
                                  startTime: e.target.value,
                                })
                              }
                              placeholder="08:00 AM"
                            />
                          </div>

                          <div>
                            <Label>End Time</Label>
                            <TextInput
                              value={segment.endTime}
                              onChange={(e) =>
                                updateSegment(day.id, segment.id, {
                                  endTime: e.target.value,
                                })
                              }
                              placeholder="12:00 PM"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <SecondaryButton
                      type="button"
                      onClick={() => addSegment(day.id)}
                    >
                      <Plus size={14} />
                      Add Segment
                    </SecondaryButton>
                  </div>
                </div>
              ))}
            </div>
          </WorkshopCard>

          <WorkshopCard
            title="Faculty & Instructors"
            subtitle="Selecting faculty switches to the full payload."
            icon={<Search size={16} className="text-[var(--primary)]" />}
          >
            <div className="space-y-4">
              <div ref={facultySearchRef} className="relative">
                <Label>Search Faculty</Label>

                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <TextInput
                    value={facultyQuery}
                    onChange={(e) => setFacultyQuery(e.target.value)}
                    placeholder="Search by faculty name"
                    className="pl-9"
                  />

                  {facultySearching ? (
                    <Loader2
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
                    />
                  ) : null}
                </div>

                {facultyDropdownOpen ? (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {facultyResults.length > 0 ? (
                      <div className="space-y-1">
                        {facultyResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectFacultyFromSearch(item)}
                            className="flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition hover:bg-slate-50"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {item.firstName} {item.lastName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {item.medicalDesignation || item.primaryClinicalRole || "N/A"}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="px-3 py-2 text-sm text-slate-500">
                        No faculty found
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedFaculty.map((item) => (
                  <div
                    key={item.id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">
                        {item.role}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFaculty(item.id)}
                      className="rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
                      aria-label="Remove faculty"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </WorkshopCard>
        </div>

        <div className="space-y-5">
          <WorkshopCard
            title="Date & Location"
            subtitle="Schedule summary"
            icon={<Calendar size={16} className="text-[var(--primary)]" />}
            right={<TinyPill>{derivedTotalDays} Days Total</TinyPill>}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                {days.map((day, index) => (
                  <div
                    key={day.id}
                    className="rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Day {index + 1}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{day.segments[0]?.date || "—"}</span>
                      <span className="text-slate-300">•</span>
                      <Clock size={14} className="text-slate-400" />
                      <span>
                        {(day.segments[0]?.startTime || "—") +
                          " - " +
                          (day.segments[0]?.endTime || "—")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <Label>Facility / Location</Label>

                {isOnline ? (
                  <div className="flex h-10 w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                    <span>N/A (Online Only)</span>
                  </div>
                ) : (
                  <ThemeDropdown<FacilityLocation>
                    value={facility}
                    options={facilityOptions}
                    placeholder="Select a facility"
                    onChange={setFacility}
                    buttonClassName="mt-0 h-10 rounded-md px-3 py-0"
                  />
                )}
              </div>

              <div>
                <Label>Registration Deadline</Label>
                <TextInput
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              {!isOnline ? (
                <SecondaryButton
                  type="button"
                  onClick={() => setOpenLocations(true)}
                  className="w-full"
                >
                  Manage Clinical Locations
                </SecondaryButton>
              ) : null}
            </div>
          </WorkshopCard>

          <WorkshopCard
            title="Capacity"
            subtitle="Seat allocation and alert threshold."
            icon={<span className="text-[var(--primary)]">👥</span>}
          >
            <div className="space-y-4">
              <div>
                <Label>Capacity</Label>
                <TextInput
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value || 0))}
                  min={1}
                />
              </div>

              <div>
                <Label>Low Seat Alert At</Label>
                <TextInput
                  type="number"
                  value={alert}
                  onChange={(e) => setAlert(Number(e.target.value || 0))}
                  min={0}
                />
              </div>

              <SeatMap capacity={capacity} />
            </div>
          </WorkshopCard>

          <WorkshopCard
            title="Pricing"
            subtitle="Filling pricing can still work with the full payload."
            icon={<span className="text-[var(--primary)]">💳</span>}
          >
            <div className="space-y-4">
              <div>
                <Label>Standard Rate</Label>
                <TextInput
                  type="number"
                  value={standardRate}
                  onChange={(e) => setStandardRate(Number(e.target.value || 0))}
                  min={0}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label>Minimum Attendees</Label>
                  <TextInput
                    type="number"
                    value={minAttendees}
                    onChange={(e) => setMinAttendees(Number(e.target.value || 0))}
                    min={0}
                  />
                </div>

                <div>
                  <Label>Group Rate / Person</Label>
                  <TextInput
                    type="number"
                    value={groupRate}
                    onChange={(e) => setGroupRate(Number(e.target.value || 0))}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </WorkshopCard>

          <WorkshopCard
            title="Cover Image"
            subtitle="Selecting an image switches to the full payload."
            icon={<ImageIcon size={16} className="text-[var(--primary)]" />}
          >
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-600 transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary-50)]/30">
              <span>{coverFileName ?? "Choose cover image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setCoverFileName(file?.name ?? null);
                  setCoverImageUrl(null);
                }}
              />
            </label>
          </WorkshopCard>
        </div>
      </div>

      <ManageClinicalLocationsModal
        open={openLocations}
        onClose={() => setOpenLocations(false)}
        selectedId={facility ?? ""}
        onSelect={(selectedFacility) => {
          setFacility(selectedFacility.id);
          setOpenLocations(false);
        }}
      />
    </div>
  );
}