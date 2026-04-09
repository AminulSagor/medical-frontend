export interface GetUploadUrlRequest {
  fileName: string;
  contentType: string;
  folder: string;
}

export interface GetUploadUrlResponse {
  message: string;
  signedUrl: string;
  fileKey: string;
  readUrl: string;
  instructions: {
    step1: string;
    step2: string;
    step3: string;
  };
}

export interface RefreshReadUrlRequest {
  fileKey: string;
}

export interface RefreshReadUrlResponse {
  message: string;
  readUrl: string;
}

export interface UploadResult {
  success: boolean;
  fileKey: string;
  readUrl: string;
  error?: string;
}
