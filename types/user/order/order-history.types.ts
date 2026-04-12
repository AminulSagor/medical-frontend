export interface UserOrderHistoryLeadItem {
  title: string;
  sku: string;
  imageUrl: string | null;
  extraItemsText: string | null;
  badgeText: string | null;
}

export interface UserOrderHistoryActions {
  view: string;
  invoice: string;
  reorder: string;
}

export interface UserOrderHistoryItem {
  id: string;
  orderNumber: string;
  dateOrdered: string;
  status: string;
  totalAmount: string;
  totalItemsCount: number;
  leadItem: UserOrderHistoryLeadItem;
  actions: UserOrderHistoryActions;
}

export interface UserOrderHistoryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserOrderHistoryResponse {
  message: string;
  data: UserOrderHistoryItem[];
  meta: UserOrderHistoryMeta;
}

export interface GetUserOrderHistoryParams {
  page?: number;
  limit?: number;
}

export interface UserOrderMetricValue<T = number | string> {
  value: T;
  trend: string;
}

export interface UserOrderMetricsData {
  activeDeliveries: UserOrderMetricValue<number>;
  orderedThisMonth: UserOrderMetricValue<number>;
  orderValueMonth: UserOrderMetricValue<string>;
  totalOrderedValue: UserOrderMetricValue<string>;
}

export interface UserOrderMetricsResponse {
  message: string;
  data: UserOrderMetricsData;
}
