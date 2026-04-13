import { accountProfileSchema } from "@/schema/account-settings/account-settings-schema";
import { getUserProfile } from "@/service/user/profile.server.service";
import { AccountSettingsPageModel } from "@/types/user/account-settings/account-settings-type";

function toCleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveProfileNames(profileData: Record<string, unknown>) {
  let firstName = toCleanString(profileData.firstName);
  let lastName = toCleanString(profileData.lastName);

  const fullName =
    toCleanString(profileData.fullName) ||
    toCleanString(profileData.fullLegalName) ||
    toCleanString(profileData.name);

  if ((!firstName || !lastName) && fullName) {
    const nameParts = fullName.split(/\s+/).filter(Boolean);

    if (!firstName && nameParts.length > 0) {
      firstName = nameParts[0];
    }

    if (!lastName && nameParts.length > 1) {
      lastName = nameParts.slice(1).join(" ");
    }
  }

  if (!firstName) {
    const emailLocalPart = toCleanString(profileData.emailAddress).split("@")[0] ?? "";
    const emailParts = emailLocalPart
      .split(/[._-]+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (emailParts.length > 0) {
      firstName = toTitleCase(emailParts[0]);
    }

    if (!lastName && emailParts.length > 1) {
      lastName = toTitleCase(emailParts.slice(1).join(" "));
    }
  }

  return {
    firstName: firstName || "User",
    lastName: lastName || "User",
  };
}

export async function getAccountSettingsSeed(
  section:
    | "public-profile"
    | "security-password"
    | "payment-methods" = "public-profile",
): Promise<AccountSettingsPageModel> {
  const response = await getUserProfile();
  const profileData = (response?.data ?? {}) as unknown as Record<string, unknown>;
  const { firstName, lastName } = resolveProfileNames(profileData);

  const raw = {
    section,
    firstName,
    lastName,
    email: toCleanString(profileData.emailAddress),
    phone: toCleanString(profileData.phoneNumber),
    titleRole: toCleanString(profileData.title) || toCleanString(profileData.role),
    institution: toCleanString(profileData.institutionOrHospital),
    npiNumber: toCleanString(profileData.npiNumber),
    avatarUrl: toCleanString(profileData.profilePicture),
    avatarInitials: `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase(),
  };

  const parsed = accountProfileSchema.safeParse(raw);

  const profile = parsed.success
    ? parsed.data
    : accountProfileSchema.parse({
        ...raw,
        firstName: raw.firstName || "User",
        lastName: raw.lastName || "User",
      });

  return {
    activeSection: section,
    profile,
    roleOptions: [],
  };
}
