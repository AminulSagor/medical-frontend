export interface CreateSubscriberNotePayload {
    note: string;
}

export interface CreateSubscriberNoteResponse {
    message: string;
    id: string;
    identifier: string;
}