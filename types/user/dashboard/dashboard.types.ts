export interface DashboardSummaryData {
  cmeCredits: string;
  coursesCompleted: number;
  nextClass: string;
}

export interface DashboardSummaryResponse {
  message: string;
  data: DashboardSummaryData;
}

export interface RecentProductOrderProductItem {
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

export interface RecentProductOrderData {
  id: string;
  orderId: string;
  orderedAt: string;
  orderedAtFullDate: string;
  price: string;
  shippingStatus: string;
  fulfillmentStatus: string;
  paymentStatus: string;
  productName: string;
  productImage: string | null;
  products: RecentProductOrderProductItem[];
}

export interface RecentProductOrderResponse {
  message: string;
  data: RecentProductOrderData[];
}

export interface EnrolledWorkshopReservation {
  reservationId: string;
  status: string;
  numberOfSeats: number;
  pricePerSeat: string;
  totalPrice: string;
}

export interface EnrolledWorkshopItem {
  workshopId: string;
  title: string;
  courseType?: string | null;
  deliveryMode?: string | null;
  workshopPhoto: string | null;
  status?: string;
  isEnrolled?: boolean;
  enrollmentSource?: string | null;
  enrolledAt?: string | null;
  reservation?: EnrolledWorkshopReservation | null;
  startDate?: string | null;
  endDate?: string | null;
  completedOn?: string | null;
  totalHours?: number | null;
  cmeCredits?: number | null;
  offersCmeCredits?: boolean | null;
  createdAt?: string;
  facility?: string | null;
  location?: string | null;
  webinarPlatform?: string | null;
  meetingLink?: string | null;
}

export interface EnrolledWorkshopsResponse {
  message: string;
  data: EnrolledWorkshopItem[];
}

export interface DashboardSummaryMetrics {
  cmeCredits: string;
  coursesCompleted: string;
  nextClass: string;
}

export interface DashboardEnrollmentCardItem {
  id: string;
  mode: "Live Workshop" | "Online Workshop";
  title: string;
  imageUrl: string | null;
  dateTime?: string;
  location?: string;
  room?: string;
  access?: string;
  ctaLabel: string;
  ctaHref: string;
  ctaIcon?: "syllabus" | "enter";
}

export interface DashboardRecentOrderCardItem {
  id: string;
  title: string;
  titleSuffix?: string;
  orderNo: string;
  date: string;
  amount: string;
  status: string;
  imageUrl: string | null;
  detailsHref: string;
}
