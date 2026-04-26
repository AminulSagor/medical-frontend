import ThemeDropdown from "@/app/dashboard/admin/(pages)/users/faculty/register-faculty/_components/theme-dropdown";
import WorkshopCard from "./shared/workshop-card";
import { Label, TextInput } from "./shared/workshop-field";
import { WEBINAR_PLATFORM_OPTIONS } from "../_utils/workshop-create.constants";
import type { WebinarPlatform } from "../_utils/workshop-create.types";

type Props = {
    webinarPlatform: WebinarPlatform | null;
    meetingPassword: string;
    meetingLink: string;
    recordAutomatically: boolean;
    onWebinarPlatformChange: (value: WebinarPlatform | null) => void;
    onMeetingPasswordChange: (value: string) => void;
    onMeetingLinkChange: (value: string) => void;
    onRecordAutomaticallyChange: (value: boolean) => void;
};

export default function WorkshopWebinarConfigCard({
    webinarPlatform,
    meetingPassword,
    meetingLink,
    recordAutomatically,
    onWebinarPlatformChange,
    onMeetingPasswordChange,
    onMeetingLinkChange,
    onRecordAutomaticallyChange,
}: Props) {
    return (
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
                            onChange={onWebinarPlatformChange}
                            buttonClassName="mt-0 h-10 rounded-md px-3 py-0"
                        />
                    </div>

                    <div>
                        <Label>Meeting Password</Label>
                        <TextInput
                            value={meetingPassword}
                            onChange={(event) => onMeetingPasswordChange(event.target.value)}
                            placeholder="e.g., Med2026!"
                        />
                    </div>
                </div>

                <div>
                    <Label>Meeting Link</Label>
                    <TextInput
                        value={meetingLink}
                        onChange={(event) => onMeetingLinkChange(event.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <label className="flex items-center gap-3 text-xs text-slate-600">
                    <button
                        type="button"
                        onClick={() => onRecordAutomaticallyChange(!recordAutomatically)}
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
    );
}