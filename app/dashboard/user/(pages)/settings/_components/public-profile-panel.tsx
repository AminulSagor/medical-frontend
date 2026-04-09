import type { AccountProfile } from "@/types/user/account-settings/account-settings-type";
import PublicProfileFormClient from "./public-profile-form";

export default function PublicProfilePanel({
  profile,
}: {
  profile: AccountProfile;
}) {
  return (
    <div>
      <div>
        <div className="text-[14px] font-semibold text-slate-900">
          Personal Information
        </div>
        <div className="mt-1 text-[12px] text-slate-500">
          Update your photo and personal details visible on the platform.
        </div>
      </div>

      <div className="mt-5">
        <PublicProfileFormClient initial={profile} />
      </div>
    </div>
  );
}