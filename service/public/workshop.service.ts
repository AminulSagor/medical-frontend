import { serviceClient } from "@/service/base/axios_client";
import type {
  PublicWorkshopsResponse,
  PublicWorkshopDetails,
  PublicWorkshopDetailsResponse,
  FeaturedPublicWorkshopResponse,
  PublicWorkshop,
} from "@/types/public/workshop/public-workshop.types";

export interface PublicWorkshopsQueryParams {
  q?: string;
  search?: string;
  topic?: string;
  deliveryMode?: "in_person" | "online";
  hasAvailableSeats?: boolean | "true" | "false";
  offersCmeCredits?: boolean;
  minCmeCredits?: number;
  maxCmeCredits?: number;
  upcoming?: boolean;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: "price" | "title" | "createdAt" | "startDate";
  sortOrder?: "asc" | "desc";
}

type PublicWorkshopsApiResponse =
  | PublicWorkshopsResponse
  | {
    workshops?: PublicWorkshop[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    message?: string;
  };

function normalizePublicWorkshopsResponse(
  response: PublicWorkshopsApiResponse,
): PublicWorkshopsResponse {
  if (response && typeof response === "object" && "data" in response && "meta" in response) {
    return response as PublicWorkshopsResponse;
  }

  const normalized = response as {
    workshops?: PublicWorkshop[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    message?: string;
  };

  const page = normalized.page ?? 1;
  const limit = normalized.limit ?? normalized.workshops?.length ?? 0;
  const total = normalized.total ?? normalized.workshops?.length ?? 0;
  const totalPages =
    normalized.totalPages ?? (limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1);

  return {
    message: normalized.message ?? "Public workshops fetched successfully",
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: normalized.workshops ?? [],
  };
}

function buildPublicWorkshopParams(params?: PublicWorkshopsQueryParams) {
  if (!params) return undefined;

  const { q, search, topic, ...rest } = params;
  const resolvedQuery = q ?? search ?? topic;

  return {
    ...rest,
    q: resolvedQuery,
  };
}

export const getPublicWorkshops = async (
  params?: PublicWorkshopsQueryParams,
): Promise<PublicWorkshopsResponse> => {
  const response = await serviceClient.get<PublicWorkshopsApiResponse>(
    "/workshops",
    {
      params: buildPublicWorkshopParams(params),
    },
  );
  return normalizePublicWorkshopsResponse(response.data);
};

export const getFeaturedPublicWorkshop = async (): Promise<FeaturedPublicWorkshopResponse> => {
  const response = await serviceClient.get<FeaturedPublicWorkshopResponse>(
    "/workshops/public/featured",
  );
  return response.data;
};

export const getPublicWorkshopsUpcoming = async (
  params?: PublicWorkshopsQueryParams,
): Promise<PublicWorkshopsResponse> => {
  const response = await serviceClient.get<PublicWorkshopsApiResponse>(
    "/workshops",
    {
      params: buildPublicWorkshopParams({
        ...params,
        upcoming: true,
      }),
    },
  );
  return normalizePublicWorkshopsResponse(response.data);
};

type PublicWorkshopDetailsApiResponse =
  | PublicWorkshopDetailsResponse
  | PublicWorkshopDetails;

function normalizePublicWorkshopDetailsResponse(
  response: PublicWorkshopDetailsApiResponse,
): PublicWorkshopDetailsResponse {
  if (response && typeof response === "object" && "data" in response) {
    return response as PublicWorkshopDetailsResponse;
  }

  return {
    message: "Workshop details fetched successfully",
    data: response as PublicWorkshopDetails,
  };
}

export const getPublicWorkshopById = async (
  workshopId: string,
): Promise<PublicWorkshopDetailsResponse> => {
  const response = await serviceClient.get<PublicWorkshopDetailsApiResponse>(
    `/workshops/${workshopId}`,
  );
  return normalizePublicWorkshopDetailsResponse(response.data);
};