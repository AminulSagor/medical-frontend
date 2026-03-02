// app/(user)/(registered-user)/settings/_components/settings-card-shell.tsx
import type { AccountSettingsPageModel } from "@/types/account-settings/account-settings-type";
import SettingsLeftNav from "./settings-left-nav";
import PublicProfilePanel from "./public-profile-panel";

export default function SettingsCardShell({ model }: { model: AccountSettingsPageModel }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        {/* left nav */}
        <aside className="border-b border-slate-200 bg-slate-50/30 md:border-b-0 md:border-r">
          <SettingsLeftNav active={model.activeSection} />
          <div className="hidden md:block px-4 pb-4">
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-700"
            >
              <span className="text-slate-400">↩</span> Sign out
            </button>
          </div>
        </aside>

        {/* right */}
        <div className="p-6">
          {model.activeSection === "public-profile" ? (
            <PublicProfilePanel profile={model.profile} roleOptions={model.roleOptions} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-[12px] text-slate-600">
              This section UI will be added later.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}