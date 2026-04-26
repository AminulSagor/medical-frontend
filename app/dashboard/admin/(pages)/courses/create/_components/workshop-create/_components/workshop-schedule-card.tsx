import { Calendar, CalendarPlus, Plus, Trash2 } from "lucide-react";

import WorkshopCard from "./shared/workshop-card";
import { Label, TextArea, TextInput } from "./shared/workshop-field";
import { SecondaryButton } from "./shared/workshop-buttons";
import {
    NativeDatePickerField,
    NativeTimePickerField,
} from "./workshop-essentials-card";
import type { DayAgenda, Segment } from "../_utils/workshop-create.types";

type Props = {
    days: DayAgenda[];
    onAddDay: () => void;
    onRemoveDay: (dayId: string) => void;
    onAddSegment: (dayId: string) => void;
    onRemoveSegment: (dayId: string, segmentId: string) => void;
    onUpdateSegment: (
        dayId: string,
        segmentId: string,
        patch: Partial<Segment>,
    ) => void;
};

export default function WorkshopScheduleCard({
    days,
    onAddDay,
    onRemoveDay,
    onAddSegment,
    onRemoveSegment,
    onUpdateSegment,
}: Props) {
    return (
        <WorkshopCard
            title="Course Schedule"
            subtitle="Leave empty to use short payload."
            icon={<Calendar size={16} className="text-[var(--primary)]" />}
            right={
                <SecondaryButton type="button" onClick={onAddDay}>
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
                                onClick={() => onRemoveDay(day.id)}
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
                                            onClick={() => onRemoveSegment(day.id, segment.id)}
                                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-white"
                                            aria-label="Remove segment"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="mt-3 space-y-3">
                                        <div>
                                            <Label>Course Topic</Label>
                                            <TextInput
                                                value={segment.topic}
                                                onChange={(event) =>
                                                    onUpdateSegment(day.id, segment.id, {
                                                        topic: event.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>Topic Details</Label>
                                            <TextArea
                                                value={segment.details}
                                                onChange={(event) =>
                                                    onUpdateSegment(day.id, segment.id, {
                                                        details: event.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)]">
                                            <div>
                                                <Label>Date</Label>
                                                <NativeDatePickerField
                                                    value={segment.date}
                                                    onChange={(value) =>
                                                        onUpdateSegment(day.id, segment.id, {
                                                            date: value,
                                                        })
                                                    }
                                                    placeholder="YYYY-MM-DD"
                                                />
                                            </div>

                                            <div>
                                                <Label>Start Time</Label>
                                                <NativeTimePickerField
                                                    value={segment.startTime}
                                                    onChange={(value) =>
                                                        onUpdateSegment(day.id, segment.id, {
                                                            startTime: value,
                                                        })
                                                    }
                                                    placeholder="08:00 AM"
                                                />
                                            </div>

                                            <div>
                                                <Label>End Time</Label>
                                                <NativeTimePickerField
                                                    value={segment.endTime}
                                                    onChange={(value) =>
                                                        onUpdateSegment(day.id, segment.id, {
                                                            endTime: value,
                                                        })
                                                    }
                                                    placeholder="12:00 PM"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <SecondaryButton type="button" onClick={() => onAddSegment(day.id)}>
                                <Plus size={14} />
                                Add Segment
                            </SecondaryButton>
                        </div>
                    </div>
                ))}

                <div className="flex justify-center pt-2">
                    <button
                        type="button"
                        onClick={onAddDay}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-900 active:scale-[0.99]"
                    >
                        <CalendarPlus size={16} />
                        + Add Day
                    </button>
                </div>
            </div>
        </WorkshopCard>
    );
}