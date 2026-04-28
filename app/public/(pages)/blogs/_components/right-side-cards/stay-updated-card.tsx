"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import {
  completeNewsletterProfile,
  subscribeToNewsletter,
} from "@/service/public/newsletter.service";

interface ApiErrorResponse {
  message?: string;
}

export default function StayUpdatedCard() {
  const [email, setEmail] = useState("");
  const [subscriberId, setSubscriberId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    clinicalRole: "",
    phone: "",
    institution: "",
  });

  async function handleSubscribe() {
    const trimmedEmail = email.trim();

    setErrorMessage("");

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
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

      setProfileForm({
        fullName: "",
        clinicalRole: "",
        phone: "",
        institution: "",
      });
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

  return (
    <>
      <div className="rounded-[24px] bg-white p-6 border border-slate-200">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#E6EEF5]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16v12H4z"
              stroke="#3BAFD0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 6l-10 7L2 6"
              stroke="#3BAFD0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="mt-5 font-serif text-[22px] leading-[28px] font-semibold text-[#1E293B]">
          Stay Updated
        </h3>

        <p className="mt-3 text-[14px] leading-6 text-[#64748B]">
          Get the latest simulation scenarios and research delivered to your
          inbox.
        </p>

        <div className="mt-5">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="Your email address"
            className="w-full rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-5 py-3 text-[14px] text-[#475569] placeholder:text-[#94A3B8] outline-none focus:border-primary"
          />
        </div>

        <button
          type="button"
          onClick={handleSubscribe}
          disabled={isSubmitting}
          className="mt-4 w-full rounded-full bg-[#0F172A] px-5 py-3 text-[15px] font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
        ) : null}
      </div>

      {isProfileModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-black">
                  You're in! What should we call you?
                </h2>
                <p className="mt-1 text-sm text-light-slate">
                  Complete your profile now, or skip this step.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-light-slate/20 text-light-slate transition hover:bg-light-slate/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="mt-5 space-y-3">
              {["fullName", "clinicalRole", "phone", "institution"].map(
                (field) => (
                  <input
                    key={field}
                    value={profileForm[field as keyof typeof profileForm]}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    placeholder={
                      field === "fullName"
                        ? "Name"
                        : `${field.replace(/([A-Z])/g, " $1")} (optional)`
                    }
                    className="h-11 w-full rounded-xl border border-light-slate/20 px-4 text-sm text-black outline-none transition placeholder:text-light-slate focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                ),
              )}

              {profileErrorMessage ? (
                <p className="text-sm text-red-600">{profileErrorMessage}</p>
              ) : null}

              <button
                type="submit"
                disabled={isProfileSubmitting}
                className="h-11 w-full rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isProfileSubmitting ? "Saving..." : "Save Profile"}
              </button>

              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="h-10 w-full rounded-full text-sm font-semibold text-light-slate transition hover:bg-light-slate/5"
              >
                Skip for now
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}