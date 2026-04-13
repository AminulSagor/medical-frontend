import type { AccountSettingsPageModel } from "@/types/user/account-settings/account-settings-type";
import SettingsLeftNav from "./settings-left-nav";
import PublicProfilePanel from "./public-profile-panel";
import SecurityPasswordPanel from "./security-password-panel";

export default function SettingsCardShell({
  model,
}: {
  model: AccountSettingsPageModel;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="flex flex-col border-b border-slate-200 bg-slate-50/30 md:border-b-0 md:border-r">
          <div className="flex-1">
            <SettingsLeftNav active={model.activeSection} />
          </div>

          <div className="border-t border-slate-200 px-4 py-4">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            >
              <span className="text-slate-400">↩</span>
              Sign out
            </button>
          </div>
        </aside>

        <div className="p-6">
          {model.activeSection === "security-password" ? (
            <SecurityPasswordPanel />
          ) : (
            <PublicProfilePanel profile={model.profile} />
          )}
        </div>
      </div>
    </section>
  );
}
