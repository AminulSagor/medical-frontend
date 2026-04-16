import { Suspense } from "react";

import WorkshopCreateClient from "./_components/workshop-create-client";

export default function CreateWorkshopPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading...</div>}>
      <WorkshopCreateClient />
    </Suspense>
  );
}