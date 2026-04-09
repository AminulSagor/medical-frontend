import { serviceClient } from "@/service/base/axios_client";
import {
  ApplyGeneralBroadcastCadenceRecalculationResponse,
  GeneralBroadcastCadence,
  GeneralBroadcastCadenceAvailableSlotsResponse,
  GeneralBroadcastCadenceRecalculationPayload,
  GetGeneralBroadcastCadenceAvailableSlotsParams,
  PreviewGeneralBroadcastCadenceRecalculationResponse,
  UpdateGeneralBroadcastCadencePayload,
  UpdateGeneralBroadcastCadenceResponse,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-cadence.types";

export const generalBroadcastCadenceService = {
  async getGeneralBroadcastCadence(): Promise<GeneralBroadcastCadence> {
    const response = await serviceClient.get<GeneralBroadcastCadence>(
      "/admin/newsletters/general/cadence",
    );

    return response.data;
  },

  async updateGeneralBroadcastCadence(
    payload: UpdateGeneralBroadcastCadencePayload,
  ): Promise<UpdateGeneralBroadcastCadenceResponse> {
    const response =
      await serviceClient.patch<UpdateGeneralBroadcastCadenceResponse>(
        "/admin/newsletters/general/cadence",
        payload,
      );

    return response.data;
  },

  async getGeneralBroadcastCadenceAvailableSlots(
    params: GetGeneralBroadcastCadenceAvailableSlotsParams,
  ): Promise<GeneralBroadcastCadenceAvailableSlotsResponse> {
    const response =
      await serviceClient.get<GeneralBroadcastCadenceAvailableSlotsResponse>(
        "/admin/newsletters/general/cadence/available-slots",
        { params },
      );

    return response.data;
  },

  async previewGeneralBroadcastCadenceRecalculation(
    payload: GeneralBroadcastCadenceRecalculationPayload,
  ): Promise<PreviewGeneralBroadcastCadenceRecalculationResponse> {
    const response =
      await serviceClient.post<PreviewGeneralBroadcastCadenceRecalculationResponse>(
        "/admin/newsletters/general/cadence/recalculation/preview",
        payload,
      );

    return response.data;
  },

  async applyGeneralBroadcastCadenceRecalculation(
    payload: GeneralBroadcastCadenceRecalculationPayload,
  ): Promise<ApplyGeneralBroadcastCadenceRecalculationResponse> {
    const response =
      await serviceClient.post<ApplyGeneralBroadcastCadenceRecalculationResponse>(
        "/admin/newsletters/general/cadence/recalculation/apply",
        payload,
      );

    return response.data;
  },
};
