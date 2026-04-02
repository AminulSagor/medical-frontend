// utils/settings/account-settings-data-util.ts
import { accountProfileSchema } from "@/schema/account-settings/account-settings-schema";
import { AccountSettingsPageModel } from "@/types/account-settings/account-settings-type";


export async function getAccountSettingsSeed(
  section: "public-profile" | "security-password" | "payment-methods" = "public-profile"
): Promise<AccountSettingsPageModel> {
  // ✅ later: replace with API response
  const raw = {
    section,
    firstName: "Sarah",
    lastName: "Thompson",
    email: "sarah.t@example.com",
    phone: "+1 (555) 000-0000",
    titleRole: "Anesthesiologist",
    institution: "Houston Methodist",
    npiNumber: "",
    avatarUrl: "",
    avatarInitials: "ST",
  };

  const profile = accountProfileSchema.parse(raw);

  return {
    activeSection: section,
    profile,
    roleOptions: [
      { value: "Anesthesiologist", label: "Anesthesiologist" },
      { value: "Emergency Physician", label: "Emergency Physician" },
      { value: "CRNA", label: "CRNA" },
      { value: "Resident", label: "Resident" },
    ],
  };
}