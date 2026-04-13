import { Bell } from "lucide-react";
import type {
  AccountProfile,
  SettingsSectionKey,
} from "@/types/user/account-settings/account-settings-type";
import type { UserProfileApiData } from "@/types/user/profile.types";
import SettingsCardShell from "./_components/settings-card-shell";
import { getUserProfile } from "@/service/user/profile.server.service";

function buildInitials(firstName: string, lastName: string, email: string) {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();

  if (first || last) return `${first}${last}` || "U";

  return email.trim().charAt(0).toUpperCase() || "U";
}

function createEmptyProfile(): AccountProfile {
  return {
    section: "public-profile",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    role: "",
    institution: "",
    npiNumber: "",
    avatarUrl: "",
    avatarInitials: "U",
  };
}

function mapProfileToModel(data: UserProfileApiData): AccountProfile {
  const firstName = data.firstName?.trim() ?? "";
  const lastName = data.lastName?.trim() ?? "";
  const email = data.emailAddress?.trim() ?? "";

  return {
    section: "public-profile",
    firstName,
    lastName,
    email,
    phone: data.phoneNumber ?? "",
    title: data.title ?? "",
    role: data.role ?? "",
    institution: data.institutionOrHospital ?? "",
    npiNumber: data.npiNumber ?? "",
    avatarUrl: data.profilePicture ?? "",
    avatarInitials: buildInitials(firstName, lastName, email),
  };
}

function resolveSection(sectionRaw?: string): SettingsSectionKey {
  return sectionRaw === "security-password"
    ? "security-password"
    : "public-profile";
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ section?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const section = resolveSection(sp.section);

  let profile = createEmptyProfile();

  try {
    const response = await getUserProfile();
    profile = mapProfileToModel(response.data);
  } catch (error) {
    console.error("Failed to load user profile", error);
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900">
            Account Settings
          </h1>
          <p className="mt-1 text-[12px] text-slate-500">
            Manage your personal information and account preferences
          </p>
        </div>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5">
        <SettingsCardShell
          model={{
            activeSection: section,
            profile,
          }}
        />
      </div>
    </div>
  );
}
