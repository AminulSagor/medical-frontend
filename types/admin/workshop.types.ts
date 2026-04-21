export type WorkshopDeliveryMode = "in_person" | "online";
export type WorkshopStatus = "draft" | "published";

export interface WorkshopSegmentRequest {
  segmentNumber: number;
  courseTopic: string;
  topicDetails?: string;
  startTime: string;
  endTime: string;
}

export interface WorkshopDayRequest {
  date: string;
  dayNumber: number;
  segments: WorkshopSegmentRequest[];
}

export interface GroupDiscountRequest {
  minimumAttendees: number;
  groupRatePerPerson: string;
}

export interface ShortCreateWorkshopRequest {
  id?: string;
  deliveryMode: WorkshopDeliveryMode;
  title: string;
  offersCmeCredits: boolean;
  cmeCreditsCount?: string | null;
  facilityId: string;
  capacity: number;
  alertAt: number;
  registrationDeadline: string;
}

export interface FullCreateWorkshopRequest {
  id?: string;
  deliveryMode: WorkshopDeliveryMode;
  status: WorkshopStatus;
  title: string;
  shortBlurb?: string;
  coverImageUrl?: string;
  learningObjectives?: string;
  offersCmeCredits: boolean;
  cmeCreditsCount?: string | null;
  registrationDeadline: string;
  facilityIds: string[];
  webinarPlatform?: string | null;
  meetingLink?: string | null;
  meetingPassword?: string | null;
  autoRecordSession?: boolean;
  capacity: number;
  alertAt: number;
  standardBaseRate: string;
  groupDiscountEnabled: boolean;
  groupDiscounts: GroupDiscountRequest[];
  facultyIds: string[];
  days: WorkshopDayRequest[];
}

export type CreateWorkshopRequest =
  | ShortCreateWorkshopRequest
  | FullCreateWorkshopRequest;

export interface UpdateWorkshopRequest {
  id?: string;
  deliveryMode?: WorkshopDeliveryMode;
  status?: WorkshopStatus;
  title?: string;
  shortBlurb?: string;
  coverImageUrl?: string;
  learningObjectives?: string;
  offersCmeCredits?: boolean;
  cmeCreditsCount?: string | null;
  registrationDeadline?: string;
  facilityIds?: string[];
  webinarPlatform?: string | null;
  meetingLink?: string | null;
  meetingPassword?: string | null;
  autoRecordSession?: boolean;
  capacity?: number;
  alertAt?: number;
  standardBaseRate?: string;
  groupDiscountEnabled?: boolean;
  groupDiscounts?: GroupDiscountRequest[];
  facultyIds?: string[];
  days?: WorkshopDayRequest[];
}

export interface WorkshopSegment {
  id: string;
  dayId?: string;
  segmentNumber: number;
  courseTopic: string;
  topicDetails: string | null;
  startTime: string;
  endTime: string;
}

export interface WorkshopDay {
  id: string;
  workshopId?: string;
  date: string;
  dayNumber: number;
  segments: WorkshopSegment[];
}

export interface GroupDiscount {
  id: string;
  workshopId?: string;
  minimumAttendees: number;
  groupRatePerPerson: string;
}


export interface WorkshopOverview {
  totalEnrolled: number;
  refundRequested: number;
  partialRefund: number;
  refunded: number;
}

export interface WorkshopFaculty {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  imageUrl: string;
  medicalDesignation: string;
  institutionOrHospital: string;
  primaryClinicalRole?: string;
  assignedRole?: string;
  npiNumber?: string;
  phoneNumber?: string;
}

export interface WorkshopFacility {
  id: string;
  name: string;
  roomNumber: string | null;
  physicalAddress: string | null;
  capacity: number;
  notes: string | null;
}

