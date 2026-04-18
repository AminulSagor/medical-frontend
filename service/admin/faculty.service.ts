import { serviceClient } from "@/service/base/axios_client";
import {
  RegisterFacultyRequest,
  RegisterFacultyResponse,
  SearchFacultyResponse,
} from "@/types/admin/faculty.types";

export const registerFaculty = async (
  data: RegisterFacultyRequest
): Promise<RegisterFacultyResponse> => {
  const response = await serviceClient.post<RegisterFacultyResponse>(
    `/admin/faculty`,
    data
  );
  return response.data;
};

export const searchFaculty = async (
  query?: string,
  page = 1,
  limit = 10,
  signal?: AbortSignal
): Promise<SearchFacultyResponse> => {
  const trimmedQuery = query?.trim();
  const response = await serviceClient.get<SearchFacultyResponse>(
    `/admin/faculty`,
    {
      params: {
        ...(trimmedQuery ? { q: trimmedQuery } : {}),
        page,
        limit,
      },
      signal,
    }
  );
  return response.data;
};
