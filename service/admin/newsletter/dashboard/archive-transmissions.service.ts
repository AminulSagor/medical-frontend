import { serviceClient } from "@/service/base/axios_client";

export interface ArchiveTransmissionsPayload {
  broadcastIds: string[];
}

export const archiveTransmissions = async (
  payload: ArchiveTransmissionsPayload,
): Promise<void> => {
  await serviceClient.post("/admin/newsletters/transmissions/archive", payload);
};