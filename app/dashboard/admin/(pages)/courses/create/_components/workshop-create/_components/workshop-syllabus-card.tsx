import { Calendar } from "lucide-react";

import RichTextEditor from "./shared/rich-text-editor";
import WorkshopCard from "./shared/workshop-card";
import { Label, SectionLabel, TextInput } from "./shared/workshop-field";

type Props = {
    learningObjectives: string;
    cme: boolean;
    cmeCreditsCount: string;
    onLearningObjectivesChange: (value: string) => void;
    onCmeChange: (value: boolean) => void;
    onCmeCreditsCountChange: (value: string) => void;
};

export default function WorkshopSyllabusCard({
    learningObjectives,
    cme,
    cmeCreditsCount,
    onLearningObjectivesChange,
    onCmeChange,
    onCmeCreditsCountChange,
}: Props) {
    return (
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
                        onChange={onLearningObjectivesChange}
                        placeholder="Leave empty to use short API"
                    />
                </div>

                <label className="flex items-center gap-3 text-xs text-slate-600">
                    <input
                        type="checkbox"
                        checked={cme}
                        onChange={(event) => {
                            onCmeChange(event.target.checked);

                            if (!event.target.checked) {
                                onCmeCreditsCountChange("");
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
                            onChange={(event) => onCmeCreditsCountChange(event.target.value)}
                            placeholder="e.g., 8"
                            min={0}
                            step="0.1"
                        />
                    </div>
                ) : null}
            </div>
        </WorkshopCard>
    );
}