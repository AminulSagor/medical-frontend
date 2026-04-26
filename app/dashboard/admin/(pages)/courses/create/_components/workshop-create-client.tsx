"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ThemeDropdown, {
  ThemeDropdownOption,
} from "@/app/dashboard/admin/(pages)/users/faculty/register-faculty/_components/theme-dropdown";
import { searchFaculty } from "@/service/admin/faculty.service";
import { listFacilities } from "@/service/admin/facility.service";
import { createWorkshop, getWorkshopById } from "@/service/admin/workshop.service";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/service/upload/upload.service";
import { useDebounce } from "@/hooks/useDebounce";
import {
  createWorkshopSchema,
  shortCreateWorkshopSchema,
} from "@/schema/admin/workshop.schema";
import type { Faculty } from "@/types/admin/faculty.types";
import type { Facility } from "@/types/admin/facility.types";
import type {
  CreateWorkshopRequest,
  Workshop,
  WorkshopStatus,
} from "@/types/admin/workshop.types";

import WorkshopCreateHeader from "./workshop-create/_components/workshop-create-header";
import WorkshopDeliveryModeCard from "./workshop-create/_components/workshop-delivery-mode-card";
import WorkshopEssentialsCard from "./workshop-create/_components/workshop-essentials-card";
import WorkshopWebinarConfigCard from "./workshop-create/_components/workshop-webinar-config-card";
import WorkshopSyllabusCard from "./workshop-create/_components/workshop-syllabus-card";
import WorkshopScheduleCard from "./workshop-create/_components/workshop-schedule-card";
import WorkshopFacultyCard from "./workshop-create/_components/workshop-faculty-card";
import WorkshopSidebar from "./workshop-create/_components/workshop-sidebar";
import { buildWorkshopPayload } from "./workshop-create/_utils/workshop-create.payload";
import {
  formatLastSavedLabel,
  normalizeTimeDisplay,
} from "./workshop-create/_utils/workshop-create-formatters";
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
  const searchParams = useSearchParams();
  const editingWorkshopId = searchParams.get("id");

  const [saveMode, setSaveMode] = useState<
    "publish" | "draft" | "autosave" | null
  >(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [changeVersion, setChangeVersion] = useState(0);
  const [isHydrating, setIsHydrating] = useState(true);

  const hasMountedRef = useRef(false);
  const coverPreviewUrlRef = useRef<string | null>(null);
  const suppressDirtyRef = useRef(false);

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
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [learningObjectives, setLearningObjectives] = useState("");
  const [cme, setCme] = useState(false);
  const [cmeCreditsCount, setCmeCreditsCount] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facility, setFacility] = useState<FacilityLocation | null>(null);
  const [openLocations, setOpenLocations] = useState(false);

  const [days, setDays] = useState<DayAgenda[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyChip[]>([]);

  const [facultyQuery, setFacultyQuery] = useState("");
  const [facultyResults, setFacultyResults] = useState<Faculty[]>([]);
  const [facultySearching, setFacultySearching] = useState(false);
  const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
  const [isFacultyInputActive, setIsFacultyInputActive] = useState(false);

  const facultySearchRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debouncedFacultyQuery = useDebounce(facultyQuery, 300);

  const [capacity, setCapacity] = useState(24);
  const [alert, setAlert] = useState(5);
  const [standardRate, setStandardRate] = useState(450);
  const [minAttendees, setMinAttendees] = useState(0);
  const [groupRate, setGroupRate] = useState(0);
  const [draftStatus, setDraftStatus] = useState<"Draft" | "Ready">("Draft");
  const [workshopId, setWorkshopId] = useState<string | null>(null);

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

  const derivedTotalDays = useMemo(() => days.length, [days.length]);
  const isSaving = saveMode !== null;

  function hydrateWorkshopForm(
    workshop: Workshop,
    availableFacilities: Facility[],
  ) {
    setWorkshopId(workshop.id);
    setDraftStatus(workshop.status === "published" ? "Ready" : "Draft");
    setMode(workshop.deliveryMode);
    setWebinarPlatform(
      (workshop.webinarPlatform as WebinarPlatform | null) ??
      (workshop.deliveryMode === "online" ? "zoom" : null),
    );
    setMeetingPassword(workshop.meetingPassword ?? "");
    setMeetingLink(workshop.meetingLink ?? "");
    setRecordAutomatically(Boolean(workshop.autoRecordSession));

    setTitle(workshop.title ?? "");
    setBlurb(workshop.shortBlurb ?? "");
    setCoverImageUrl(workshop.coverImageUrl ?? null);
    setCoverPreviewUrl(workshop.coverImageUrl ?? null);
    setCoverFileName(null);
    setPendingCoverFile(null);
    setLearningObjectives(workshop.learningObjectives ?? "");
    setCme(Boolean(workshop.offersCmeCredits));
    setCmeCreditsCount(workshop.cmeCreditsCount ?? "");

    const defaultFacilityId =
      workshop.facilityIds?.[0] ??
      workshop.facilities?.[0]?.id ??
      availableFacilities[0]?.id ??
      null;

    setFacility(defaultFacilityId);

    const sortedDays = [...(workshop.days ?? [])].sort(
      (a, b) => a.dayNumber - b.dayNumber,
    );

    setDays(
      sortedDays.map((day, dayIndex) => ({
        id: day.id || `day-${dayIndex + 1}`,
        label: `Day ${day.dayNumber ?? dayIndex + 1}`,
        segments: [...(day.segments ?? [])]
          .sort((a, b) => a.segmentNumber - b.segmentNumber)
          .map((segment, segmentIndex) => ({
            id:
              segment.id ||
              `${day.id || dayIndex}-segment-${segmentIndex + 1}`,
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
        name:
          faculty.fullName ||
          `${faculty.firstName} ${faculty.lastName}`.trim(),
        role:
          faculty.medicalDesignation ||
          faculty.primaryClinicalRole ||
          "N/A",
      })),
    );

    setCapacity(workshop.capacity ?? 24);
    setAlert(workshop.alertAt ?? 5);
    setStandardRate(Number(workshop.standardBaseRate ?? 0));

    const primaryDiscount = [...(workshop.groupDiscounts ?? [])].sort(
      (a, b) => a.minimumAttendees - b.minimumAttendees,
    )[0];

    setMinAttendees(primaryDiscount?.minimumAttendees ?? 0);
    setGroupRate(Number(primaryDiscount?.groupRatePerPerson ?? 0));

    const firstDayDate = sortedDays[0]?.date ?? "";
    const normalizedRegistrationDeadline = workshop.registrationDeadline
      ? workshop.registrationDeadline.split("T")[0]
      : firstDayDate;

    setRegistrationDeadline(normalizedRegistrationDeadline);

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
    if (!isFacultyInputActive) {
      abortRef.current?.abort();
      setFacultySearching(false);
      return;
    }

    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setFacultySearching(true);
    setFacultyDropdownOpen(true);

    searchFaculty(
      debouncedFacultyQuery.trim() || undefined,
      1,
      10,
      controller.signal,
    )
      .then((res) => {
        if (controller.signal.aborted) return;

        setFacultyResults(res.data);
        setFacultyDropdownOpen(true);
      })
      .catch((error) => {
        if (error?.name !== "AbortError" && error?.code !== "ERR_CANCELED") {
          console.error("Faculty search failed:", error);
          setFacultyResults([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setFacultySearching(false);
        }
      });

    return () => controller.abort();
  }, [debouncedFacultyQuery, isFacultyInputActive]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        facultySearchRef.current &&
        !facultySearchRef.current.contains(event.target as Node)
      ) {
        setFacultyDropdownOpen(false);
        setIsFacultyInputActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    if (isHydrating) return;

    if (suppressDirtyRef.current) {
      suppressDirtyRef.current = false;
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
    if (!hasPendingChanges || isSaving) return;

    const timeout = window.setTimeout(() => {
      void handleSaveDraft("autosave");
    }, 60000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [changeVersion, hasPendingChanges, isSaving]);

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
          role:
            facultyItem.medicalDesignation ||
            facultyItem.primaryClinicalRole ||
            "N/A",
        },
      ]);
    }

    setFacultyQuery("");
    setFacultyDropdownOpen(false);
    setIsFacultyInputActive(false);
    setFacultyResults([]);
  }

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
              segment.id === segmentId ? { ...segment, ...patch } : segment,
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

  function buildPayload(
    status: WorkshopStatus,
    nextCoverImageUrl: string | null = coverImageUrl,
  ) {
    return buildWorkshopPayload({
      mode,
      title,
      blurb,
      coverImageUrl: nextCoverImageUrl,
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

  async function uploadCoverImageIfNeeded() {
    if (!pendingCoverFile) {
      return coverImageUrl;
    }

    const uploadMeta = await getUploadUrl({
      fileName: pendingCoverFile.name,
      contentType: pendingCoverFile.type || "application/octet-stream",
      folder: "courses",
    });

    await uploadFileToSignedUrl(uploadMeta.signedUrl, pendingCoverFile);

    suppressDirtyRef.current = true;

    if (coverPreviewUrlRef.current) {
      URL.revokeObjectURL(coverPreviewUrlRef.current);
      coverPreviewUrlRef.current = null;
    }

    setCoverImageUrl(uploadMeta.readUrl);
    setCoverPreviewUrl(uploadMeta.readUrl);
    setCoverFileName(pendingCoverFile.name);
    setPendingCoverFile(null);

    return uploadMeta.readUrl;
  }

  async function saveWorkshop(
    status: WorkshopStatus,
    modeToUse: "publish" | "draft" | "autosave",
  ) {
    setSaveMode(modeToUse);

    let resolvedCoverImageUrl = coverImageUrl;

    try {
      resolvedCoverImageUrl = await uploadCoverImageIfNeeded();
    } catch (error: any) {
      console.error("Failed to upload workshop cover image:", error);

      if (modeToUse !== "autosave") {
        window.alert(
          error?.response?.data?.message ||
          "Failed to upload cover image. Please try again.",
        );
      }

      setSaveMode(null);
      return false;
    }

    const payload = buildPayload(status, resolvedCoverImageUrl);
    const parsed = createWorkshopSchema.safeParse(payload);

    if (!parsed.success) {
      setDraftStatus("Draft");

      if (modeToUse !== "autosave") {
        window.alert(parsed.error.issues[0]?.message ?? "Validation error");
      }

      setSaveMode(null);
      return false;
    }

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
        workshopId
          ? "Failed to save workshop draft:"
          : "Failed to create workshop:",
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
      <WorkshopCreateHeader
        workshopId={workshopId}
        isShortPayload={isShortPayload}
        draftStatus={draftStatus}
        isSaving={isSaving}
        saveMode={saveMode}
        coursesListRoute={COURSES_LIST_ROUTE}
        onDiscard={navigateToCourses}
        onPublish={handlePublish}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <WorkshopDeliveryModeCard mode={mode} onChange={setMode} />

          <WorkshopEssentialsCard
            title={title}
            blurb={blurb}
            registrationDeadline={registrationDeadline}
            onTitleChange={setTitle}
            onBlurbChange={setBlurb}
            onRegistrationDeadlineChange={setRegistrationDeadline}
          />

          {isOnline ? (
            <WorkshopWebinarConfigCard
              webinarPlatform={webinarPlatform}
              meetingPassword={meetingPassword}
              meetingLink={meetingLink}
              recordAutomatically={recordAutomatically}
              onWebinarPlatformChange={setWebinarPlatform}
              onMeetingPasswordChange={setMeetingPassword}
              onMeetingLinkChange={setMeetingLink}
              onRecordAutomaticallyChange={setRecordAutomatically}
            />
          ) : null}

          <WorkshopSyllabusCard
            learningObjectives={learningObjectives}
            cme={cme}
            cmeCreditsCount={cmeCreditsCount}
            onLearningObjectivesChange={setLearningObjectives}
            onCmeChange={setCme}
            onCmeCreditsCountChange={setCmeCreditsCount}
          />

          <WorkshopScheduleCard
            days={days}
            onAddDay={addDay}
            onRemoveDay={removeDay}
            onAddSegment={addSegment}
            onRemoveSegment={removeSegment}
            onUpdateSegment={updateSegment}
          />

          <WorkshopFacultyCard
            facultySearchRef={facultySearchRef}
            facultyDropdownOpen={facultyDropdownOpen}
            facultySearching={facultySearching}
            facultyResults={facultyResults}
            facultyQuery={facultyQuery}
            selectedFaculty={selectedFaculty}
            onFacultyQueryChange={setFacultyQuery}
            onFacultyInputActiveChange={setIsFacultyInputActive}
            onFacultyDropdownOpenChange={setFacultyDropdownOpen}
            onSelectFaculty={selectFacultyFromSearch}
            onRemoveFaculty={removeFaculty}
          />
        </div>

        <WorkshopSidebar
          days={days}
          derivedTotalDays={derivedTotalDays}
          isOnline={isOnline}
          facility={facility}
          facilityOptions={facilityOptions}
          registrationDeadline={registrationDeadline}
          openLocations={openLocations}
          capacity={capacity}
          alert={alert}
          standardRate={standardRate}
          minAttendees={minAttendees}
          groupRate={groupRate}
          coverPreviewUrl={coverPreviewUrl}
          coverFileName={coverFileName}
          saveMode={saveMode}
          lastSavedLabel={lastSavedLabel}
          isSaving={isSaving}
          coverPreviewUrlRef={coverPreviewUrlRef}
          onFacilityChange={setFacility}
          onRegistrationDeadlineChange={setRegistrationDeadline}
          onOpenLocationsChange={setOpenLocations}
          onCapacityChange={setCapacity}
          onAlertChange={setAlert}
          onStandardRateChange={setStandardRate}
          onMinAttendeesChange={setMinAttendees}
          onGroupRateChange={setGroupRate}
          onCoverPreviewUrlChange={setCoverPreviewUrl}
          onCoverFileNameChange={setCoverFileName}
          onPendingCoverFileChange={setPendingCoverFile}
          onCoverImageUrlChange={setCoverImageUrl}
          onSaveDraft={() => void handleSaveDraft("draft")}
        />
      </div>
    </div>
  );
}