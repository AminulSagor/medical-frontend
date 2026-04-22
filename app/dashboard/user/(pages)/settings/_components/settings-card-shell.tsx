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
        <aside className="border-b border-slate-200 bg-slate-50/30 md:border-b-0 md:border-r">
          <SettingsLeftNav active={model.activeSection} />
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
