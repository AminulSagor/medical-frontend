"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/buttons/button";
import Card from "@/components/cards/card";
import Link from "next/link";
import {
  CheckCircle2,
  Mail,
  BookOpen,
  CalendarDays,
  FileText,
  Download,
  Loader2,
} from "lucide-react";

type EnrollmentData = {
  workshopTitle: string;
  numberOfAttendees: number;
  totalPrice: string;
  reservationId: string | null;
};

function EnrollmentConfirmationContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<EnrollmentData | null>(null);

  useEffect(() => {
    // Try to read from URL params first, then fall back to sessionStorage
    const title = searchParams.get("title");
    const attendees = searchParams.get("attendees");
    const total = searchParams.get("total");
    const resId = searchParams.get("reservationId");

    if (title) {
      setData({
        workshopTitle: title,
        numberOfAttendees: Number(attendees) || 1,
        totalPrice: total || "0.00",
        reservationId: resId,
      });
    } else {
      // Fallback: try reading context from sessionStorage
      try {
        const raw = sessionStorage.getItem("workshop_checkout_context");
        if (raw) {
          const ctx = JSON.parse(raw);
          setData({
            workshopTitle: ctx.workshopTitle || "Workshop",
            numberOfAttendees: ctx.numberOfAttendees || 1,
            totalPrice: ctx.totalPrice || "0.00",
            reservationId: null,
          });
        }
      } catch {
        // Use defaults
      }
    }
  }, [searchParams]);

  const workshopTitle = data?.workshopTitle || "Workshop";
  const numberOfAttendees = data?.numberOfAttendees || 1;
  const totalPrice = data?.totalPrice || "0.00";

  return (
    <div className="mt-28">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl  border-t-4 border-primary">
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                    <CheckCircle2 size={26} className="text-green-600" />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900">
                You&apos;re All Set!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                Your enrollment in{" "}
                <span className="font-semibold text-slate-700">
                  {workshopTitle}
                </span>{" "}
                is confirmed.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold tracking-widest text-slate-400">
                    ORDER DETAILS
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-slate-900">
                      {workshopTitle}
                    </div>
                    <div className="text-slate-500">
                      Total Paid:{" "}
                      <span className="font-semibold text-slate-700">
                        ${Number(totalPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:text-right">
                  <div className="text-[11px] font-extrabold tracking-widest text-slate-400">
                    GROUP SUMMARY
                  </div>

                  <div className="flex items-center gap-3 md:justify-end">
                    <div className="flex -space-x-2">
                      {Array.from({ length: Math.min(numberOfAttendees, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 ring-2 ring-white"
                        >
                          {String(i + 1)}
                        </div>
                      ))}
                      {numberOfAttendees > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/15 text-[11px] font-bold text-green-700 ring-2 ring-white">
                          +{numberOfAttendees - 3}
                        </div>
                      )}
                    </div>

                    <div className="text-sm">
                      <div className="font-semibold text-slate-900">
                        {numberOfAttendees} Clinician{numberOfAttendees !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-6 h-px w-full bg-slate-200/70" />

              <div className="space-y-3">
                <div className="text-[11px] font-extrabold tracking-widest text-slate-400">
                  NEXT STEPS
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Mail size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Check your email
                        </div>
                        <div className="text-xs text-slate-500">
                          Confirmation sent to inbox
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <BookOpen size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Complete pre-reading
                        </div>
                        <div className="text-xs text-slate-500">
                          Available in dashboard
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <CalendarDays size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          Check your schedule
                        </div>
                        <div className="text-xs text-slate-500">
                          View dates in dashboard
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/dashboard/user/my-courses">
                <Button className="px-6">
                  <FileText size={18} />
                  Go to My Courses
                </Button>
              </Link>

              <Link href="/public/courses">
                <Button variant="secondary" className="px-6">
                  Browse More Workshops
                </Button>
              </Link>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              A calendar invite has been sent to all registered attendees.
            </p>
          </Card>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
          <button className="hover:opacity-80" type="button">
            Contact Support
          </button>
          <span>•</span>
          <button className="hover:opacity-80" type="button">
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnrollmentConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mt-28 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <EnrollmentConfirmationContent />
    </Suspense>
  );
}
