"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  Trash2,
  ArrowRight,
  BadgePercent,
  Lock,
  Headset,
} from "lucide-react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import Link from "next/link";

type Attendee = {
  id: string;
  fullName: string;
  role: string;
  npi: string;
  email: string;
};

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

function inputPillClass() {
  return [
    "w-full rounded-full border border-slate-200 bg-slate-50/60",
    "px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400",
    "outline-none focus:border-primary focus:bg-white",
  ].join(" ");
}

function labelClass() {
  return "text-[11px] font-semibold tracking-wide text-slate-600 uppercase";
}

export default function CheckoutPage() {
  const [useProfile, setUseProfile] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: uid(), fullName: "", role: "", npi: "", email: "" },
    { id: uid(), fullName: "", role: "", npi: "", email: "" },
  ]);

  const seatPrice = 450;
  const qty = attendees.length;
  const total = useMemo(() => seatPrice * qty, [seatPrice, qty]);

  const update = (id: string, key: keyof Attendee, value: string) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [key]: value } : a)),
    );
  };

  const addAttendee = () => {
    setAttendees((prev) => [
      ...prev,
      { id: uid(), fullName: "", role: "", npi: "", email: "" },
    ]);
  };

  const removeAttendee = (id: string) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  Attendee Details
                </h1>
                <p className="text-sm leading-relaxed text-slate-500">
                  Please enter the information for each clinician. Certificates
                  will be issued in these names.
                </p>
              </div>

              <div className="mt-6 space-y-8">
                {attendees.map((a, index) => {
                  const isPrimary = index === 0;

                  return (
                    <div key={a.id} className="pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                            {index + 1}
                          </div>

                          <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-slate-900">
                              Attendee {index + 1}
                              {isPrimary ? " (Primary)" : ""}
                            </h2>
                          </div>
                        </div>

                        {isPrimary ? (
                          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
                            <span className="relative flex h-4 w-4 items-center justify-center">
                              <input
                                type="checkbox"
                                checked={useProfile}
                                onChange={(e) =>
                                  setUseProfile(e.target.checked)
                                }
                                className="h-4 w-4 appearance-none rounded-full border border-slate-300 bg-white checked:border-primary checked:bg-primary"
                              />
                              <span className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                            </span>
                            Use my profile information
                          </label>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeAttendee(a.id)}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 hover:opacity-80"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="mt-4 grid gap-5">
                        <div className="grid gap-2">
                          <span className={labelClass()}>Full Legal Name</span>
                          <input
                            value={a.fullName}
                            onChange={(e) =>
                              update(a.id, "fullName", e.target.value)
                            }
                            placeholder={
                              isPrimary ? "e.g. Dr. Sarah Connor" : "Full Name"
                            }
                            className={inputPillClass()}
                          />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="grid gap-2">
                            <span className={labelClass()}>
                              Professional Role
                            </span>
                            <input
                              value={a.role}
                              onChange={(e) =>
                                update(a.id, "role", e.target.value)
                              }
                              placeholder="e.g. Anesthesiologist"
                              className={inputPillClass()}
                            />
                          </div>

                          {isPrimary ? (
                            <div className="grid gap-2">
                              <span className={labelClass()}>NPI Number</span>
                              <input
                                value={a.npi}
                                onChange={(e) =>
                                  update(a.id, "npi", e.target.value)
                                }
                                placeholder="10-digit NPI"
                                className={inputPillClass()}
                              />
                            </div>
                          ) : (
                            <div className="grid gap-2">
                              <span className={labelClass()}>
                                Email Address
                              </span>
                              <input
                                value={a.email}
                                onChange={(e) =>
                                  update(a.id, "email", e.target.value)
                                }
                                placeholder="email@example.com"
                                className={inputPillClass()}
                              />
                            </div>
                          )}
                        </div>

                        {isPrimary && (
                          <div className="grid gap-2">
                            <span className={labelClass()}>Email Address</span>
                            <input
                              value={a.email}
                              onChange={(e) =>
                                update(a.id, "email", e.target.value)
                              }
                              placeholder="sarah.connor@hospital.org"
                              className={inputPillClass()}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-6 h-px w-full bg-slate-100" />
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addAttendee}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/35 bg-primary/5 py-5 text-sm font-semibold text-primary hover:bg-primary/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Plus size={18} className="text-primary" />
                  </span>
                  + Add Another Attendee
                </button>

                <div className="flex justify-center pt-2">
                  <Link href={"/public/enrollment-confirmation"}>
                    <Button className="px-8">
                      Proceed to Payment
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl p-7">
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Order Summary
                </h2>

                <div className="space-y-2">
                  <div className="text-[11px] font-semibold tracking-widest text-slate-400">
                    WORKSHOP
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Advanced Difficult Airway Workshop
                  </div>
                  <div className="text-xs text-slate-500">
                    March 12 - 14, 2024
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Price per seat</span>
                  <span className="font-bold text-slate-900">
                    ${seatPrice.toFixed(2)}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Quantity</span>
                    <span className="font-bold text-slate-900">x {qty}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <BadgePercent size={16} className="text-primary" />
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-extrabold tracking-widest text-blue-500">
                        POTENTIAL SAVINGS
                      </div>

                      <p className="text-sm leading-relaxed text-slate-700">
                        Add{" "}
                        <span className="font-bold text-blue-500">
                          4 more attendees
                        </span>{" "}
                        to unlock our{" "}
                        <span className="font-bold text-blue-500">
                          15% Institutional Discount
                        </span>
                        . Your total savings would be $405.00.
                      </p>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:opacity-80"
                      >
                        <Plus size={16} />
                        Add Seats
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100" />

                <div className="flex items-end justify-between">
                  <div className="text-xs font-extrabold tracking-widest text-slate-400">
                    TOTAL
                  </div>
                  <div className="text-4xl font-extrabold text-slate-900">
                    ${total.toFixed(2)}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Lock size={14} />
                  Secure SSL Encryption
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <Headset size={18} className="text-slate-500" />
                </div>

                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold tracking-widest text-slate-400">
                    NEED HELP?
                  </div>
                  <div className="text-sm font-semibold text-slate-700">
                    Call Registration Support:{" "}
                    <span className="text-primary">888-555-0123</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
