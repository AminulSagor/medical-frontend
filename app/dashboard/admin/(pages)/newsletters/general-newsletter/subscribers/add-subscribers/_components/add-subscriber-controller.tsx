"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddSubscriberHeader from "./add-subscriber-header";
import AddSubscriberForm from "../add-subscriber-form";
import ClinicianRegisteredDialog, {
  ClinicianRegisteredDialogData,
} from "./clinician-registered-dialog";
import { AddSubscriberSelectData } from "../types/add-subscribers-type";

export default function AddSubscriberController({
  selectData,
}: {
  selectData: AddSubscriberSelectData;
}) {
  const router = useRouter();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successData, setSuccessData] = useState<ClinicianRegisteredDialogData>(
    {
      name: "Dr. Sarah Thompson",
      role: "Anesthesiologist",
      statusLabel: "Active Subscriber",
      initialSource: "Manual Entry",
    },
  );

  return (
    <div className="space-y-6">
      <AddSubscriberHeader
        onDiscard={() => router.back()}
        // keep this optional; real open happens on success
        onAddClick={() => {}}
      />

      <AddSubscriberForm
        selectData={selectData}
        onSuccess={(payload) => {
          setSuccessData({
            name: payload.name,
            role: payload.role,
            statusLabel: payload.statusLabel ?? "Active Subscriber",
            initialSource: payload.initialSource ?? "Manual Entry",
          });
          setOpenSuccess(true);
        }}
      />

      <ClinicianRegisteredDialog
        open={openSuccess}
        onOpenChange={setOpenSuccess}
        data={successData}
        onGoProfile={() => {
          setOpenSuccess(false);
          router.push("/newsletters/subscriber-profile");
        }}
        onReturnList={() => {
          setOpenSuccess(false);
          router.push("/newsletters?tab=subscribers");
        }}
      />
    </div>
  );
}
