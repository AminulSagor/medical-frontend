import type { UnsubscriptionDetailResponseDto } from "@/types/admin/newsletter/general-newsletter/subscribes/unsubscription-management.types";

export type ClinicalActivityItem = {
  label: string;
  value: string;
  active?: boolean;
};

export type UnsubscriptionDetails = UnsubscriptionDetailResponseDto;