import { Loader2, Search, Trash2 } from "lucide-react";

import WorkshopCard from "./shared/workshop-card";
import { Label, TextInput } from "./shared/workshop-field";
import type { Faculty } from "@/types/admin/faculty.types";
import type { FacultyChip } from "../_utils/workshop-create.types";

type Props = {
    facultySearchRef: React.RefObject<HTMLDivElement | null>;
    facultyDropdownOpen: boolean;
    facultySearching: boolean;
    facultyResults: Faculty[];
    facultyQuery: string;
    selectedFaculty: FacultyChip[];
    onFacultyQueryChange: (value: string) => void;
    onFacultyInputActiveChange: (value: boolean) => void;
    onFacultyDropdownOpenChange: (value: boolean) => void;
    onSelectFaculty: (faculty: Faculty) => void;
    onRemoveFaculty: (id: string) => void;
};

export default function WorkshopFacultyCard({
    facultySearchRef,
    facultyDropdownOpen,
    facultySearching,
    facultyResults,
    facultyQuery,
    selectedFaculty,
    onFacultyQueryChange,
    onFacultyInputActiveChange,
    onFacultyDropdownOpenChange,
    onSelectFaculty,
    onRemoveFaculty,
}: Props) {
    return (
        <WorkshopCard
            title="Faculty & Instructors"
            subtitle="Selecting faculty switches to the full payload."
            icon={<Search size={16} className="text-[var(--primary)]" />}
        >
            <div className="space-y-4">
                <div ref={facultySearchRef} className="relative">
                    <Label>Search Faculty</Label>

                    {facultyDropdownOpen ? (
                        <div className="absolute bottom-full left-0 z-20 mb-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                            {facultySearching ? (
                                <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
                                    <Loader2 size={15} className="animate-spin" />
                                    Loading faculty...
                                </div>
                            ) : facultyResults.length > 0 ? (
                                <div className="space-y-1">
                                    {facultyResults.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => onSelectFaculty(item)}
                                            className="flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition hover:bg-slate-50"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {item.firstName} {item.lastName}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {item.medicalDesignation ||
                                                        item.primaryClinicalRole ||
                                                        "N/A"}
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

                    <div className="relative">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <TextInput
                            value={facultyQuery}
                            onFocus={() => {
                                onFacultyInputActiveChange(true);
                                onFacultyDropdownOpenChange(true);
                            }}
                            onChange={(event) => {
                                onFacultyQueryChange(event.target.value);

                                if (!facultyDropdownOpen) {
                                    onFacultyDropdownOpenChange(true);
                                }
                            }}
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
                                onClick={() => onRemoveFaculty(item.id)}
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
    );
}