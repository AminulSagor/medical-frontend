import { accountProfileSchema } from "@/schema/account-settings/account-settings-schema";
import { getUserProfile } from "@/service/user/profile.server.service";
import { AccountSettingsPageModel } from "@/types/user/account-settings/account-settings-type";

export async function getAccountSettingsSeed(
  section:
    | "public-profile"
    | "security-password"
    | "payment-methods" = "public-profile",
): Promise<AccountSettingsPageModel> {
  const response = await getUserProfile();
  const profileData = response.data;

  const raw = {
    section,
    firstName: profileData.firstName ?? "",
    lastName: profileData.lastName ?? "",
    email: profileData.emailAddress ?? "",
    phone: profileData.phoneNumber ?? "",
    titleRole: profileData.title ?? profileData.role ?? "",
    institution: profileData.institutionOrHospital ?? "",
    npiNumber: profileData.npiNumber ?? "",
    avatarUrl: profileData.profilePicture ?? "",
    avatarInitials: `${profileData.firstName?.[0] ?? ""}${profileData.lastName?.[0] ?? ""}`.toUpperCase(),
  };

  const profile = accountProfileSchema.parse(raw);

  return {
    activeSection: section,
    profile,
    roleOptions: [],
  };
}