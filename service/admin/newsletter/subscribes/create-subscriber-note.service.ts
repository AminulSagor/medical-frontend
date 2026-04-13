import { serviceClient } from "@/service/base/axios_client";
import type {
    CreateSubscriberNotePayload,
    CreateSubscriberNoteResponse,
} from "@/types/admin/newsletter/general-newsletter/subscribes/create-subscriber-note.types";

export const createSubscriberNote = async (
    subscriberId: string,
    payload: CreateSubscriberNotePayload,
): Promise<CreateSubscriberNoteResponse> => {
    const response = await serviceClient.post<CreateSubscriberNoteResponse>(
        `/admin/newsletters/general/subscribers/${subscriberId}/notes`,
        payload,
    );

    return response.data;
};