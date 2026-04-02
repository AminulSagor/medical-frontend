"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, Circle } from "lucide-react";
import { securityPasswordSchema } from "@/schema/account-settings/security-password-schema";
import type {
  SecurityPasswordDraft,
  SecurityPasswordPayload,
} from "@/types/user/account-settings/security-password-type";

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

const EMPTY: SecurityPasswordDraft = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function hasUppercase(v: string) {
  return /[A-Z]/.test(v);
}
function hasNumberOrSymbol(v: string) {
  return /[0-9\W_]/.test(v);
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type,
  showToggle,
  onToggle,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type: "text" | "password";
  showToggle: boolean;
  onToggle?: () => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-[12px] font-semibold text-slate-700">
        {label}
      </label>

      <div
        className={cx(
          "mt-2 flex h-11 w-full items-center gap-2 rounded-xl border bg-white px-3",
          error
            ? "border-rose-300 ring-4 ring-rose-50"
            : "border-slate-200 focus-within:ring-4 focus-within:ring-sky-100",
        )}
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg text-slate-400">
          <Lock className="h-4 w-4" />
        </span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className="h-full w-full bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400"
        />

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label={type === "password" ? "Show password" : "Hide password"}
          >
            {type === "password" ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && <div className="mt-1 text-[11px] text-rose-600">{error}</div>}
    </div>
  );
}

export default function SecurityPasswordFormClient() {
  const [form, setForm] = useState<SecurityPasswordDraft>({ ...EMPTY });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const req = useMemo(() => {
    const v = form.newPassword || "";
    return {
      min8: v.length >= 8,
      upper: hasUppercase(v),
      numOrSym: hasNumberOrSymbol(v),
    };
  }, [form.newPassword]);

  function set<K extends keyof SecurityPasswordDraft>(
    key: K,
    value: SecurityPasswordDraft[K],
  ) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function validateDraft(next: SecurityPasswordDraft) {
    const res = securityPasswordSchema.safeParse(next);
    if (res.success) {
      setErrors({});
      return { ok: true as const, data: res.data };
    }

    const map: Record<string, string> = {};
    for (const issue of res.error.issues) {
      const k = issue.path?.[0];
      if (typeof k === "string" && !map[k]) map[k] = issue.message;
    }
    setErrors(map);
    return { ok: false as const, data: null };
  }

  function onCancel() {
    setForm({ ...EMPTY });
    setErrors({});
    setShow({ current: false, next: false, confirm: false });
  }

  function onSave() {
    // ✅ later: call backend API
    const res = validateDraft(form);
    if (!res.ok) return;

    // Convert validated form to backend payload shape
    const payload: SecurityPasswordPayload = {
      currentPassword: res.data.currentPassword,
      newPassword: res.data.newPassword,
    };

    console.log("CHANGE PASSWORD payload:", payload);
  }

  return (
    <div>
      <div className="space-y-5">
        <Field
          label="Current Password"
          value={form.currentPassword}
          onChange={(v) => set("currentPassword", v)}
          placeholder="••••••••••••"
          type={show.current ? "text" : "password"}
          showToggle
          onToggle={() => setShow((p) => ({ ...p, current: !p.current }))}
          error={errors.currentPassword}
        />

        <Field
          label="New Password"
          value={form.newPassword}
          onChange={(v) => set("newPassword", v)}
          placeholder="Enter new password"
          type={show.next ? "text" : "password"}
          showToggle
          onToggle={() => setShow((p) => ({ ...p, next: !p.next }))}
          error={errors.newPassword}
        />

        <Field
          label="Confirm New Password"
          value={form.confirmNewPassword}
          onChange={(v) => set("confirmNewPassword", v)}
          placeholder="Confirm new password"
          type={show.confirm ? "text" : "password"}
          showToggle
          onToggle={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
          error={errors.confirmNewPassword}
        />

        <div className="pt-1">
          <div className="text-[12px] font-semibold text-slate-700">
            Password Requirements:
          </div>

          <div className="mt-3 space-y-2 text-[12px] text-slate-600">
            <div className="flex items-center gap-2">
              {req.min8 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 text-slate-300" />
              )}
              <span>At least 8 characters</span>
            </div>

            <div className="flex items-center gap-2">
              {req.upper ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 text-slate-300" />
              )}
              <span>At least one uppercase letter</span>
            </div>

            <div className="flex items-center gap-2">
              {req.numOrSym ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 text-slate-300" />
              )}
              <span>At least one number or symbol</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-5">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-xl px-4 text-[12px] font-semibold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="h-10 rounded-xl bg-sky-500 px-5 text-[12px] font-extrabold text-white shadow-[0_10px_18px_rgba(14,165,233,0.25)] hover:opacity-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
