import { serviceClient } from "@/service/base/axios_client";
import type {
  CourseCalendarLinksResponse,
  CourseDetailResponse,
  CourseMeetingInfoResponse,
  CourseRefundInfoResponse,
  CourseRefundSubmitRequest,
  CourseRefundSubmitResponse,
  TicketQrCodeResponse,
} from "@/types/user/course/course-detail-api.types";

export const getBookedCourseDetailsClient = async (
  courseId: string,
): Promise<CourseDetailResponse> => {
  const response = await serviceClient.get<CourseDetailResponse>(
    `/workshops/private/my-courses/${courseId}`,
  );

  return response.data;
};

export const getCourseRefundInfo = async (
  courseId: string,
): Promise<CourseRefundInfoResponse> => {
  const response = await serviceClient.get<CourseRefundInfoResponse>(
    `/workshops/private/my-courses/${courseId}/refund-info`,
  );

  return response.data;
};

export const submitCourseRefundRequest = async (
  courseId: string,
  payload: CourseRefundSubmitRequest,
): Promise<CourseRefundSubmitResponse> => {
  const response = await serviceClient.post<CourseRefundSubmitResponse>(
    `/workshops/private/my-courses/${courseId}/refund`,
    payload,
  );

  return response.data;
};

export const getCourseCalendarLinks = async (
  courseId: string,
): Promise<CourseCalendarLinksResponse> => {
  const response = await serviceClient.get<CourseCalendarLinksResponse>(
    `/workshops/private/my-courses/${courseId}/calendar`,
  );

  return response.data;
};

export const getCourseMeetingInfo = async (
  courseId: string,
): Promise<CourseMeetingInfoResponse> => {
  const response = await serviceClient.get<CourseMeetingInfoResponse>(
    `/workshops/private/my-courses/${courseId}/meeting`,
  );

  return response.data;
};

export const getTicketQrCode = async (
  ticketId: string,
): Promise<TicketQrCodeResponse> => {
  const response = await serviceClient.get<TicketQrCodeResponse>(
    `/workshops/private/tickets/${ticketId}/qr`,
  );

  return response.data;
};

export const resolveServiceHref = (href?: string | null): string | undefined => {
  if (!href) return undefined;
  if (/^https?:\/\//i.test(href)) return href;

  const baseUrl = String(serviceClient.defaults.baseURL ?? "").replace(/\/$/, "");
  const normalizedPath = href.startsWith("/") ? href : `/${href}`;

  if (!baseUrl) return normalizedPath;
  return `${baseUrl}${normalizedPath}`;
};

async function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

async function fetchProtectedBlob(pathOrUrl: string, filename: string) {
  const response = await serviceClient.get<Blob>(pathOrUrl, {
    responseType: "blob",
    baseURL: /^https?:\/\//i.test(pathOrUrl) ? undefined : serviceClient.defaults.baseURL,
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  return { blob, filename };
}

export const triggerServiceFileDownload = async (
  href?: string | null,
  filename = "download.pdf",
) => {
  const resolvedHref = resolveServiceHref(href);
  if (!resolvedHref || typeof window === "undefined") return;

  if (/\.pdf($|\?)/i.test(resolvedHref) || resolvedHref.includes("/download")) {
    const file = await fetchProtectedBlob(resolvedHref, filename);
    await downloadBlob(file.blob, file.filename);
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = resolvedHref;
  anchor.download = "";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

export const downloadTicketPdf = async (ticketId: string): Promise<void> => {
  const response = await serviceClient.get<Blob>(
    `/workshops/private/tickets/${ticketId}/download`,
    { responseType: "blob" },
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  await downloadBlob(blob, `ticket-${ticketId}.pdf`);
};

export const downloadCertificatePdf = async (
  ticketId: string,
  filename = `certificate-${ticketId}.pdf`,
): Promise<void> => {
  const response = await serviceClient.get<Blob>(
    `/workshops/private/my-course/certificate/${ticketId}/download`,
    { responseType: "blob" },
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  await downloadBlob(blob, filename);
};

export const shareCertificatePdf = async (
  ticketId: string,
  filename = `certificate-${ticketId}.pdf`,
): Promise<void> => {
  const response = await serviceClient.get<Blob>(
    `/workshops/private/my-course/certificate/${ticketId}/download`,
    { responseType: "blob" },
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  const file = new File([blob], filename, { type: "application/pdf" });

  if (
    typeof navigator !== "undefined" &&
    navigator.share &&
    (!navigator.canShare || navigator.canShare({ files: [file] }))
  ) {
    await navigator.share({ files: [file], title: filename });
    return;
  }

  await downloadBlob(blob, filename);
};
