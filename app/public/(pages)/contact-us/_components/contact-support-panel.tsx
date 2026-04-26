"use client";

import React from "react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { Mail, MapPin, Phone, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import MessageSentDialog from "@/app/public/(pages)/contact-us/_components/message-sent-dialog";
import ContactStaticMap from "@/app/public/(pages)/contact-us/_components/contact-static-map";
import type {
  ContactUsInquiryType,
  SendContactUsPayload,
  SendContactUsResponse,
} from "@/types/public/contact-us/contact-us.type";

export type ContactInquiryOption = {
  value: ContactUsInquiryType;
  label: string;
};

export type ContactInfo = {
  campusTitle: string;
  campusAddressLine1: string;
  campusAddressLine2?: string;
  phoneTitle: string;
  phoneNumber: string;
  phoneMeta?: string;
  emailTitle: string;
  emailAddress: string;
};

type Props = {
  onSubmit?: (
    values: SendContactUsPayload,
  ) => Promise<SendContactUsResponse> | SendContactUsResponse;
  inquiryOptions?: ContactInquiryOption[];
  contactInfo?: ContactInfo;
  mapImageUrl?: string;
  mapOpenHref?: string;
  initialInquiryType?: ContactUsInquiryType;
  initialMessage?: string;
};

const ContactSupportPanel = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      onSubmit,
      inquiryOptions = [
        { value: "general_inquiry", label: "General Inquiry" },
        { value: "order_inquiry", label: "Order Inquiry" },
        { value: "enrollment", label: "Enrollment & Programs" },
        { value: "facility_booking", label: "Group Bookings" },
        { value: "technical_support", label: "Technical Support" },
      ],
      contactInfo = {
        campusTitle: "Main Campus",
        campusAddressLine1: "7929 Brookriver Rd,",
        campusAddressLine2: "Dallas, TX",
        phoneTitle: "Phone Support",
        phoneNumber: "+1 (555) 012-3456",
        phoneMeta: "Mon-Fri, 8am - 6pm EST",
        emailTitle: "Email",
        emailAddress: "support@simcenter.edu",
      },
      mapImageUrl,
      mapOpenHref,
      initialInquiryType,
      initialMessage,
    },
    ref,
  ) => {
    const defaultInquiryType =
      initialInquiryType ?? inquiryOptions[0]?.value ?? "general_inquiry";
    const defaultMessage = initialMessage ?? "";

    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [inquiryType, setInquiryType] =
      React.useState<ContactUsInquiryType>(defaultInquiryType);
    const [message, setMessage] = React.useState(defaultMessage);
    const [sentOpen, setSentOpen] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
      setInquiryType(defaultInquiryType);
    }, [defaultInquiryType]);

    React.useEffect(() => {
      setMessage(defaultMessage);
    }, [defaultMessage]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      if (isSubmitting) return;

      const payload: SendContactUsPayload = {
        fullName: fullName.trim(),
        email: email.trim(),
        inquiryType,
        message: message.trim(),
      };

      if (!payload.fullName || !payload.email || !payload.message) {
        setSubmitError("Please complete all required fields before sending.");
        return;
      }

      try {
        setIsSubmitting(true);
        setSubmitError(null);
        await onSubmit?.(payload);
        setSentOpen(true);
        setFullName("");
        setEmail("");
        setInquiryType(defaultInquiryType);
        setMessage(defaultMessage);
      } catch (error) {
        setSubmitError(getSubmitErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    }

    return (
      <div ref={ref} className="mx-auto mt-8 w-full max-w-[1060px] px-4">
        <Card shape="soft" className="border border-light-slate/20 p-0 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-5">
              <h2 className="text-2xl font-semibold text-slate-900">
                Send us a message
              </h2>

              <form onSubmit={handleSubmit} className="mt-7 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field label="Full Name">
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Jane Doe"
                      required
                      className="h-11 w-full rounded-2xl border border-light-slate/25 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-primary"
                    />
                  </Field>

                  <Field label="Email Address">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@hospital.com"
                      type="email"
                      required
                      className="h-11 w-full rounded-2xl border border-light-slate/25 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-primary"
                    />
                  </Field>
                </div>

                <Field label="Inquiry Type">
                  <div className="relative">
                    <select
                      value={inquiryType}
                      onChange={(e) =>
                        setInquiryType(e.target.value as ContactUsInquiryType)
                      }
                      className="h-11 w-full appearance-none rounded-2xl border border-light-slate/25 bg-slate-50 px-4 pr-10 text-sm text-slate-900 outline-none focus:border-primary"
                    >
                      {inquiryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </Field>

                <Field label="How can we assist?">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your needs or questions..."
                    rows={4}
                    required
                    className="w-full resize-none rounded-2xl border border-light-slate/25 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary"
                  />
                </Field>

                {submitError ? (
                  <p className="text-sm font-medium text-red-500">
                    {submitError}
                  </p>
                ) : null}

                <div className="pt-2">
                  <Button type="submit" className="rounded-2xl px-8 py-3">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <span className="text-white/90">➔</span>
                  </Button>
                </div>
              </form>
            </div>

            <div className="border-t border-light-slate/20 md:border-l md:border-t-0">
              <div className="p-5">
                <p className="text-xs font-semibold tracking-widest text-primary">
                  CONTACT INFORMATION
                </p>

                <div className="mt-6 space-y-6">
                  <InfoRow
                    icon={<MapPin className="h-4 w-4 text-primary" />}
                    title={contactInfo.campusTitle}
                    lines={[
                      contactInfo.campusAddressLine1,
                      contactInfo.campusAddressLine2 ?? "",
                    ].filter(Boolean)}
                  />

                  <InfoRow
                    icon={<Phone className="h-4 w-4 text-primary" />}
                    title={contactInfo.phoneTitle}
                    lines={[
                      contactInfo.phoneNumber,
                      contactInfo.phoneMeta ?? "",
                    ].filter(Boolean)}
                  />

                  <InfoRow
                    icon={<Mail className="h-4 w-4 text-primary" />}
                    title={contactInfo.emailTitle}
                    lines={[contactInfo.emailAddress]}
                  />
                </div>
              </div>

              <div className="h-[260px] w-full overflow-hidden rounded-b-3xl border-t border-light-slate/20 md:h-[300px] md:rounded-b-none md:rounded-br-3xl">
                <ContactStaticMap
                  imageUrl={mapImageUrl}
                  openHref={mapOpenHref}
                  title="Texas, USA"
                  subtitle="31.9686, -99.9018"
                />
              </div>
            </div>
          </div>
        </Card>

        <MessageSentDialog
          open={sentOpen}
          onClose={() => setSentOpen(false)}
          onBackHome={() => router.push("/public/home")}
        />
      </div>
    );
  },
);

ContactSupportPanel.displayName = "ContactSupportPanel";

export default ContactSupportPanel;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoRow({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-light-slate/20 bg-white">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <div className="mt-1 space-y-1">
          {lines.map((line) => (
            <p key={line} className="text-sm text-slate-500">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSubmitErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const responseData = error.response.data;

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData
    ) {
      const message = responseData.message;

      if (Array.isArray(message)) {
        const normalizedMessages = message.map((item) =>
          typeof item === "string" ? item.toLowerCase() : "",
        );

        if (
          normalizedMessages.some(
            (item) =>
              item.includes("inquirytype must be one of the following values") ||
              item.includes("inquiry type must be one of the following values"),
          )
        ) {
          return "Please select a valid inquiry type and try again.";
        }

        return "We couldn't send your message right now. Please review your details and try again.";
      }

      if (typeof message === "string") {
        const normalizedMessage = message.toLowerCase();

        if (
          normalizedMessage.includes(
            "inquirytype must be one of the following values",
          ) ||
          normalizedMessage.includes(
            "inquiry type must be one of the following values",
          )
        ) {
          return "Please select a valid inquiry type and try again.";
        }

        if (normalizedMessage.includes("failed to send message")) {
          return "We couldn't send your message right now. Please try again in a moment.";
        }

        return message;
      }
    }
  }

  return "We couldn't send your message right now. Please try again.";
}