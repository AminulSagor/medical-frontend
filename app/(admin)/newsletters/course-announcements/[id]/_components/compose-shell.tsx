import type { ComposeBroadcastServerData } from "../_lib/compose-types";
import type { ComposeBroadcastInput } from "../_lib/compose-schema";

import CohortPillBar from "./cohort-pill-bar";
import RecipientsPanel from "./recipients-panel";
import PrioritySubjectPanel from "./priority-subject-panel";
import MessageContentPanel from "./message-panel"; // or message-content-panel.tsx
import AttachmentsPanel from "./attachments-panel";
import PushToggleRow from "./push-toggle-row";
import SendBar from "./send-bar";
import ComposeFormProvider from "./compose-form-provider";

export default function ComposeShell({
  data,
}: {
  data: ComposeBroadcastServerData;
}) {
  // ✅ defaultValues required by zod schema
  const defaults: ComposeBroadcastInput = {
    recipientIds: data.recipients.map((r) => r.id), // initially all selected
    priority: "general",
    subject: "",
    message: "",
    pushToStudentPanel: true,
  };

  return (
    <div className="space-y-6">
      <CohortPillBar cohort={data.cohort} />

      {/* ✅ Client form provider wraps only interactive sections */}
      <ComposeFormProvider defaultValues={defaults}>
        <RecipientsPanel recipients={data.recipients} />
        <PrioritySubjectPanel />
        <MessageContentPanel />
        <AttachmentsPanel />
        <PushToggleRow />
        <SendBar />
      </ComposeFormProvider>
    </div>
  );
}