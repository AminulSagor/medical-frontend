import type { AccountProfile } from "@/types/user/account-settings/account-settings-type";
import type {
    UpdateUserProfilePayload,
    UserProfileApiData,
} from "@/types/user/profile.types";

export const PUBLIC_PROFILE_UPDATED_EVENT = "profile-updated";

export const USA_DOCTOR_TITLE_ROLE_OPTIONS = [
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

export function initialsFrom(
    firstName: string,
    lastName: string,
    email: string,
) {
    const a = (firstName?.trim()?.[0] ?? "").toUpperCase();
    const b = (lastName?.trim()?.[0] ?? "").toUpperCase();

    if (a || b) return `${a}${b}` || "U";

    return (email?.trim()?.[0] ?? "U").toUpperCase();
}

export function getCombinedTitleRole(data: UserProfileApiData) {
    return data.role?.trim() || data.title?.trim() || "";
}

export function mapProfileToForm(data: UserProfileApiData): AccountProfile {
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

export function buildUpdatePayload(
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

export function validateDraft(next: AccountProfile) {
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