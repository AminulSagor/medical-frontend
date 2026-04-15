"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import {
  Plus,
  Trash2,
  ArrowRight,
  BadgePercent,
  Lock,
  Headset,
  Loader2,
} from "lucide-react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { useRouter, useSearchParams } from "next/navigation";
import { createWorkshopCheckoutSession } from "@/service/user/workshop-payment.service";
import { getPublicWorkshopById } from "@/service/public/workshop.service";
import { createWorkshopOrderSummary } from "@/service/user/create-workshop-order-summary.service";
import { getUserProfile } from "@/service/user/profile.service";

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

function inputPillClass(disabled = false) {
  return [
    "w-full rounded-full border border-slate-200 bg-slate-50/60",
    "px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400",
    "outline-none focus:border-primary focus:bg-white",
    disabled ? "cursor-not-allowed bg-slate-100 text-slate-500" : "",
  ].join(" ");
}

function labelClass() {
  return "text-[11px] font-semibold tracking-wide text-slate-600 uppercase";
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workshopId = searchParams.get("workshopId");

  const [useProfile, setUseProfile] = useState(false);
  const [isFillingProfile, setIsFillingProfile] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: uid(), fullName: "", role: "", npi: "", email: "" },
    { id: uid(), fullName: "", role: "", npi: "", email: "" },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const standardSeatPrice = useMemo(() => {
    const raw = workshop?.standardPrice ?? workshop?.price;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [workshop]);

  const qty = attendees.length;

  const sortedDiscounts = useMemo(() => {
    const discounts = Array.isArray(workshop?.groupDiscounts)
      ? [...workshop.groupDiscounts]
      : [];
    return discounts.sort(
      (a, b) => Number(a.minimumAttendees) - Number(b.minimumAttendees),
    );
  }, [workshop]);

  const unlockedDiscount = useMemo(() => {
    return sortedDiscounts.filter((item) => qty >= Number(item.minimumAttendees)).at(-1) ?? null;
  }, [qty, sortedDiscounts]);

  const nextDiscount = useMemo(() => {
    return sortedDiscounts.find((item) => qty < Number(item.minimumAttendees)) ?? null;
  }, [qty, sortedDiscounts]);

  const discountedSeatPrice = unlockedDiscount
    ? Number(unlockedDiscount.pricePerPerson)
    : standardSeatPrice;

  const totalBeforeDiscount = useMemo(
    () => standardSeatPrice * qty,
    [standardSeatPrice, qty],
  );

  const totalSavings = useMemo(() => {
    if (!unlockedDiscount) return 0;
    return Number(unlockedDiscount.savingsPerPerson) * qty;
  }, [qty, unlockedDiscount]);

  const total = useMemo(() => {
    if (unlockedDiscount) {
      return discountedSeatPrice * qty;
    }
    return totalBeforeDiscount;
  }, [discountedSeatPrice, qty, totalBeforeDiscount, unlockedDiscount]);

  useEffect(() => {
    if (workshopId) {
      void fetchWorkshop();
    } else {
      setError("No workshop ID provided");
      setLoading(false);
    }
  }, [workshopId]);

  const fetchWorkshop = async () => {
    if (!workshopId) {
      setError("No workshop ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getPublicWorkshopById(workshopId);
      setWorkshop(response.data);
    } catch (err) {
      console.error("Failed to fetch workshop:", err);
      setError("Failed to load workshop details");
    } finally {
      setLoading(false);
    }
  };

  const update = (id: string, key: keyof Attendee, value: string) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [key]: value } : a)),
    );
  };

  const fillPrimaryFromProfile = async () => {
    try {
      setIsFillingProfile(true);
      setError(null);
      const response = await getUserProfile();
      const data = response.data;
      const fullName = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
      const role = data.role?.trim() || data.title?.trim() || "";

      setAttendees((prev) =>
        prev.map((attendee, index) =>
          index === 0
            ? {
                ...attendee,
                fullName,
                role,
                npi: data.npiNumber?.trim() || "",
                email: data.emailAddress?.trim() || "",
              }
            : attendee,
        ),
      );
    } catch (err) {
      console.error("Failed to load profile", err);
      setUseProfile(false);
      setError("Failed to load your profile information.");
    } finally {
      setIsFillingProfile(false);
    }
  };

  const clearPrimaryAttendee = () => {
    setAttendees((prev) =>
      prev.map((attendee, index) =>
        index === 0
          ? {
              ...attendee,
              fullName: "",
              role: "",
              npi: "",
              email: "",
            }
          : attendee,
      ),
    );
  };

  const handleUseProfileChange = async (checked: boolean) => {
    setUseProfile(checked);
    if (checked) {
      await fillPrimaryFromProfile();
      return;
    }
    clearPrimaryAttendee();
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

  const handlePayment = async () => {
    if (!workshopId) {
      setError("No workshop selected.");
      return;
    }

    const invalidAttendee = attendees.find(
      (a) => !a.fullName.trim() || !a.email.trim() || !a.role.trim(),
    );
    if (invalidAttendee) {
      setError(
        "Please fill in all required fields for each attendee (Full Name, Professional Role, Email).",
      );
      return;
    }

    const invalidEmail = attendees.find((a) => !isValidEmail(a.email.trim()));
    if (invalidEmail) {
      setError("Please enter a valid email address for each attendee.");
      return;
    }

    const normalizedEmails = attendees.map((a) => a.email.trim().toLowerCase());
    if (new Set(normalizedEmails).size !== normalizedEmails.length) {
      setError("All attendee email addresses must be different.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderSummaryData = await createWorkshopOrderSummary({
        workshopId,
        attendees: attendees.map((a) => ({
          fullName: a.fullName.trim(),
          professionalRole: a.role.trim(),
          npiNumber: a.npi.trim() || undefined,
          email: a.email.trim(),
        })),
      });

      const checkoutContext = {
        workshopId,
        orderSummaryId: orderSummaryData.orderSummaryId,
        attendeeIds: orderSummaryData.attendees.map((a) => a.id),
        workshopTitle: orderSummaryData.workshop?.title || workshop?.title || "Workshop",
        numberOfAttendees: orderSummaryData.numberOfAttendees,
        totalPrice: orderSummaryData.pricing?.totalPrice || String(total),
      };
      sessionStorage.setItem(
        "workshop_checkout_context",
        JSON.stringify(checkoutContext),
      );

      const checkoutUrl = await createWorkshopCheckoutSession({
        orderSummaryId: orderSummaryData.orderSummaryId,
        successUrl: `${window.location.origin}/public/workshop-checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/public/workshop-checkout?workshopId=${workshopId}`,
      });

      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Payment error:", err);
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || err.message || "Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error && !workshop) {
    return (
      <div className="pt-20">
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold text-red-500">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const workshopTitle = workshop?.title || "Workshop";
  const workshopStartDate = workshop?.startDate || null;
  const workshopEndDate = workshop?.endDate || null;

  const formatDateRange = () => {
    if (!workshopStartDate) return "";
    try {
      const start = new Date(workshopStartDate);
      const end = workshopEndDate ? new Date(workshopEndDate) : null;
      const startStr = start.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      if (end && end.getTime() !== start.getTime()) {
        const endStr = end.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        return `${startStr} - ${endStr}`;
      }
      return start.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="pt-20">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">Attendee Details</h1>
                <p className="text-sm leading-relaxed text-slate-500">
                  Please enter the information for each clinician. Certificates will be
                  issued in these names.
                </p>
              </div>

              <div className="mt-6 space-y-8">
                {attendees.map((a, index) => {
                  const isPrimary = index === 0;
                  const isLockedByProfile = isPrimary && useProfile;

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
                            <input
                              type="checkbox"
                              checked={useProfile}
                              onChange={(e) => void handleUseProfileChange(e.target.checked)}
                              disabled={isFillingProfile}
                              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            {isFillingProfile ? "Loading profile..." : "Use my profile information"}
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
                            onChange={(e) => update(a.id, "fullName", e.target.value)}
                            placeholder={isPrimary ? "e.g. Dr. Sarah Connor" : "Full Name"}
                            className={inputPillClass(isLockedByProfile)}
                            disabled={isLockedByProfile}
                          />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="grid gap-2">
                            <span className={labelClass()}>Professional Role</span>
                            <input
                              value={a.role}
                              onChange={(e) => update(a.id, "role", e.target.value)}
                              placeholder="e.g. Anesthesiologist"
                              className={inputPillClass(isLockedByProfile)}
                              disabled={isLockedByProfile}
                            />
                          </div>

                          {isPrimary ? (
                            <div className="grid gap-2">
                              <span className={labelClass()}>NPI Number</span>
                              <input
                                value={a.npi}
                                onChange={(e) => update(a.id, "npi", e.target.value)}
                                placeholder="10-digit NPI"
                                className={inputPillClass(isLockedByProfile)}
                                disabled={isLockedByProfile}
                              />
                            </div>
                          ) : (
                            <div className="grid gap-2">
                              <span className={labelClass()}>Email Address</span>
                              <input
                                value={a.email}
                                onChange={(e) => update(a.id, "email", e.target.value)}
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
                              onChange={(e) => update(a.id, "email", e.target.value)}
                              placeholder="sarah.connor@hospital.org"
                              className={inputPillClass(isLockedByProfile)}
                              disabled={isLockedByProfile}
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

                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex justify-center pt-2">
                  <Button className="px-8" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl p-7">
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

                <div className="space-y-2">
                  <div className="text-[11px] font-semibold tracking-widest text-slate-400">
                    WORKSHOP
                  </div>
                  <div className="text-sm font-bold text-slate-900">{workshopTitle}</div>
                  {formatDateRange() && (
                    <div className="text-xs text-slate-500">{formatDateRange()}</div>
                  )}
                </div>

                <div className="h-px w-full bg-slate-100" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Price per seat</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(unlockedDiscount ? discountedSeatPrice : standardSeatPrice)}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Quantity</span>
                    <span className="font-bold text-slate-900">x {qty}</span>
                  </div>
                </div>

                {!unlockedDiscount && nextDiscount && (
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
                          Add {Number(nextDiscount.minimumAttendees) - qty} more attendee
                          {Number(nextDiscount.minimumAttendees) - qty === 1 ? "" : "s"} to unlock
                          savings of {formatCurrency(Number(nextDiscount.savingsPerPerson))} per person.
                          Your total savings would be {formatCurrency(Number(nextDiscount.savingsPerPerson) * Number(nextDiscount.minimumAttendees))}.
                        </p>

                        <button
                          type="button"
                          onClick={addAttendee}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:opacity-80"
                        >
                          <Plus size={16} />
                          Add Seats
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {unlockedDiscount && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Total Before Discount</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(totalBeforeDiscount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-green-600">Group Savings</span>
                      <span className="font-bold text-green-600">-{formatCurrency(totalSavings).replace("$", "")}</span>
                    </div>

                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                      <div className="space-y-2 text-green-800">
                        <div className="text-[11px] font-extrabold tracking-widest">DISCOUNT UNLOCKED</div>
                        <p className="text-sm leading-relaxed">
                          {formatCurrency(Number(unlockedDiscount.savingsPerPerson))} savings per attendee applied.
                          You&apos;ve saved {formatCurrency(totalSavings)} on this booking.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="h-px w-full bg-slate-100" />

                <div className="flex items-end justify-between">
                  <div className="text-xs font-extrabold tracking-widest text-slate-400">TOTAL</div>
                  <div className="text-4xl font-extrabold text-slate-900">
                    {formatCurrency(total)}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400">
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
                    Call Registration Support: <span className="text-primary">888-555-0123</span>
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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-20">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
