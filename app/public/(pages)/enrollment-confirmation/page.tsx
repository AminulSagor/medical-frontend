import Button from "@/components/buttons/button";
import Card from "@/components/cards/card";
import {
  CheckCircle2,
  Mail,
  BookOpen,
  CalendarDays,
  FileText,
  Download,
} from "lucide-react";

export default function EnrollmentConfirmationPage() {
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
                You&apos;re all set, Dr. Thompson!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                Your enrollment in{" "}
                <span className="font-semibold text-slate-700">
                  Advanced Difficult Airway Workshop
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
                      Order #ORD-8829
                    </div>
                    <div className="text-slate-500">
                      Total Paid:{" "}
                      <span className="font-semibold text-slate-700">
                        $2,295.00
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
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 ring-2 ring-white">
                        DT
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary ring-2 ring-white">
                        RK
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/15 text-[11px] font-bold text-green-700 ring-2 ring-white">
                        +4
                      </div>
                    </div>

                    <div className="text-sm">
                      <div className="font-semibold text-slate-900">
                        6 Clinicians
                      </div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary hover:opacity-80"
                      >
                        View Names
                      </button>
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
                          Join us on Mar 12
                        </div>
                        <div className="text-xs text-slate-500">
                          Start time: 09:00 AM CST
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button className="px-6">
                <FileText size={18} />
                View Workshop Itinerary
              </Button>

              <Button variant="secondary" className="px-6">
                <Download size={18} />
                Download Receipt
              </Button>
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
