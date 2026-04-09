export interface AdminOrdersSummaryCards {
  thisMonthRevenue: number;
  totalOrders: number;
  toBeShipped: number;
  avgOrderValue: number;
}

export interface AdminOrdersSummaryResponse {
  cards: AdminOrdersSummaryCards;
}