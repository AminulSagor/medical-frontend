"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ImageOff,
  Mail,
  UploadCloud,
} from "lucide-react";
import type { AccountProfile } from "@/types/user/account-settings/account-settings-type";
import type {
  UpdateUserProfilePayload,
  UserProfileApiData,
} from "@/types/user/profile.types";
import { updateUserProfile } from "@/service/user/profile.service";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/service/upload/upload.service";

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

const USA_DOCTOR_TITLE_ROLE_OPTIONS = [
  "Anesthesiologist",
  "Cardiologist",
  "Dermatologist",
  "Emergency Medicine Physician",
  "Endocrinologist",
  "Family Medicine Physician",
  "Gastroenterologist",
  "General Surgeon",
  "Geriatrician",
  "Hematologist",
  "Hospitalist",
  "Infectious Disease Physician",
  "Internal Medicine Physician",
  "Nephrologist",
  "Neurologist",
  "Neurosurgeon",
  "Obstetrician-Gynecologist",
  "Oncologist",
  "Ophthalmologist",
  "Orthopedic Surgeon",
  "Otolaryngologist",
  "Pathologist",
  "Pediatrician",
  "Physiatrist",
  "Plastic Surgeon",
  "Psychiatrist",
  "Pulmonologist",
  "Radiologist",
  "Rheumatologist",
  "Urologist",
] as const;

function initialsFrom(firstName: string, lastName: string, email: string) {
  const a = (firstName?.trim()?.[0] ?? "").toUpperCase();
  const b = (lastName?.trim()?.[0] ?? "").toUpperCase();

  if (a || b) return `${a}${b}` || "U";

  return (email?.trim()?.[0] ?? "U").toUpperCase();
}

function getCombinedTitleRole(data: UserProfileApiData) {
  return data.role?.trim() || data.title?.trim() || "";
}

function mapProfileToForm(data: UserProfileApiData): AccountProfile {
  const firstName = data.firstName?.trim() || "";
  const lastName = data.lastName?.trim() || "";
  const email = data.emailAddress ?? "";
  const titleRole = getCombinedTitleRole(data);

  return {
    section: "public-profile",
    firstName,
    lastName,
    email,
    phone: data.phoneNumber ?? "",
    title: titleRole,
    role: titleRole,
    institution: data.institutionOrHospital ?? "",
    npiNumber: data.npiNumber ?? "",
    avatarUrl: data.profilePicture ?? "",
    avatarInitials: initialsFrom(firstName, lastName, email),
  };
}

function buildUpdatePayload(
  source: AccountProfile,
  profilePicture: string,
): UpdateUserProfilePayload {
  const titleRole = source.title.trim();

  return {
    profilePicture,
    firstName: source.firstName.trim(),
    lastName: source.lastName.trim(),
    phoneNumber: source.phone.trim(),
    title: titleRole,
    role: titleRole,
    institutionOrHospital: source.institution.trim(),
    npiNumber: source.npiNumber.trim(),
  };
}

