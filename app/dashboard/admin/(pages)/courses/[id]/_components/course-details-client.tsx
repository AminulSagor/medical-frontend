"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
    getWorkshopById,
    getWorkshopEnrollees,
} from "@/service/admin/workshop.service";

import CourseDetailsHeader from "./course-details-header";
import CourseDetailsStats from "./course-details-stats";
import CourseDetailsInPerson from "./course-details-in-person";
import CourseDetailsOnline from "./course-details-online";
import EnrolleeListModal from "./enrollee-list-modal";
import RefundPreviewModal from "./refund-preview-modal";
import RefundSuccessModal from "./refund-success-modal";
import { mapWorkshopToCourseDetailsModel } from "../_utils/course-details.mapper";
import type {
    CourseDetailsDeliveryMode,
    CourseDetailsModel,
} from "../_utils/course-details.types";

type RefundSuccessData = {
    traineeName: string;
    refundedAmount: string;
    paymentGateway: string;
    transactionId: string;
};

export default function CourseDetailsClient({
    workshopId,
    model: fallbackModel,
}: {
    workshopId: string;
    model?: CourseDetailsModel;
}) {
    const [model, setModel] = useState<CourseDetailsModel | null>(
        fallbackModel ?? null,
    );
    const [loading, setLoading] = useState(!fallbackModel);
    const [error, setError] = useState<string | null>(null);

    const [isEnrolleeModalOpen, setIsEnrolleeModalOpen] = useState(false);
    const [refundReservationId, setRefundReservationId] = useState<string | null>(
        null,
    );
    const [refundSuccessData, setRefundSuccessData] =
        useState<RefundSuccessData | null>(null);

    useEffect(() => {
        if (!workshopId) {
            setError("No workshop ID provided.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        Promise.all([
            getWorkshopById(workshopId),
            getWorkshopEnrollees(workshopId, { page: 1, limit: 10 }),
        ])
            .then(([workshop, enrollees]) => {
                const mapped = mapWorkshopToCourseDetailsModel(workshop);

                mapped.capacityUsed = enrollees.data.overview.totalEnrolled;
                mapped.refundRequests = enrollees.data.overview.refundRequested;

                setModel(mapped);
            })
            .catch((err) => {
                setError(
                    err instanceof Error ? err.message : "Failed to load workshop.",
                );
                setModel(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [workshopId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-slate-400" />
            </div>
        );
    }

    if (!model) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-slate-500">
                    {error ?? "Workshop not found."}
                </p>
            </div>
        );
    }

    const mode = model.deliveryMode as CourseDetailsDeliveryMode | null;

    return (
        <>
            <div className="space-y-5">
                <CourseDetailsHeader title={model.title} status={model.status} workshopId={workshopId} />

                <CourseDetailsStats
                    capacityUsed={model.capacityUsed}
                    capacityTotal={model.capacityTotal}
                    refundRequests={model.refundRequests}
                />

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsEnrolleeModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99]"
                    >
                        View Enrollees
                    </button>
                </div>

                {!mode ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <p className="text-sm font-semibold text-slate-900">
                            Missing delivery mode
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            This workshop does not have a valid delivery mode.
                        </p>
                    </div>
                ) : mode === "in_person" ? (
                    <CourseDetailsInPerson model={model} />
                ) : (
                    <CourseDetailsOnline model={model} />
                )}
            </div>

            <EnrolleeListModal
                open={isEnrolleeModalOpen}
                workshopId={workshopId}
                onClose={() => setIsEnrolleeModalOpen(false)}
                onProcessRefund={(reservationId) => {
                    setRefundReservationId(reservationId);
                }}
            />

            <RefundPreviewModal
                open={Boolean(refundReservationId)}
                workshopId={workshopId}
                reservationId={refundReservationId}
                onClose={() => setRefundReservationId(null)}
                onSuccess={(data) => {
                    setRefundReservationId(null);
                    setRefundSuccessData(data);
                }}
            />

            <RefundSuccessModal
                open={Boolean(refundSuccessData)}
                data={refundSuccessData}
                onClose={() => setRefundSuccessData(null)}
            />
        </>
    );
}