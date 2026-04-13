export type UnsubscribeRequestsTab = "requested" | "unsubscribed";

export type UnsubscribeRequestStatus =
  | "PENDING"
  | "UNSUBSCRIBED"
  | "PROCESSED"
  | "DISMISSED"
  | string;

export type UnsubscribeRequestListItemDto = {
  id: string;
  subscriberIdentity: {
    fullName: string;
    email: string;
    avatarInitials?: string;
    image?: string | null;
  };
  requestDate: string;
  sourceSegment: string;
  feedback?: string;
  status: UnsubscribeRequestStatus;
};

export type UnsubscribeRequestsListResponseDto = {
  cards: {
    pendingRequests: number;
    totalUnsubscribed: number;
    avgResponseTimeLabel: string;
  };
  tab: UnsubscribeRequestsTab;
  items: UnsubscribeRequestListItemDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type UnsubscriptionDetailResponseDto = {
  modal?: {
    title?: string;
  };
  subscriber: {
    id: string;
    fullName: string;
    email: string;
    status?: string;
    clinicalRole?: string | null;
    avatarInitials?: string;
  };
  request: {
    id: string;
    createdAt: string;
    source: string;
    feedback?: string;
    status?: string;
  };
  activity?: {
    timeline?: Array<{
      label: string;
      value: string;
      active?: boolean;
    }>;
  };
  actions?: {
    confirm?: boolean;
    dismiss?: boolean;
  };
};

export type GetUnsubscribeRequestsParams = {
  tab: UnsubscribeRequestsTab;
  page?: number;
  limit?: number;
  search?: string;
};

export type ConfirmUnsubscriptionRequestDto = {
  reason: string;
  sendConfirmationEmail: boolean;
};

export type ConfirmUnsubscriptionSuccessModalPayloadDto = {
  subscriberEmail: string;
  statusLabel: string;
};

export type ConfirmUnsubscriptionSuccessModalDto = {
  title: string;
  payload: ConfirmUnsubscriptionSuccessModalPayloadDto;
  ctaLabel: string;
};

export type ConfirmUnsubscriptionResponseDto = {
  message: string;
  id: string;
  email: string;
  successModal: ConfirmUnsubscriptionSuccessModalDto;
};

export type ConfirmUnsubscriptionErrorResponseDto = {
  statusCode: number;
  path: string;
  message: string;
};
