import { getUploadUrl, refreshReadUrl } from "@/service/upload/upload.service";
import { UploadResult } from "@/types/upload/upload.types";

export type UploadFolder = 
  | "vendors"
  | "products"
  | "courses"
  | "blogs"
  | "users"
  | "documents"
  | "general";

export interface FileUploadOptions {
  folder: UploadFolder;
  onProgress?: (progress: number) => void;
}

/**
 * Get content type from file
 */
export const getContentType = (file: File): string => {
  return file.type || "application/octet-stream";
};

/**
 * Upload a file to S3 using signed URL
 * 
 * @param file - The file to upload
 * @param options - Upload options including folder and progress callback
 * @returns UploadResult with fileKey and readUrl on success
 * 
 * @example
 * ```tsx
 * const result = await uploadFile(file, { 
 *   folder: "products",
 *   onProgress: (progress) => console.log(`${progress}%`)
 * });
 * 
 * if (result.success) {
 *   console.log("File key:", result.fileKey);
 *   console.log("Read URL:", result.readUrl);
 * }
 * ```
 */
export const uploadFile = async (
  file: File,
  options: FileUploadOptions
): Promise<UploadResult> => {
  try {
    // Step 1: Get signed URL from backend
    const { signedUrl, fileKey, readUrl } = await getUploadUrl({
      fileName: file.name,
      contentType: getContentType(file),
      folder: options.folder,
    });

    // Step 2: Upload file to S3 using signed URL with fetch
    // Using fetch is more reliable with AWS S3 signed URLs that have checksum params
    const response = await fetch(signedUrl, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
    }

    // Report 100% progress
    if (options.onProgress) {
      options.onProgress(100);
    }

    return {
      success: true,
      fileKey,
      readUrl,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Upload failed";
    return {
      success: false,
      fileKey: "",
      readUrl: "",
      error: errorMessage,
    };
  }
};

/**
 * Upload multiple files
 * 
 * @param files - Array of files to upload
 * @param options - Upload options
 * @returns Array of UploadResult
 */
export const uploadMultipleFiles = async (
  files: File[],
  options: FileUploadOptions
): Promise<UploadResult[]> => {
  const results = await Promise.all(
    files.map((file) => uploadFile(file, options))
  );
  return results;
};

/**
 * Refresh an expired read URL
 * 
 * @param fileKey - The file key to refresh
 * @returns New read URL or null on error
 */
export const refreshFileUrl = async (fileKey: string): Promise<string | null> => {
  try {
    const response = await refreshReadUrl({ fileKey });
    return response.readUrl;
  } catch {
    return null;
  }
};

/**
 * Validate file before upload
 * 
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result
 */
export const validateFile = (
  file: File,
  options?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  }
): { valid: boolean; error?: string } => {
  const maxSizeMB = options?.maxSizeMB ?? 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  if (options?.allowedTypes && options.allowedTypes.length > 0) {
    const isAllowed = options.allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const category = type.replace("/*", "");
        return file.type.startsWith(category);
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }
  }

  return { valid: true };
};

/**
 * Common file type presets for validation
 */
export const FILE_TYPE_PRESETS = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  videos: ["video/mp4", "video/webm", "video/ogg"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
  all: ["image/*", "application/pdf", "video/*", "audio/*"],
};
