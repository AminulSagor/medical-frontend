export type SettingsSectionKey = "public-profile" | "security-password";

export type AccountProfile = {
  section: "public-profile";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  role: string;
  institution: string;
  npiNumber: string;
  avatarUrl: string;
  avatarInitials: string;
};

export type AccountProfileDraft = AccountProfile;

export type RoleOption = {
  value: string;
  label: string;
};

export type AccountSettingsPageModel = {
  activeSection: SettingsSectionKey;
  profile: AccountProfile;
  roleOptions?: RoleOption[];
};
