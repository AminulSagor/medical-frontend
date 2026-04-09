"use client";

import { useMemo, useState } from "react";
import { Lock, UploadCloud } from "lucide-react";
import type { AccountProfile } from "@/types/user/account-settings/account-settings-type";
import { accountProfileSchema } from "@/schema/account-settings/account-settings-schema";
import { updateUserProfile } from "@/service/user/profile.service";

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function initialsFrom(firstName: string, lastName: string) {
  const a = (firstName?.trim()?.[0] ?? "").toUpperCase();
  const b = (lastName?.trim()?.[0] ?? "").toUpperCase();
  return a + b || "U";
}

function mapProfileToForm(data: {
  profilePicture: string | null;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
  title: string | null;
  role: string | null;
  institutionOrHospital: string | null;
  npiNumber: string | null;
}): AccountProfile {
  return {
    section: "public-profile",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    email: data.emailAddress ?? "",
    phone: data.phoneNumber ?? "",
    titleRole: data.title ?? data.role ?? "",
    institution: data.institutionOrHospital ?? "",
    npiNumber: data.npiNumber ?? "",
    avatarUrl: data.profilePicture ?? "",
    avatarInitials: `${data.firstName?.[0] ?? ""}${data.lastName?.[0] ?? ""}`.toUpperCase() || "U",
  };
}

export default function PublicProfileFormClient({
  initial,
}: {
  initial: AccountProfile;
}) {
  const [savedForm, setSavedForm] = useState<AccountProfile>({ ...initial });
  const [form, setForm] = useState<AccountProfile>({ ...initial });
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initial.avatarUrl || "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const avatarLabel = useMemo(
    () =>
      form.avatarInitials?.trim()
        ? form.avatarInitials
        : initialsFrom(form.firstName, form.lastName),
    [form.avatarInitials, form.firstName, form.lastName],
  );

  function set<K extends keyof AccountProfile>(
    key: K,
    value: AccountProfile[K],
  ) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function validateDraft(next: AccountProfile) {
    const res = accountProfileSchema.safeParse(next);
    if (res.success) {
      setErrors({});
      return true;
    }

    const map: Record<string, string> = {};
    for (const issue of res.error.issues) {
      const k = issue.path?.[0];
      if (typeof k === "string" && !map[k]) {
        map[k] = issue.message;
      }
    }

    setErrors(map);
    return false;
  }

  async function onSave() {
    const ok = validateDraft(form);
    if (!ok) return;

    try {
      setIsSaving(true);

      const response = await updateUserProfile({
        profilePicture: form.avatarUrl || null,
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phone || null,
        title: form.titleRole || null,
        role: form.titleRole || null,
        institutionOrHospital: form.institution || null,
        npiNumber: form.npiNumber || null,
      });

      const nextForm = mapProfileToForm(response.data);

      setForm(nextForm);
      setSavedForm(nextForm);
      setAvatarPreview(nextForm.avatarUrl || "");
      setErrors({});

      alert(response.message || "Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  }

  function onCancel() {
    setForm({ ...savedForm });
    setAvatarPreview(savedForm.avatarUrl || "");
    setErrors({});
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-sky-200 text-white ring-1 ring-slate-200">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-[16px] font-extrabold">{avatarLabel}</span>
            )}
          </div>

          <div className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white ring-1 ring-slate-200">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-[12px] font-semibold text-sky-700 shadow-sm hover:bg-sky-50">
            <UploadCloud className="h-4 w-4" />
            Upload New Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const url = URL.createObjectURL(f);
                setAvatarPreview(url);
                set("avatarUrl", url);
              }}
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setAvatarPreview("");
              set("avatarUrl", "");
            }}
            className="text-[12px] font-semibold text-slate-500 hover:text-slate-700"
          >
            Remove
          </button>

          <div className="w-full text-[11px] text-slate-400">
            Supported formats: JPG, PNG. Max size 5MB.
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            First Name
          </label>
          <input
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className={cx(
              "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
              errors.firstName
                ? "border-rose-300 ring-4 ring-rose-50"
                : "border-slate-200 focus:ring-4 focus:ring-sky-100",
            )}
          />
          {errors.firstName && (
            <div className="mt-1 text-[11px] text-rose-600">
              {errors.firstName}
            </div>
          )}
        </div>

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Last Name
          </label>
          <input
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className={cx(
              "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
              errors.lastName
                ? "border-rose-300 ring-4 ring-rose-50"
                : "border-slate-200 focus:ring-4 focus:ring-sky-100",
            )}
          />
          {errors.lastName && (
            <div className="mt-1 text-[11px] text-rose-600">
              {errors.lastName}
            </div>
          )}
        </div>

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Email Address
          </label>
          <div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Lock className="h-4 w-4 text-slate-400" />
            <input
              value={form.email}
              readOnly
              className="w-full bg-transparent text-[13px] text-slate-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Phone Number
          </label>
          <input
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            className={cx(
              "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
              errors.phone
                ? "border-rose-300 ring-4 ring-rose-50"
                : "border-slate-200 focus:ring-4 focus:ring-sky-100",
            )}
          />
          {errors.phone && (
            <div className="mt-1 text-[11px] text-rose-600">{errors.phone}</div>
          )}
        </div>
      </div>

      <div className="my-6 h-px bg-slate-100" />

      <div>
        <div className="text-[14px] font-semibold text-slate-900">
          Professional Details
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-[12px] font-semibold text-slate-700">
              Title / Role
            </label>
            <input
              value={form.titleRole}
              onChange={(e) => set("titleRole", e.target.value)}
              className={cx(
                "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
                errors.titleRole
                  ? "border-rose-300 ring-4 ring-rose-50"
                  : "border-slate-200 focus:ring-4 focus:ring-sky-100",
              )}
            />
            {errors.titleRole && (
              <div className="mt-1 text-[11px] text-rose-600">
                {errors.titleRole}
              </div>
            )}
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-700">
              Institution / Hospital{" "}
              <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              value={form.institution ?? ""}
              onChange={(e) => set("institution", e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-700">
              NPI Number <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              value={form.npiNumber ?? ""}
              onChange={(e) => set("npiNumber", e.target.value)}
              placeholder="10-digit number"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
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
          disabled={isSaving}
          className="h-10 rounded-xl bg-sky-500 px-5 text-[12px] font-extrabold text-white shadow-[0_10px_18px_rgba(14,165,233,0.25)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}