import { serviceClient } from "@/service/base/axios_client";
import type {
  Workshop,
  CreateWorkshopRequest,
  UpdateWorkshopRequest,
  ListWorkshopsParams,
  ListWorkshopsResponse,
  RawListWorkshopsResponse,
  LegacyListWorkshopsResponse,
  AdvancedListWorkshopsResponse,
  WorkshopEnrolleesResponse,
  ListWorkshopEnrolleesParams,
  WorkshopRefundPreviewResponse,
  ConfirmWorkshopRefundRequest,
  ConfirmWorkshopRefundResponse,
  DeleteWorkshopResponse,
  WorkshopEnrolleeItem,
  WorkshopStatsResponse,
  WorkshopStatus,
} from "@/types/admin/workshop.types";

type ApiResponse<T> = {
  message?: string;
  statusCode?: number;
  data: T;
};

type DocumentedListWorkshopsResponse = {
  workshops?: Workshop[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  message?: string;
};

type DocumentedWorkshopEnrolleesResponse = {
  enrollees?: WorkshopEnrolleeItem[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

type DocumentedRefundPreviewResponse = {
  reservation?: {
    id: string;
    numberOfSeats: number;
    totalPrice: string;
    attendees: {
      id: string;
      fullName: string;
      email: string;
    }[];
  };
  refundableAmount?: string;
  refundableAttendees?: {
    attendeeId: string;
    fullName: string;
    refundAmount: string;
  }[];
};

type DocumentedConfirmRefundResponse = {
  refundId?: string;
  requestId?: string;
  status?: "PROCESSED";
  refundAmount?: string;
  processedAt?: string;
  attendees?: {
    attendeeId: string;
    status: "REFUNDED" | "PARTIAL_REFUNDED";
    refundAmount: string;
  }[];
};

function isLegacyListWorkshopsResponse(
  response: RawListWorkshopsResponse,
): response is LegacyListWorkshopsResponse {
  return (
    "data" in response &&
    typeof response.data === "object" &&
    response.data !== null &&
    "workshops" in response.data
  );
}

function isDocumentedListWorkshopsResponse(
  response: unknown,
): response is DocumentedListWorkshopsResponse {
  return !!response && typeof response === "object" && "workshops" in (response as Record<string, unknown>);
}

function normalizeListWorkshopsResponse(
  response: RawListWorkshopsResponse | DocumentedListWorkshopsResponse,
): ListWorkshopsResponse {
  if (isLegacyListWorkshopsResponse(response as RawListWorkshopsResponse)) {
    const legacy = response as LegacyListWorkshopsResponse;
    const totalPages =
      legacy.data.limit > 0
        ? Math.ceil(legacy.data.total / legacy.data.limit)
        : 1;

    return {
      message: legacy.message,
      meta: {
        page: legacy.data.page,
        limit: legacy.data.limit,
        total: legacy.data.total,
        totalPages,
      },
      data: legacy.data.workshops,
    };
  }

  if (isDocumentedListWorkshopsResponse(response)) {
    return {
      message: response.message,
      meta: {
        page: response.page ?? 1,
        limit: response.limit ?? response.workshops?.length ?? 0,
        total: response.total ?? response.workshops?.length ?? 0,
        totalPages:
          response.totalPages ??
          ((response.limit ?? 0) > 0
            ? Math.max(1, Math.ceil((response.total ?? 0) / (response.limit ?? 1)))
            : 1),
      },
      data: response.workshops ?? [],
    };
  }

  const advancedResponse = response as AdvancedListWorkshopsResponse;

  return {
    message: advancedResponse.message,
    meta: advancedResponse.meta,
    data: advancedResponse.data,
  };
}

function unwrapWorkshopResponse(
  responseData: ApiResponse<Workshop> | Workshop,
): Workshop {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return responseData.data as Workshop;
  }

  return responseData as Workshop;
}

function normalizeWorkshopEnrolleesResponse(
  response: WorkshopEnrolleesResponse | DocumentedWorkshopEnrolleesResponse,
): WorkshopEnrolleesResponse {
  if (response && typeof response === "object" && "data" in response && "meta" in response) {
    return response as WorkshopEnrolleesResponse;
  }

  const documented = response as DocumentedWorkshopEnrolleesResponse;
  const items = documented.enrollees ?? [];
  const total = documented.pagination?.total ?? items.length;
  const page = documented.pagination?.page ?? 1;
  const limit = documented.pagination?.limit ?? items.length;
  const totalPages = documented.pagination?.totalPages ?? (limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1);

  const overview = items.reduce(
    (acc, item) => {
      acc.totalEnrolled += item.groupSize || 1;
      const status = item.status?.toUpperCase?.() || "";
      if (status === "REFUND_REQUESTED") acc.refundRequested += 1;
      if (status === "PARTIAL_REFUNDED") acc.partialRefund += 1;
      if (status === "REFUNDED") acc.refunded += 1;
      return acc;
    },
    { totalEnrolled: 0, refundRequested: 0, partialRefund: 0, refunded: 0 },
  );

  return {
    message: undefined,
    data: {
      workshop: {
        id: "",
        title: "Course Enrollee List",
        registrationDeadline: undefined,
      },
      overview,
      items,
    },
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

function normalizeRefundPreviewResponse(
  response: WorkshopRefundPreviewResponse | DocumentedRefundPreviewResponse,
): WorkshopRefundPreviewResponse {
  if (response && typeof response === "object" && "data" in response) {
    return response as WorkshopRefundPreviewResponse;
  }

  const documented = response as DocumentedRefundPreviewResponse;
  const attendees = documented.reservation?.attendees ?? [];
  const selectedCount = documented.refundableAttendees?.length ?? attendees.length;

  return {
    message: undefined,
    data: {
      reservationId: documented.reservation?.id ?? "",
      workshopId: "",
      requestId: null,
      bookingOwner: {
        fullName: attendees[0]?.fullName ?? "—",
      },
      bookingType: "single",
      groupSize: documented.reservation?.numberOfSeats ?? attendees.length,
      activeGroupSize: documented.reservation?.numberOfSeats ?? attendees.length,
      totalPaid: documented.reservation?.totalPrice ?? "0.00",
      paymentGateway: "",
      transactionId: "",
      refundRequestStatus: selectedCount > 0,
      requestedMembers: (documented.refundableAttendees ?? []).map((item) => ({
        attendeeId: item.attendeeId,
        fullName: item.fullName,
        email: attendees.find((attendee) => attendee.id === item.attendeeId)?.email ?? "",
        refundAmount: item.refundAmount,
        status: "REQUESTED",
        isSelectable: true,
        isRequested: true,
      })),
      members: attendees.map((attendee) => {
        const refundItem = documented.refundableAttendees?.find((item) => item.attendeeId === attendee.id);
        return {
          attendeeId: attendee.id,
          fullName: attendee.fullName,
          email: attendee.email,
          refundAmount: refundItem?.refundAmount ?? "0.00",
          status: refundItem ? "REQUESTED" : "CONFIRMED",
          isSelectable: !!refundItem,
          isRequested: !!refundItem,
        };
      }),
      summary: {
        selectedCount,
        calculatedRefundAmount: documented.refundableAmount ?? "0.00",
      },
    },
  };
}

function normalizeConfirmRefundResponse(
  response: ConfirmWorkshopRefundResponse | DocumentedConfirmRefundResponse,
): ConfirmWorkshopRefundResponse {
  if (response && typeof response === "object" && "data" in response) {
    return response as ConfirmWorkshopRefundResponse;
  }

  const documented = response as DocumentedConfirmRefundResponse;
  return {
    message: documented.status,
    data: {
      refundId: documented.refundId,
      requestId: documented.requestId,
      reservationId: documented.requestId,
      processedMemberCount: documented.attendees?.length,
      refundedAmount: documented.refundAmount,
      paymentGateway: undefined,
      transactionId: documented.refundId,
    },
  };
}

function buildListWorkshopParams(params?: ListWorkshopsParams) {
  if (!params) return undefined;
  const { q, ...rest } = params;
  return {
    ...rest,
    search: q,
  };
}

export const createWorkshop = async (
  data: CreateWorkshopRequest,
): Promise<Workshop> => {
  const response = await serviceClient.post<ApiResponse<Workshop> | Workshop>(
    "/admin/workshops",
    data,
  );

  return unwrapWorkshopResponse(response.data);
};

export const updateWorkshop = async (
  id: string,
  data: UpdateWorkshopRequest,
): Promise<Workshop> => {
  const response = await serviceClient.put<ApiResponse<Workshop> | Workshop>(
    `/admin/workshops/${id}`,
    data,
  );

  return unwrapWorkshopResponse(response.data);
};

export const updateWorkshopStatus = async (
  id: string,
  status: WorkshopStatus,
): Promise<Workshop> => {
  const response = await serviceClient.put<ApiResponse<Workshop> | Workshop>(
    `/admin/workshops/${id}`,
    { status },
  );

  return unwrapWorkshopResponse(response.data);
};

export const listWorkshops = async (
  params?: ListWorkshopsParams,
): Promise<ListWorkshopsResponse> => {
  const response = await serviceClient.get<RawListWorkshopsResponse | DocumentedListWorkshopsResponse>(
    "/admin/workshops",
    { params: buildListWorkshopParams(params) },
  );

  return normalizeListWorkshopsResponse(response.data);
};

export const getPublicWorkshops = async (): Promise<ListWorkshopsResponse> => {
  const response = await serviceClient.get<ListWorkshopsResponse>("/workshops");
  return response.data;
};

export const deleteWorkshop = async (
  id: string,
): Promise<DeleteWorkshopResponse> => {
  const response = await serviceClient.delete<DeleteWorkshopResponse>(
    `/admin/workshops/${id}`,
  );

  if (!response.data) {
    return {
      message: "Workshop deleted successfully",
      data: {
        workshopId: id,
        title: "",
      },
    };
  }

  return response.data;
};

export const getWorkshopById = async (id: string): Promise<Workshop> => {
  const response = await serviceClient.get<ApiResponse<Workshop> | Workshop>(
    `/admin/workshops/${id}`,
  );

  return unwrapWorkshopResponse(response.data);
};

export const getWorkshopEnrollees = async (
  workshopId: string,
  params?: ListWorkshopEnrolleesParams,
): Promise<WorkshopEnrolleesResponse> => {
  const response = await serviceClient.get<WorkshopEnrolleesResponse | DocumentedWorkshopEnrolleesResponse>(
    `/admin/workshops/${workshopId}/enrollees`,
    { params },
  );

  return normalizeWorkshopEnrolleesResponse(response.data);
};

export const getWorkshopRefundPreview = async (
  workshopId: string,
  reservationId: string,
): Promise<WorkshopRefundPreviewResponse> => {
  const response = await serviceClient.get<WorkshopRefundPreviewResponse | DocumentedRefundPreviewResponse>(
    `/admin/workshops/${workshopId}/enrollees/${reservationId}/refund-preview`,
  );

  return normalizeRefundPreviewResponse(response.data);
};

export const confirmWorkshopRefund = async (
  workshopId: string,
  data: ConfirmWorkshopRefundRequest,
): Promise<ConfirmWorkshopRefundResponse> => {
  const response = await serviceClient.post<ConfirmWorkshopRefundResponse | DocumentedConfirmRefundResponse>(
    `/admin/workshops/${workshopId}/refunds/confirm`,
    {
      reservationId: data.reservationId,
      attendeeIds: data.attendeeIds,
      refundAmount: data.refundAmount,
      adjustmentNote: data.adjustmentNote,
      paymentGateway: data.paymentGateway,
      transactionId: data.transactionId,
    },
  );

  return normalizeConfirmRefundResponse(response.data);
};


export const getWorkshopStats = async (
  params?: { startDate?: string; days?: number },
): Promise<WorkshopStatsResponse> => {
  const response = await serviceClient.get<WorkshopStatsResponse>(
    "/admin/workshops/stats",
    { params },
  );

  return response.data;
};

export const getPublicWorkshopById = async (id: string): Promise<Workshop> => {
  const response = await serviceClient.get<Workshop>(`/workshops/${id}`);
  return response.data;
};
