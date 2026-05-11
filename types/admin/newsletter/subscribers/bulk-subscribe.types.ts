export interface BulkSubscribeRequest {
    emails: string[];
}

export interface BulkSubscribeResponse {
    message: string;
    data: {
        totalReceived: number;
        uniqueEmails: number;
        createdCount: number;
        skippedExistingCount: number;
        createdEmails: string[];
    };
}