export interface Workshop {
  id: string;
  title: string;
  shortBlurb: string | null;
  deliveryMode: WorkshopDeliveryMode;
  status: WorkshopStatus;
  coverImageUrl: string | null;
  learningObjectives: string | null;
  offersCmeCredits: boolean;
  cmeCreditsCount?: string | null;
  registrationDeadline?: string | null;
  facilityIds: string[];
  webinarPlatform: string | null;
  meetingLink: string | null;
  meetingPassword: string | null;
  autoRecordSession: boolean;
  capacity: number;
  alertAt: number;
  standardBaseRate: string;
  groupDiscountEnabled: boolean;
  days: WorkshopDay[];
  groupDiscounts: GroupDiscount[];
  faculty: WorkshopFaculty[];
  facilities: WorkshopFacility[];
  overview?: WorkshopOverview;
  revenueGenerated?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopListItem {
  id: string;
  title: string;
  shortBlurb: string | null;
  deliveryMode: WorkshopDeliveryMode;
  status: WorkshopStatus;
  coverImageUrl: string | null;
  learningObjectives: string | null;
  offersCmeCredits: boolean;
  cmeCreditsCount?: string | null;
  registrationDeadline?: string | null;
  facilityIds: string[];
  webinarPlatform: string | null;
  meetingLink: string | null;
  meetingPassword: string | null;
  autoRecordSession: boolean;
  capacity: number;
  alertAt: number;
  standardBaseRate: string;
  groupDiscountEnabled: boolean;
  days: WorkshopDay[];
  groupDiscounts: GroupDiscount[];
  faculty: WorkshopFaculty[];
  facilities: WorkshopFacility[];
  overview?: WorkshopOverview;
  revenueGenerated?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListWorkshopsParams {
  q?: string;
  deliveryMode?: WorkshopDeliveryMode;
  status?: WorkshopStatus;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "title";
  sortOrder?: "asc" | "desc";
  upcoming?: boolean;
  past?: boolean;
  hasRefundRequests?: boolean;
}

export interface ListWorkshopsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListWorkshopsResponse {
  message?: string;
  meta: ListWorkshopsMeta;
  data: WorkshopListItem[];
}

export interface LegacyListWorkshopsData {
  workshops: WorkshopListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface LegacyListWorkshopsResponse {
  message?: string;
  statusCode?: number;
  data: LegacyListWorkshopsData;
}

export interface AdvancedListWorkshopsResponse {
  message?: string;
  meta: ListWorkshopsMeta;
  data: WorkshopListItem[];
}

export type RawListWorkshopsResponse =
  | LegacyListWorkshopsResponse
  | AdvancedListWorkshopsResponse;

export interface WorkshopEnrolleeMember {
  attendeeId: string;
  fullName: string;
  email: string;
  institutionOrHospital: string | null;
  status: string;
  refundedAmount: string | null;
}

export interface WorkshopEnrolleeStudentInfo {
  fullName: string;
  email: string;
  phoneNumber: string | null;
}

export interface WorkshopEnrolleeItem {
  reservationId: string;
  refundRequestId: string | null;
  bookingType: string;
  groupSize: number;
  activeMemberCount: number;
  requestedMemberCount: number;
  refundedMemberCount: number;
  refundRequestStatus: boolean;
  showRefundActionButton: boolean;
  studentInfo: WorkshopEnrolleeStudentInfo;
  institutionOrHospital: string | null;
  registeredAt: string;
  paymentAmount: string;
  status: string;
  paymentGateway: string | null;
  transactionId: string | null;
  members: WorkshopEnrolleeMember[];
  requestedMembers: WorkshopEnrolleeMember[];
  refundedMembers: WorkshopEnrolleeMember[];
}

export interface WorkshopEnrolleesOverview {
  totalEnrolled: number;
  refundRequested: number;
  partialRefund: number;
  refunded: number;
}

export interface WorkshopEnrolleesWorkshop {
  id: string;
  title: string;
  registrationDeadline?: string;
}

export interface WorkshopEnrolleesData {
  workshop: WorkshopEnrolleesWorkshop;
  overview: WorkshopEnrolleesOverview;
  items: WorkshopEnrolleeItem[];
}

export interface WorkshopEnrolleesResponse {
  message?: string;
  data: WorkshopEnrolleesData;
  meta: ListWorkshopsMeta;
}

export interface ListWorkshopEnrolleesParams {
  page?: number;
  limit?: number;
  search?: string;
  enrollmentStatus?: "BOOKED" | "REFUND_REQUESTED" | "PARTIAL_REFUNDED" | "REFUNDED";
}

export interface RefundPreviewBookingOwner {
  fullName: string;
}

export interface RefundPreviewMember {
  attendeeId: string;
  fullName: string;
  email: string;
  refundAmount: string;
  status: string;
  isSelectable: boolean;
  isRequested: boolean;
}

export interface RefundPreviewSummary {
  selectedCount: number;
  calculatedRefundAmount: string;
}

export interface WorkshopRefundPreviewData {
  reservationId: string;
  workshopId: string;
  requestId?: string | null;
  bookingOwner: RefundPreviewBookingOwner;
  bookingType?: string;
  groupSize: number;
  activeGroupSize?: number;
  totalPaid: string;
  paymentGateway: string | null;
  transactionId: string | null;
  refundRequestStatus?: boolean;
  requestedMembers: RefundPreviewMember[];
  members: RefundPreviewMember[];
  summary: RefundPreviewSummary;
}

export interface WorkshopRefundPreviewResponse {
  message?: string;
  data: WorkshopRefundPreviewData;
}

export interface ConfirmWorkshopRefundRequest {
  reservationId: string;
  attendeeIds: string[];
  refundAmount: string;
  adjustmentNote: string;
  paymentGateway: string;
  transactionId: string;
}

export interface ConfirmWorkshopRefundResponse {
  message?: string;
  data?: {
    refundId?: string;
    requestId?: string;
    workshopId?: string;
    reservationId?: string;
    bookingType?: string;
    bookingOwnerName?: string;
    originalGroupSize?: number;
    processedMemberCount?: number;
    remainingEnrolledCount?: number;
    refundedAmount?: string;
    refundType?: string;
    enrollmentStatus?: string;
    refundRequestStatus?: boolean;
    reservationLifecycleStatus?: string;
    paymentGateway?: string | null;
    transactionId?: string | null;
    emailNotificationSent?: boolean;
    processedAt?: string;
  };
}

export interface DeleteWorkshopResponse {
  message?: string;
  data: {
    workshopId: string;
    title: string;
  };
}


export interface WorkshopStatsNextWorkshop {
  daysRemaining: number;
  targetDate: string;
  label: string;
}

export interface WorkshopStatsActiveSeats {
  open: number;
  filled: number;
  totalCapacity: number;
}

export interface WorkshopStatsRefundRequests {
  pendingReview: number;
}

export interface WorkshopStatsData {
  nextWorkshop: WorkshopStatsNextWorkshop | null;
  activeSeats: WorkshopStatsActiveSeats;
  refundRequests: WorkshopStatsRefundRequests;
}

export interface WorkshopStatsResponse {
  message?: string;
  data: WorkshopStatsData;
}
