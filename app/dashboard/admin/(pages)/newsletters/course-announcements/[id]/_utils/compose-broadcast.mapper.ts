import type { ComposeBroadcastInput } from "../_lib/compose-schema";
import type {
  CourseAnnouncementBroadcastDetails,
} from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";

function mapPriorityToFormValue(
  priority: string,
): ComposeBroadcastInput["priority"] {
  switch (priority) {
    case "MATERIAL_SHARE":
      return "material";
    case "URGENT":
      return "urgent";
    case "GENERAL_UPDATE":
    default:
      return "general";
  }
}

export function mapBroadcastDetailsToComposeDefaults(
  data: CourseAnnouncementBroadcastDetails,
): ComposeBroadcastInput {
  return {
    recipientIds: data.recipients.preview
      .map((recipient) => recipient.id)
      .filter((id): id is string => Boolean(id)),
    priority: mapPriorityToFormValue(data.form.priority),
    subject: data.form.subjectLine ?? "",
    message: data.form.messageBodyText ?? "",
    pushToStudentPanel: data.form.pushToStudentPanel,
  };
}
