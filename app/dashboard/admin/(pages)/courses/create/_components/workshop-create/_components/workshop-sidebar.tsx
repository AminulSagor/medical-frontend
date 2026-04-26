import { Calendar, ImageIcon, Loader2, Save } from "lucide-react";
import ThemeDropdown, {
    ThemeDropdownOption,
} from "@/app/dashboard/admin/(pages)/users/faculty/register-faculty/_components/theme-dropdown";
import SeatMap from "./shared/seat-map";
import WorkshopCard from "./shared/workshop-card";
import {
    Label,
    TextInput,
} from "./shared/workshop-field";
import {
    SecondaryButton,
    TinyPill,
} from "./shared/workshop-buttons";
import { NativeDatePickerField } from "./workshop-essentials-card";
import type { DayAgenda, FacilityLocation } from "../_utils/workshop-create.types";
import ManageClinicalLocationsModal from "../../../../_components/manage-clinical-locations-modal";

type Props = {
    days: DayAgenda[];
    derivedTotalDays: number;
    isOnline: boolean;
    facility: FacilityLocation | null;
    facilityOptions: Array<ThemeDropdownOption<FacilityLocation>>;
    registrationDeadline: string;
    openLocations: boolean;
    capacity: number;
    alert: number;
    standardRate: number;
    minAttendees: number;
    groupRate: number;
    coverPreviewUrl: string | null;
    coverFileName: string | null;
    saveMode: "publish" | "draft" | "autosave" | null;
    lastSavedLabel: string;
    isSaving: boolean;
    coverPreviewUrlRef: React.MutableRefObject<string | null>;
    onFacilityChange: (value: FacilityLocation | null) => void;
    onRegistrationDeadlineChange: (value: string) => void;
    onOpenLocationsChange: (open: boolean) => void;
    onCapacityChange: (value: number) => void;
    onAlertChange: (value: number) => void;
    onStandardRateChange: (value: number) => void;
    onMinAttendeesChange: (value: number) => void;
    onGroupRateChange: (value: number) => void;
    onCoverPreviewUrlChange: (value: string | null) => void;
    onCoverFileNameChange: (value: string | null) => void;
    onPendingCoverFileChange: (value: File | null) => void;
    onCoverImageUrlChange: (value: string | null) => void;
    onSaveDraft: () => void;
};

export default function WorkshopSidebar({
    days,
    derivedTotalDays,
    isOnline,
    facility,
    facilityOptions,
    registrationDeadline,
    openLocations,
    capacity,
    alert,
    standardRate,
    minAttendees,
    groupRate,
    coverPreviewUrl,
    coverFileName,
    saveMode,
    lastSavedLabel,
    isSaving,
    coverPreviewUrlRef,
    onFacilityChange,
    onRegistrationDeadlineChange,
    onOpenLocationsChange,
    onCapacityChange,
    onAlertChange,
    onStandardRateChange,
    onMinAttendeesChange,
    onGroupRateChange,
    onCoverPreviewUrlChange,
    onCoverFileNameChange,
    onPendingCoverFileChange,
    onCoverImageUrlChange,
    onSaveDraft,
}: Props) {
    return (
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
                                onChange={onFacilityChange}
                                buttonClassName="mt-0 h-10 rounded-md px-3 py-0"
                            />
                        )}
                    </div>

                    <div>
                        <Label>Registration Deadline</Label>
                        <NativeDatePickerField
                            value={registrationDeadline}
                            onChange={onRegistrationDeadlineChange}
                            placeholder="YYYY-MM-DD"
                        />
                    </div>

                    {!isOnline ? (
                        <SecondaryButton
                            type="button"
                            onClick={() => onOpenLocationsChange(true)}
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
                            onChange={(event) => onCapacityChange(Number(event.target.value || 0))}
                            min={1}
                        />
                    </div>

                    <div>
                        <Label>Low Seat Alert At</Label>
                        <TextInput
                            type="number"
                            value={alert}
                            onChange={(event) => onAlertChange(Number(event.target.value || 0))}
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
                            onChange={(event) =>
                                onStandardRateChange(Number(event.target.value || 0))
                            }
                            min={0}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <Label>Minimum Attendees</Label>
                            <TextInput
                                type="number"
                                value={minAttendees}
                                onChange={(event) =>
                                    onMinAttendeesChange(Number(event.target.value || 0))
                                }
                                min={0}
                            />
                        </div>

                        <div>
                            <Label>Group Rate / Person</Label>
                            <TextInput
                                type="number"
                                value={groupRate}
                                onChange={(event) =>
                                    onGroupRateChange(Number(event.target.value || 0))
                                }
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
                            onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (coverPreviewUrlRef.current) {
                                    URL.revokeObjectURL(coverPreviewUrlRef.current);
                                    coverPreviewUrlRef.current = null;
                                }

                                if (file) {
                                    const previewUrl = URL.createObjectURL(file);
                                    coverPreviewUrlRef.current = previewUrl;
                                    onCoverPreviewUrlChange(previewUrl);
                                    onCoverFileNameChange(file.name);
                                    onPendingCoverFileChange(file);
                                } else {
                                    onCoverPreviewUrlChange(null);
                                    onCoverFileNameChange(null);
                                    onPendingCoverFileChange(null);
                                }

                                onCoverImageUrlChange(null);
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
                        onClick={onSaveDraft}
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

            <ManageClinicalLocationsModal
                open={openLocations}
                onClose={() => onOpenLocationsChange(false)}
                selectedId={facility ?? ""}
                onSelect={(selectedFacility: { id: FacilityLocation }) => {
                    onFacilityChange(selectedFacility.id);
                    onOpenLocationsChange(false);
                }}
            />
        </div>
    );
}