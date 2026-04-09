"use client";

import { useEffect, useMemo, useState } from "react";
import { AtSign } from "lucide-react";
import { updateAdminEmail } from "@/service/admin/user-settings.service";
import { getToken } from "@/utils/token/cookie_utils";
import { decodeToken } from "@/utils/decode-token.utils";

function CardShell({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 p-5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 ring-1 ring-sky-100 text-sky-700">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <div className="text-xs text-slate-500">{subtitle}</div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-wider text-slate-500">
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none",
        "placeholder:text-slate-400 focus:border-sky-200 focus:ring-2 focus:ring-sky-100",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export default function UpdateEmailCard() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current email from JWT token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.medicalEmail) {
        setCurrentEmail(decoded.medicalEmail);
      }
    }
    setLoading(false);
  }, []);

  const canSubmit = useMemo(() => {
    if (!email || !confirm) return false;
    if (email !== confirm) return false;
    // light validation
    if (!email.includes("@") || !email.includes(".")) return false;
    return true;
  }, [email, confirm]);

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await updateAdminEmail({
        newEmail: email,
      });
      setCurrentEmail(response.medicalEmail || email);
      setEmail("");
      setConfirm("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to update email:", err);
      setError(err.response?.data?.message || "Failed to update email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CardShell
      title="Update Email Address"
      subtitle={
        <>
          Current Email:{" "}
          <span className="font-medium text-sky-600">
            {loading ? "Loading..." : currentEmail}
          </span>
        </>
      }
      icon={<AtSign size={18} />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>NEW EMAIL</Label>
          <TextInput
            placeholder="Enter new email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="space-y-2">
          <Label>CONFIRM NEW EMAIL</Label>
          <TextInput
            placeholder="Re-enter new email address"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="text"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={[
            "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-white transition",
            "bg-[var(--primary)] hover:bg-[var(--primary-hover)]",
            "disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:bg-[var(--primary)]",
          ].join(" ")}
        >
          {submitting ? "Updating..." : "Update Email Address"}
        </button>

        {email && confirm && email !== confirm && (
          <p className="mt-2 text-xs text-red-500">Emails do not match.</p>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}

        {success && (
          <p className="mt-2 text-xs text-green-600">Email updated successfully!</p>
        )}
      </div>
    </CardShell>
  );
}
