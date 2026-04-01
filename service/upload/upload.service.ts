import { serviceClient } from "@/service/base/axios_client";

export type GetUploadUrlRequest = {
  fileName: string;
  contentType: string;
  folder: string;
};

export type GetUploadUrlResponse = {
  message?: string;
  signedUrl: string;
  fileKey: string;
  readUrl: string;
};

export type RefreshReadUrlRequest = {
  fileKey: string;
};

export type RefreshReadUrlResponse = {
  message?: string;
  readUrl: string;
  fileKey: string;
  expiresIn?: string;
};

export async function getUploadUrl(body: GetUploadUrlRequest): Promise<GetUploadUrlResponse> {
  const { data } = await serviceClient.post<GetUploadUrlResponse>("/upload/get-upload-url", body);
  return data;
}

export async function refreshReadUrl(body: RefreshReadUrlRequest): Promise<RefreshReadUrlResponse> {
  const { data } = await serviceClient.post<RefreshReadUrlResponse>(
    "/upload/refresh-read-url",
    body
  );
  return data;
}

export async function putFileToSignedUrl(
  signedUrl: string,
  file: Blob,
  contentType: string
): Promise<void> {
  const res = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) {
    throw new Error(`Upload to storage failed (${res.status})`);
  }
}

export async function uploadFileViaSignedUrl(
  file: File,
  folder: string
): Promise<{ readUrl: string; fileKey: string }> {
  const contentType = file.type || "application/octet-stream";
  const meta = await getUploadUrl({
    fileName: file.name || "upload.bin",
    contentType,
    folder,
  });
  await putFileToSignedUrl(meta.signedUrl, file, contentType);
  return { readUrl: meta.readUrl, fileKey: meta.fileKey };
}
