import SecurityPasswordFormClient from "./security-password-form";


export default function SecurityPasswordPanel() {
  return (
    <div>
      <div>
        <div className="text-[14px] font-semibold text-slate-900">
          Password &amp; Security
        </div>
        <div className="mt-1 text-[12px] text-slate-500">
          Manage your password and protect your account.
        </div>
      </div>

      <div className="mt-6">
        <SecurityPasswordFormClient />
      </div>
    </div>
  );
}