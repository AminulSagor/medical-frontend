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
  Save,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import ThemeDropdown, {
  ThemeDropdownOption,
} from "@/app/dashboard/admin/(pages)/users/faculty/register-faculty/_components/theme-dropdown";
import ManageClinicalLocationsModal from "../../_components/manage-clinical-locations-modal";
import { searchFaculty } from "@/service/admin/faculty.service";
import { listFacilities } from "@/service/admin/facility.service";
import { createWorkshop, getWorkshopById } from "@/service/admin/workshop.service";
import { useDebounce } from "@/hooks/useDebounce";
import {
  createWorkshopSchema,
  shortCreateWorkshopSchema,
} from "@/schema/admin/workshop.schema";
import type { Faculty } from "@/types/admin/faculty.types";
import type { Facility } from "@/types/admin/facility.types";
import type { CreateWorkshopRequest, Workshop, WorkshopStatus } from "@/types/admin/workshop.types";

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


function normalizeTimeDisplay(value?: string | null): string {
  if (!value) return "";

  const trimmed = value.trim();
  const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourHourMatch) {
    const hour = Number(twentyFourHourMatch[1]);
    const minute = twentyFourHourMatch[2];
    if (!Number.isNaN(hour)) {
      const normalizedHour = hour % 12 || 12;
      const meridiem = hour >= 12 ? "PM" : "AM";
      return `${String(normalizedHour).padStart(2, "0")}:${minute} ${meridiem}`;
    }
  }

  return trimmed
    .replace(/\s*(AM|PM)$/i, " $1")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function formatLastSavedLabel(lastSavedAt: Date | null): string {
  if (!lastSavedAt) return "Not saved yet";

  const diffMs = Date.now() - lastSavedAt.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const hours = lastSavedAt.getHours();
  const minutes = String(lastSavedAt.getMinutes()).padStart(2, "0");
  const normalizedHours = hours % 12 || 12;
  const meridiem = hours >= 12 ? "PM" : "AM";
  const day = lastSavedAt.getDate();
  const month = lastSavedAt.toLocaleString("en-US", { month: "long" });
  const year = lastSavedAt.getFullYear();

  return `${normalizedHours}:${minutes}${meridiem} ${day} ${month}, ${year}`;
}

