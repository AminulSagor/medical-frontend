import { Calendar, Clock } from "lucide-react";
import { useRef } from "react";

import WorkshopCard from "./shared/workshop-card";
import {
    Label,
    TextArea,
    TextInput,
} from "./shared/workshop-field";
import {
    normalizeTimeDisplay,
    toNativeTimeValue,
} from "../_utils/workshop-create-formatters";

export function NativeDatePickerField({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openPicker = () => {
        const input = inputRef.current;
        if (!input) return;

        try {
            (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
        } catch {
            input.focus();
            input.click();
        }
    };

    return (
        <div className="relative" onClick={openPicker}>
            <TextInput
                value={value}
                readOnly
                placeholder={placeholder}
                className="cursor-pointer pr-10"
            />

            <Calendar
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                ref={inputRef}
                type="date"
                value={value || ""}
                onChange={(event) => onChange(event.target.value)}
                onClick={(event) => {
                    event.stopPropagation();
                    openPicker();
                }}
                className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
                tabIndex={-1}
                aria-label={placeholder || "Select date"}
            />
        </div>
    );
}

export function NativeTimePickerField({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openPicker = () => {
        const input = inputRef.current;
        if (!input) return;

        try {
            (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
        } catch {
            input.focus();
            input.click();
        }
    };

    return (
        <div className="relative" onClick={openPicker}>
            <TextInput
                value={value}
                readOnly
                placeholder={placeholder}
                className="cursor-pointer pr-10"
            />

            <Clock
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                ref={inputRef}
                type="time"
                value={toNativeTimeValue(value)}
                onChange={(event) => onChange(normalizeTimeDisplay(event.target.value))}
                onClick={(event) => {
                    event.stopPropagation();
                    openPicker();
                }}
                className="pointer-events-none absolute bottom-0 left-0 h-0 w-0 opacity-0"
                tabIndex={-1}
                aria-label={placeholder || "Select time"}
            />
        </div>
    );
}

type Props = {
    title: string;
    blurb: string;
    registrationDeadline: string;
    onTitleChange: (value: string) => void;
    onBlurbChange: (value: string) => void;
    onRegistrationDeadlineChange: (value: string) => void;
};

export default function WorkshopEssentialsCard({
    title,
    blurb,
    registrationDeadline,
    onTitleChange,
    onBlurbChange,
    onRegistrationDeadlineChange,
}: Props) {
    return (
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
                        onChange={(event) => onTitleChange(event.target.value)}
                        placeholder="e.g., Advanced Airway Management"
                    />
                </div>

                <div>
                    <Label>Short Blurb</Label>
                    <TextArea
                        value={blurb}
                        onChange={(event) => onBlurbChange(event.target.value)}
                        placeholder="Brief description for the course catalog..."
                    />
                </div>

                <div>
                    <Label>Registration Deadline</Label>
                    <NativeDatePickerField
                        value={registrationDeadline}
                        onChange={onRegistrationDeadlineChange}
                        placeholder="YYYY-MM-DD"
                    />
                </div>
            </div>
        </WorkshopCard>
    );
}