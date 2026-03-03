// app/(user)/(registered-user)/settings/page.tsx
import { Bell } from "lucide-react";
import SettingsCardShell from "./_components/settings-card-shell";
import { getAccountSettingsSeed } from "@/utils/account-settings/dummy-data/account-settings-data-util";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ section?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const sectionRaw = sp.section;

  const section =
    sectionRaw === "security-password" || sectionRaw === "payment-methods"
      ? sectionRaw
      : "public-profile";

  const model = await getAccountSettingsSeed(section);

  return (
    <div className="w-full">
      {/* Header (SSR) */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900">
            Account Settings
          </h1>
          <p className="mt-1 text-[12px] text-slate-500">
            Manage your personal information and account preferences
          </p>
        </div>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>

      {/* Main card */}
      <div className="mt-5">
        <SettingsCardShell model={model} />
      </div>
    </div>
  );
}