export default function WorkshopCreateClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingWorkshopId = searchParams.get("id");

  const [saveMode, setSaveMode] = useState<"publish" | "draft" | "autosave" | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [changeVersion, setChangeVersion] = useState(0);
  const [isHydrating, setIsHydrating] = useState(true);
  const hasMountedRef = useRef(false);
  const coverPreviewUrlRef = useRef<string | null>(null);

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
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [learningObjectives, setLearningObjectives] = useState("");
  const [cme, setCme] = useState(false);
  const [cmeCreditsCount, setCmeCreditsCount] = useState("");
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


  const [days, setDays] = useState<DayAgenda[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyChip[]>([]);

  const [facultyQuery, setFacultyQuery] = useState("");
  const [facultyResults, setFacultyResults] = useState<Faculty[]>([]);
  const [facultySearching, setFacultySearching] = useState(false);
  const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
  const facultySearchRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debouncedFacultyQuery = useDebounce(facultyQuery, 300);
  function hydrateWorkshopForm(workshop: Workshop, availableFacilities: Facility[]) {
    setWorkshopId(workshop.id);
    setDraftStatus(workshop.status === "published" ? "Ready" : "Draft");
    setMode(workshop.deliveryMode);
    setWebinarPlatform((workshop.webinarPlatform as WebinarPlatform | null) ?? (workshop.deliveryMode === "online" ? "zoom" : null));
    setMeetingPassword(workshop.meetingPassword ?? "");
    setMeetingLink(workshop.meetingLink ?? "");
    setRecordAutomatically(Boolean(workshop.autoRecordSession));

    setTitle(workshop.title ?? "");
    setBlurb(workshop.shortBlurb ?? "");
    setCoverImageUrl(workshop.coverImageUrl ?? null);
    setCoverPreviewUrl(workshop.coverImageUrl ?? null);
    setCoverFileName(null);
    setLearningObjectives(workshop.learningObjectives ?? "");
    setCme(Boolean(workshop.offersCmeCredits));
    setCmeCreditsCount(workshop.cmeCreditsCount ?? "");

    const defaultFacilityId =
      workshop.facilityIds?.[0] ?? workshop.facilities?.[0]?.id ?? availableFacilities[0]?.id ?? null;
    setFacility(defaultFacilityId);

    const sortedDays = [...(workshop.days ?? [])].sort((a, b) => a.dayNumber - b.dayNumber);
    setDays(
      sortedDays.map((day, dayIndex) => ({
        id: day.id || `day-${dayIndex + 1}`,
        label: `Day ${day.dayNumber ?? dayIndex + 1}`,
        segments: [...(day.segments ?? [])]
          .sort((a, b) => a.segmentNumber - b.segmentNumber)
          .map((segment, segmentIndex) => ({
            id: segment.id || `${day.id || dayIndex}-segment-${segmentIndex + 1}`,
            topic: segment.courseTopic ?? "",
            details: segment.topicDetails ?? "",
            date: day.date ?? "",
            startTime: normalizeTimeDisplay(segment.startTime),
            endTime: normalizeTimeDisplay(segment.endTime),
          })),
      })),
    );

    setSelectedFaculty(
      (workshop.faculty ?? []).map((faculty) => ({
        id: faculty.id,
        name: faculty.fullName || `${faculty.firstName} ${faculty.lastName}`.trim(),
        role: faculty.medicalDesignation || faculty.primaryClinicalRole || "N/A",
      })),
    );

    setCapacity(workshop.capacity ?? 24);
    setAlert(workshop.alertAt ?? 5);
    setStandardRate(Number(workshop.standardBaseRate ?? 0));

    const primaryDiscount = [...(workshop.groupDiscounts ?? [])]
      .sort((a, b) => a.minimumAttendees - b.minimumAttendees)[0];
    setMinAttendees(primaryDiscount?.minimumAttendees ?? 0);
    setGroupRate(Number(primaryDiscount?.groupRatePerPerson ?? 0));

    const firstDayDate = sortedDays[0]?.date ?? "";
    setRegistrationDeadline(firstDayDate);

    const updatedAt = workshop.updatedAt || workshop.createdAt;
    setLastSavedAt(updatedAt ? new Date(updatedAt) : null);
    setHasPendingChanges(false);
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialData() {
      setIsHydrating(true);

      try {
        const facilitiesResponse = await listFacilities();
        if (isCancelled) return;

        const availableFacilities = facilitiesResponse.items;
        setFacilities(availableFacilities);

        if (editingWorkshopId) {
          const workshop = await getWorkshopById(editingWorkshopId);
          if (isCancelled) return;
          hydrateWorkshopForm(workshop, availableFacilities);
        } else {
          setWorkshopId(null);
          setFacility((current) => current ?? availableFacilities[0]?.id ?? null);
        }
      } catch (error) {
        console.error("Failed to load workshop create dependencies:", error);
      } finally {
        if (!isCancelled) {
          setIsHydrating(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      isCancelled = true;
    };
  }, [editingWorkshopId]);

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
  const [workshopId, setWorkshopId] = useState<string | null>(null);

  const derivedTotalDays = useMemo(() => days.length, [days.length]);
  const isSaving = saveMode !== null;

  const autosaveSnapshot = useMemo(
    () =>
      JSON.stringify({
        mode,
        webinarPlatform,
        meetingPassword,
        meetingLink,
        recordAutomatically,
        title,
        blurb,
        coverImageUrl,
        coverFileName,
        coverPreviewUrl,
        learningObjectives,
        cme,
        cmeCreditsCount,
        registrationDeadline,
        facility,
        days,
        selectedFaculty,
        capacity,
        alert,
        standardRate,
        minAttendees,
        groupRate,
      }),
    [
      mode,
      webinarPlatform,
      meetingPassword,
      meetingLink,
      recordAutomatically,
      title,
      blurb,
      coverImageUrl,
      coverFileName,
      coverPreviewUrl,
      learningObjectives,
      cme,
      cmeCreditsCount,
      registrationDeadline,
      facility,
      days,
      selectedFaculty,
      capacity,
      alert,
      standardRate,
      minAttendees,
      groupRate,
    ],
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (isHydrating) {
      return;
    }

    setHasPendingChanges(true);
    setChangeVersion((prev) => prev + 1);
  }, [autosaveSnapshot, isHydrating]);

  useEffect(() => {
    return () => {
      if (coverPreviewUrlRef.current) {
        URL.revokeObjectURL(coverPreviewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasPendingChanges || isSaving) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void handleSaveDraft("autosave");
    }, 60000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [changeVersion, hasPendingChanges, isSaving]);

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

  function buildPayload(status: WorkshopStatus) {
    return buildWorkshopPayload({
      mode,
      title,
      blurb,
      coverImageUrl,
      learningObjectives,
      cme,
      cmeCreditsCount,
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
  }

  async function saveWorkshop(
    status: WorkshopStatus,
    modeToUse: "publish" | "draft" | "autosave",
  ) {
    const payload = buildPayload(status);
    const parsed = createWorkshopSchema.safeParse(payload);

    if (!parsed.success) {
      setDraftStatus("Draft");

      if (modeToUse !== "autosave") {
        window.alert(parsed.error.issues[0]?.message ?? "Validation error");
      }

      return false;
    }

    setSaveMode(modeToUse);

    try {
      const requestBody: CreateWorkshopRequest = workshopId
        ? ({ ...payload, id: workshopId, status } as CreateWorkshopRequest)
        : payload;

      const savedWorkshop = await createWorkshop(requestBody);

      if (savedWorkshop?.id) {
        setWorkshopId(savedWorkshop.id);
      }

      setDraftStatus(status === "published" ? "Ready" : "Draft");
      setLastSavedAt(new Date());
      setHasPendingChanges(false);
      return true;
    } catch (error: any) {
      console.error(
        workshopId ? "Failed to save workshop draft:" : "Failed to create workshop:",
        error,
      );
      if (modeToUse !== "autosave") {
        window.alert(
          error?.response?.data?.message ||
            `Failed to ${workshopId ? "save" : "create"} workshop. Please try again.`,
        );
      }
      return false;
    } finally {
      setSaveMode(null);
    }
  }

  async function handlePublish() {
    const didSave = await saveWorkshop("published", "publish");
    if (didSave) {
      navigateToCourses();
    }
  }

  async function handleSaveDraft(modeToUse: "draft" | "autosave" = "draft") {
    await saveWorkshop("draft", modeToUse);
  }

  const isShortPayload = shortCreateWorkshopSchema.safeParse(
    buildPayload("published"),
  ).success;

  const lastSavedLabel = formatLastSavedLabel(lastSavedAt);

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
                {workshopId ? "Update Clinical Workshop" : "Create New Clinical Workshop"}
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
            disabled={isSaving}
            onClick={handlePublish}
          >
            {saveMode === "publish" ? (
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
                  onChange={(e) => {
                    setCme(e.target.checked);
                    if (!e.target.checked) {
                      setCmeCreditsCount("");
                    }
                  }}
                  className="h-5 w-5 rounded-md border-slate-300 text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                />
                This course offers CME credits
              </label>

              {cme ? (
                <div>
                  <Label>CME Credit Number</Label>
                  <TextInput
                    type="number"
                    value={cmeCreditsCount}
                    onChange={(e) => setCmeCreditsCount(e.target.value)}
                    placeholder="e.g., 8"
                    min={0}
                    step="0.1"
                  />
                </div>
              ) : null}
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
                                  startTime: normalizeTimeDisplay(e.target.value),
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
                                  endTime: normalizeTimeDisplay(e.target.value),
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
            <div className="space-y-4">
              {coverPreviewUrl ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    className="h-44 w-full object-cover"
                  />
                </div>
              ) : null}

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-600 transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary-50)]/30">
                <span>{coverFileName ?? "Choose cover image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (coverPreviewUrlRef.current) {
                      URL.revokeObjectURL(coverPreviewUrlRef.current);
                      coverPreviewUrlRef.current = null;
                    }

                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      coverPreviewUrlRef.current = previewUrl;
                      setCoverPreviewUrl(previewUrl);
                      setCoverFileName(file.name);
                    } else {
                      setCoverPreviewUrl(null);
                      setCoverFileName(null);
                    }

                    setCoverImageUrl(null);
                  }}
                />
              </label>
            </div>
          </WorkshopCard>

          <WorkshopCard
            title="Status & Tracking"
            subtitle="Save progress manually or let auto-save handle it."
            icon={<Save size={16} className="text-[var(--primary)]" />}
          >
            <div className="space-y-4">
              <SecondaryButton
                type="button"
                onClick={() => void handleSaveDraft("draft")}
                disabled={isSaving}
                className="w-full justify-center"
              >
                {saveMode === "draft" ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving Draft...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Draft
                  </>
                )}
              </SecondaryButton>

              <div className="border-t border-slate-200 pt-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {saveMode === "autosave"
                  ? "Auto-saving..."
                  : `Last auto-saved ${lastSavedLabel}`}
              </div>
            </div>
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