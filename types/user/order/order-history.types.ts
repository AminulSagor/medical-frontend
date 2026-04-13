export type OrderHistoryDuration = "3_months" | "6_months" | "1_year";

export type OrderHistoryStatus =
  | "unfulfilled"
  | "processing"
  | "shipped"
  | "received";

export type UserOrderHistoryLeadItem = {
  title: string;
  sku: string;
  imageUrl: string | null;
  extraItemsText: string | null;
  badgeText: string | null;
};

export type UserOrderHistoryActions = {
  view: string;
  invoice: string;
  reorder: string;
};

export type UserOrderHistoryItem = {
  id: string;
  orderNumber: string;
  dateOrdered: string;
  status: string;
  totalAmount: string;
  totalItemsCount: number;
  leadItem: UserOrderHistoryLeadItem;
  actions: UserOrderHistoryActions;
};

export type UserOrderHistoryMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UserOrderHistoryResponse = {
  message: string;
  data: UserOrderHistoryItem[];
  meta: UserOrderHistoryMeta;
};

export type GetUserOrderHistoryParams = {
  page?: number;
  limit?: number;
  duration?: OrderHistoryDuration;
  status?: OrderHistoryStatus;
  search?: string;
};

export type UserOrderMetricValue = {
  value: number | string;
  trend: string;
};

export type UserOrderMetricsData = {
  activeDeliveries: UserOrderMetricValue;
  orderedThisMonth: UserOrderMetricValue;
  orderValueMonth: UserOrderMetricValue;
  totalOrderedValue: UserOrderMetricValue;
};

export type UserOrderMetricsResponse = {
  message: string;
  data: UserOrderMetricsData;
};
