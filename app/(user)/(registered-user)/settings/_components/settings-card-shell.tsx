import type { AccountSettingsPageModel } from "@/types/account-settings/account-settings-type";
import SettingsLeftNav from "./settings-left-nav";
import PublicProfilePanel from "./public-profile-panel";
import SecurityPasswordPanel from "./security-password-panel";
import PaymentMethodsPanel from "./payment-method-panel";

export default function SettingsCardShell({
  model,
}: {
  model: AccountSettingsPageModel;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        
        {/* LEFT SIDEBAR */}
        <aside className="flex flex-col border-b border-slate-200 bg-slate-50/30 md:border-b-0 md:border-r">
          
          {/* Top nav area */}
          <div className="flex-1">
            <SettingsLeftNav active={model.activeSection} />
          </div>

          {/* Bottom Sign Out */}
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

        {/* RIGHT CONTENT */}
        <div className="p-6">
          {model.activeSection === "public-profile" ? (
            <PublicProfilePanel
              profile={model.profile}
              roleOptions={model.roleOptions}
            />
          ) : model.activeSection === "security-password" ? (
            <SecurityPasswordPanel />
          ) : model.activeSection === "payment-methods" ? (
            <PaymentMethodsPanel />
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