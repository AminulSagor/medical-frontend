import Link from "next/link";
import { IdCard, Lock } from "lucide-react";
import type { SettingsSectionKey } from "@/types/user/account-settings/account-settings-type";

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

const NAV: Array<{
  key: SettingsSectionKey;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    key: "public-profile",
    label: "Public Profile",
    icon: <IdCard className="h-5 w-5" />,
  },
  {
    key: "security-password",
    label: "Security & Password",
    icon: <Lock className="h-5 w-5" />,
  },
];

export default function SettingsLeftNav({
  active,
}: {
  active: SettingsSectionKey;
}) {
  return (
    <div className="p-4">
      <nav className="space-y-1">
        {NAV.map((it) => {
          const isActive = it.key === active;

          return (
            <Link
              key={it.key}
              href={`/dashboard/user/settings?section=${it.key}`}
              className={cx(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition",
                isActive
                  ? "bg-sky-50 text-sky-700"
                  : "text-slate-700 hover:bg-slate-50",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cx(
                  "absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full",
                  isActive ? "bg-sky-500" : "bg-transparent",
                )}
                aria-hidden="true"
              />

              <span
                className={cx(
                  "grid h-10 w-10 place-items-center rounded-xl border bg-white",
                  isActive
                    ? "border-sky-200 text-sky-600"
                    : "border-slate-200 text-slate-600",
                )}
                aria-hidden="true"
              >
                {it.icon}
              </span>

              <span
                className={cx(
                  "text-[14px] font-semibold",
                  isActive ? "text-sky-700" : "text-slate-800",
                )}
              >
                {it.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