function validateDraft(next: AccountProfile) {
  const errors: Record<string, string> = {};

  if (!next.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!next.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!next.phone.trim()) {
    errors.phone = "Phone number is required";
  }

  if (next.email && !/^\S+@\S+\.\S+$/.test(next.email)) {
    errors.email = "Invalid email address";
  }

  if (next.npiNumber.trim() && !/^\d+$/.test(next.npiNumber.trim())) {
    errors.npiNumber = "NPI number must contain digits only";
  }

  return errors;
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
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const avatarLabel = useMemo(
    () =>
      form.avatarInitials?.trim()
        ? form.avatarInitials
        : initialsFrom(form.firstName, form.lastName, form.email),
    [form.avatarInitials, form.firstName, form.lastName, form.email],
  );

  const titleRoleOptions = useMemo(() => {
    const current = form.title.trim();

    if (
      current &&
      !USA_DOCTOR_TITLE_ROLE_OPTIONS.some((option) => option === current)
    ) {
      return [current, ...USA_DOCTOR_TITLE_ROLE_OPTIONS];
    }

    return [...USA_DOCTOR_TITLE_ROLE_OPTIONS];
  }, [form.title]);

  function set<K extends keyof AccountProfile>(
    key: K,
    value: AccountProfile[K],
  ) {
    setForm((p) => ({ ...p, [key]: value }));
    setApiError("");
    setApiSuccess("");
  }

  function setTitleRole(value: string) {
    setForm((p) => ({
      ...p,
      title: value,
      role: value,
    }));
    setApiError("");
    setApiSuccess("");
  }

  function onCancel() {
    setForm({ ...savedForm });
    setAvatarPreview(savedForm.avatarUrl || "");
    setPendingAvatarFile(null);
    setAvatarLoadFailed(false);
    setErrors({});
    setApiError("");
    setApiSuccess("");
  }

  async function uploadAvatarIfNeeded() {
    if (!pendingAvatarFile) {
      return form.avatarUrl.trim();
    }

    const uploadUrlResponse = await getUploadUrl({
      fileName: pendingAvatarFile.name,
      contentType: pendingAvatarFile.type || "application/octet-stream",
      folder: "profile-pictures",
    });

    await uploadFileToSignedUrl(uploadUrlResponse.signedUrl, pendingAvatarFile);

    return uploadUrlResponse.readUrl;
  }

  async function onRemovePhoto() {
    setApiError("");
    setApiSuccess("");

    try {
      setIsRemovingPhoto(true);

      const response = await updateUserProfile(buildUpdatePayload(savedForm, ""));
      const nextSavedForm = mapProfileToForm(response.data);

      setSavedForm(nextSavedForm);
      setForm((prev) => ({
        ...prev,
        avatarUrl: "",
        avatarInitials: nextSavedForm.avatarInitials,
      }));
      setAvatarPreview("");
      setPendingAvatarFile(null);
      setAvatarLoadFailed(false);
      setApiSuccess(response.message || "Profile photo removed successfully");
    } catch (error) {
      console.error("Failed to remove profile photo:", error);
      setApiError("Failed to remove profile photo");
    } finally {
      setIsRemovingPhoto(false);
    }
  }

  async function onSave() {
    setApiError("");
    setApiSuccess("");

    const nextErrors = validateDraft(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    try {
      setIsSaving(true);

      const uploadedAvatarUrl = await uploadAvatarIfNeeded();

      const response = await updateUserProfile(
        buildUpdatePayload(form, uploadedAvatarUrl),
      );

      const nextForm = mapProfileToForm(response.data);

      setForm(nextForm);
      setSavedForm(nextForm);
      setAvatarPreview(nextForm.avatarUrl || "");
      setPendingAvatarFile(null);
      setAvatarLoadFailed(false);
      setErrors({});
      setApiSuccess(response.message || "Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setApiError("Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <div className="grid h-[56px] w-[56px] place-items-center overflow-hidden rounded-full bg-sky-200 text-white ring-1 ring-slate-200">
            {!avatarPreview ? (
              <span className="text-[16px] font-extrabold">{avatarLabel}</span>
            ) : avatarLoadFailed ? (
              <ImageOff className="h-6 w-6 text-slate-500" />
            ) : (
              <img
                src={avatarPreview}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
                onError={() => setAvatarLoadFailed(true)}
              />
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
                const file = e.target.files?.[0];
                if (!file) return;

                const url = URL.createObjectURL(file);
                setPendingAvatarFile(file);
                setAvatarPreview(url);
                setAvatarLoadFailed(false);
                set("avatarUrl", url);
              }}
            />
          </label>

          <button
            type="button"
            onClick={onRemovePhoto}
            disabled={isRemovingPhoto}
            className="text-[12px] font-semibold text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRemovingPhoto ? "Removing..." : "Remove"}
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
          {errors.firstName ? (
            <div className="mt-1 text-[11px] text-rose-600">{errors.firstName}</div>
          ) : null}
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
          {errors.lastName ? (
            <div className="mt-1 text-[11px] text-rose-600">{errors.lastName}</div>
          ) : null}
        </div>

        <div>
          <label className="text-[12px] font-semibold text-slate-700">
            Email Address
          </label>
          <div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Mail className="h-4 w-4 text-slate-400" />
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
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={cx(
              "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
              errors.phone
                ? "border-rose-300 ring-4 ring-rose-50"
                : "border-slate-200 focus:ring-4 focus:ring-sky-100",
            )}
          />
          {errors.phone ? (
            <div className="mt-1 text-[11px] text-rose-600">{errors.phone}</div>
          ) : null}
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
            <div className="relative mt-2">
              <select
                value={form.title}
                onChange={(e) => setTitleRole(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-[13px] text-slate-900 outline-none focus:ring-4 focus:ring-sky-100"
              >
                <option value="">Select title / role</option>
                {titleRoleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-700">
              Institution / Hospital <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              value={form.institution}
              onChange={(e) => set("institution", e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 outline-none focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-700">
              NPI Number <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              value={form.npiNumber}
              onChange={(e) => set("npiNumber", e.target.value)}
              placeholder="10-digit number"
              className={cx(
                "mt-2 h-11 w-full rounded-xl border bg-white px-4 text-[13px] text-slate-900 outline-none",
                errors.npiNumber
                  ? "border-rose-300 ring-4 ring-rose-50"
                  : "border-slate-200 focus:ring-4 focus:ring-sky-100",
              )}
            />
            {errors.npiNumber ? (
              <div className="mt-1 text-[11px] text-rose-600">{errors.npiNumber}</div>
            ) : null}
          </div>
        </div>
      </div>

      {apiError ? (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-700">
          {apiError}
        </div>
      ) : null}

      {apiSuccess ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">
          {apiSuccess}
        </div>
      ) : null}

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
          disabled={isSaving || isRemovingPhoto}
          className="h-10 rounded-xl bg-sky-500 px-5 text-[12px] font-extrabold text-white shadow-[0_10px_18px_rgba(14,165,233,0.25)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
