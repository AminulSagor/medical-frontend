"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import {
    completeNewsletterProfile,
    subscribeToNewsletter,
} from "@/service/public/newsletter.service";

interface ApiErrorResponse {
    message?: string;
}

export type NewsletterProfileForm = {
    fullName: string;
    clinicalRole: string;
    phone: string;
    institution: string;
};

const initialProfileForm: NewsletterProfileForm = {
    fullName: "",
    clinicalRole: "",
    phone: "",
    institution: "",
};

export function useNewsletterSubscription() {
    const [email, setEmail] = useState("");
    const [subscriberId, setSubscriberId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [profileErrorMessage, setProfileErrorMessage] = useState("");
    const [profileForm, setProfileForm] =
        useState<NewsletterProfileForm>(initialProfileForm);

    function clearError() {
        setErrorMessage("");
    }

    function closeProfileModal() {
        setIsProfileModalOpen(false);
    }

    function updateProfileField(
        field: keyof NewsletterProfileForm,
        value: string,
    ) {
        setProfileForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (profileErrorMessage) {
            setProfileErrorMessage("");
        }
    }

    async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const trimmedEmail = email.trim();

        setErrorMessage("");

        if (!trimmedEmail) {
            setErrorMessage("Please enter your email address.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await subscribeToNewsletter({
                email: trimmedEmail,
                source: "FOOTER",
            });

            setSubscriberId(response.data.subscriberId);
            setEmail("");
            setIsProfileModalOpen(true);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;

            setErrorMessage(
                axiosError.response?.data?.message ||
                "Failed to subscribe. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const trimmedFullName = profileForm.fullName.trim();

        setProfileErrorMessage("");

        if (!trimmedFullName) {
            setProfileErrorMessage("Please enter your name.");
            return;
        }

        try {
            setIsProfileSubmitting(true);

            await completeNewsletterProfile(subscriberId, {
                fullName: trimmedFullName,
                clinicalRole: profileForm.clinicalRole.trim() || undefined,
                phone: profileForm.phone.trim() || undefined,
                institution: profileForm.institution.trim() || undefined,
            });

            toast.success("Subscribed successfully");

            setProfileForm(initialProfileForm);
            setSubscriberId("");
            setIsProfileModalOpen(false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;

            setProfileErrorMessage(
                axiosError.response?.data?.message ||
                "Failed to complete profile. Please try again.",
            );
        } finally {
            setIsProfileSubmitting(false);
        }
    }

    return {
        email,
        errorMessage,
        isSubmitting,
        profileForm,
        profileErrorMessage,
        isProfileSubmitting,
        isProfileModalOpen,
        setEmail,
        clearError,
        closeProfileModal,
        updateProfileField,
        handleSubscribe,
        handleProfileSubmit,
    };
}