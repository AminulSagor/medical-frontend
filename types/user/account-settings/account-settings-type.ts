// types/settings/account-settings-type.ts
import type {
  AccountProfileOutput,
  AccountProfileInput,
} from "@/schema/account-settings/account-settings-schema";

export type SettingsSectionKey =
  | "public-profile"
  | "security-password"
  | "payment-methods";

export type AccountProfile = AccountProfileOutput;
export type AccountProfileDraft = AccountProfileInput;

export type RoleOption = {
  value: string;
  label: string;
};

export type AccountSettingsPageModel = {
  activeSection: SettingsSectionKey;
  profile: AccountProfile;
  roleOptions: RoleOption[];
};