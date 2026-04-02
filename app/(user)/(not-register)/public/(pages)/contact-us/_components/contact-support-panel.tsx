"use client";

import React from "react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { Mail, MapPin, Phone, ChevronDown } from "lucide-react";
import MessageSentDialog from "@/app/(user)/(not-register)/public/(pages)/contact-us/_components/message-sent-dialog";
import { useRouter } from "next/navigation";

export type ContactInquiryOption = {
  value: string;
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
  onSubmit?: (values: {
    fullName: string;
    email: string;
    inquiryType: string;
    message: string;
  }) => void;

  inquiryOptions?: ContactInquiryOption[];
  contactInfo?: ContactInfo;

  mapEmbedUrl?: string;
};

export default function ContactSupportPanel({
  onSubmit,
  inquiryOptions = [
    { value: "general", label: "General Inquiry" },
    { value: "enrollment", label: "Enrollment & Programs" },
    { value: "bookings", label: "Group Bookings" },
    { value: "support", label: "Technical Support" },
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
  mapEmbedUrl,
}: Props) {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [inquiryType, setInquiryType] = React.useState(
    inquiryOptions[0]?.value ?? "general",
  );
  const [message, setMessage] = React.useState("");
  const [sentOpen, setSentOpen] = React.useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.({ fullName, email, inquiryType, message });
    setSentOpen(true);
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-[1060px] px-4">
      <Card shape="soft" className="border border-light-slate/20 p-0 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left */}
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
                    className="h-11 w-full rounded-2xl border border-light-slate/25 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-primary"
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@hospital.com"
                    className="h-11 w-full rounded-2xl border border-light-slate/25 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-primary"
                  />
                </Field>
              </div>

              <Field label="Inquiry Type">
                <div className="relative">
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
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
                  className="w-full resize-none rounded-2xl border border-light-slate/25 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary"
                />
              </Field>

              <div className="pt-2">
                <Button
                  className="rounded-2xl px-8 py-3"
                  onClick={() => handleSubmit}
                >
                  Send Message
                  <span className="text-white/90">➔</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Right */}
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
              {mapEmbedUrl ? (
                <iframe
                  title="Map"
                  src={mapEmbedUrl}
                  className="h-full w-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                  Map Embed Here
                </div>
              )}
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
}

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
        {lines.map((t, i) => (
          <p key={i} className="mt-1 text-sm text-slate-500">
            {t}
          </p>
        ))}
      </div>
    </div>
  );
}
