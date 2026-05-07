export interface GetUploadUrlRequest {
  fileName: string;
  contentType: string;
  folder: string;
}

export interface GetUploadUrlResponse {
  message: string;
  signedUrl: string;
  fileKey: string;
  publicUrl: string;
  instructions: {
    step1: string;
    step2: string;
    step3: string;
    note?: string;
  };
}

export interface RefreshReadUrlRequest {
  fileKey: string;
}

export interface RefreshReadUrlResponse {
  message: string;
  publicUrl: string;
}

export interface UploadResult {
  success: boolean;
  fileKey: string;
  publicUrl: string;
  error?: string;
}
