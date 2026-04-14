import { getServerClient } from "@/service/base/axios_server";
import {
  CourseDetailResponse,
  CourseRefundInfoResponse,
  TicketDetailsApiResponse,
  TicketQrCodeResponse,
} from "@/types/user/course/course-detail-api.types";


export async function getBookedCourseDetails(courseId: string) {
  const serverClient = await getServerClient();
  const response = await serverClient.get<CourseDetailResponse>(
    `/workshops/private/my-courses/${courseId}`,
  );

  return response.data;
}

export async function getCourseRefundInfoServer(courseId: string) {
  const serverClient = await getServerClient();
  const response = await serverClient.get<CourseRefundInfoResponse>(
    `/workshops/private/my-courses/${courseId}/refund-info`,
  );

  return response.data;
}


export async function getTicketQrCodeServer(ticketId: string) {
  const serverClient = await getServerClient();
  const response = await serverClient.get<TicketQrCodeResponse>(
    `/workshops/private/tickets/${ticketId}/qr`,
  );

  return response.data;
}

export async function getTicketDetailsServer(ticketId: string) {
  const serverClient = await getServerClient();
  const response = await serverClient.get<TicketDetailsApiResponse>(
    `/workshops/public/tickets/${ticketId}`,
  );

  return response.data;
}
