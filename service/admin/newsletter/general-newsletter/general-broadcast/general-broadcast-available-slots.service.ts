import { serviceClient } from "@/service/base/axios_client";
import type {
  GeneralBroadcastCadenceAvailableSlotItem,
  GeneralBroadcastCadenceAvailableSlotsResponse,
  GeneralBroadcastCadenceFrequencyType,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-cadence.types";

type GetBroadcastAvailableSlotsOptions = {
  page?: number;
  limit?: number;
  year?: number;
};

const getCurrentYear = () => new Date().getFullYear();

const getSlotsByMonth = async (
  frequencyType: GeneralBroadcastCadenceFrequencyType,
  year: number,
  month: number,
  options?: GetBroadcastAvailableSlotsOptions,
): Promise<GeneralBroadcastCadenceAvailableSlotsResponse> => {
  const response =
    await serviceClient.get<GeneralBroadcastCadenceAvailableSlotsResponse>(
      "/admin/newsletters/general/cadence/available-slots",
      {
        params: {
          frequencyType,
          page: options?.page ?? 1,
          limit: options?.limit ?? 50,
          year,
          month,
        },
      },
    );

  return response.data;
};

const getYearSlots = async (
  frequencyType: GeneralBroadcastCadenceFrequencyType,
  options?: GetBroadcastAvailableSlotsOptions,
): Promise<GeneralBroadcastCadenceAvailableSlotsResponse> => {
  const year = options?.year ?? getCurrentYear();

  const monthlyResponses = await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      getSlotsByMonth(frequencyType, year, index + 1, options),
    ),
  );

  const mergedItemsMap = new Map<
    string,
    GeneralBroadcastCadenceAvailableSlotItem
  >();

  monthlyResponses.forEach((response) => {
    response.items.forEach((item) => {
      mergedItemsMap.set(item.scheduledAtUtc, item);
    });
  });

  const items = Array.from(mergedItemsMap.values()).sort((a, b) =>
    a.scheduledAtUtc.localeCompare(b.scheduledAtUtc),
  );

  return {
    items,
    meta: {
      page: 1,
      limit: items.length,
      total: items.length,
    },
    frequencyType,
    timezone: monthlyResponses[0]?.timezone ?? "",
  };
};

export const generalBroadcastAvailableSlotsService = {
  async getWeeklySlots(
    options?: GetBroadcastAvailableSlotsOptions,
  ): Promise<GeneralBroadcastCadenceAvailableSlotsResponse> {
    return getYearSlots("WEEKLY", options);
  },

  async getMonthlySlots(
    options?: GetBroadcastAvailableSlotsOptions,
  ): Promise<GeneralBroadcastCadenceAvailableSlotsResponse> {
    return getYearSlots("MONTHLY", options);
  },

  async getSlotsByFrequency(
    frequencyType: GeneralBroadcastCadenceFrequencyType,
    options?: GetBroadcastAvailableSlotsOptions,
  ): Promise<GeneralBroadcastCadenceAvailableSlotsResponse> {
    return getYearSlots(frequencyType, options);
  },
};
