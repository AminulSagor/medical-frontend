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

export interface CreateWorkshopRequest {
  deliveryMode: WorkshopDeliveryMode;
  status: WorkshopStatus;
  title: string;
  shortBlurb?: string;
  coverImageUrl?: string;
  learningObjectives?: string;
  offersCmeCredits: boolean;
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

export interface UpdateWorkshopRequest {
  deliveryMode?: WorkshopDeliveryMode;
  status?: WorkshopStatus;
  title?: string;
  shortBlurb?: string;
  coverImageUrl?: string;
  learningObjectives?: string;
  offersCmeCredits?: boolean;
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
  segmentNumber: number;
  courseTopic: string;
  topicDetails: string | null;
  startTime: string;
  endTime: string;
}

export interface WorkshopDay {
  id: string;
  date: string;
  dayNumber: number;
  segments: WorkshopSegment[];
}

export interface GroupDiscount {
  id: string;
  minimumAttendees: number;
  groupRatePerPerson: string;
}

export interface WorkshopFaculty {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  medicalDesignation: string;
  institutionOrHospital: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ListWorkshopsParams {
  q?: string;
  facilityId?: string;
  facultyId?: string;
  deliveryMode?: WorkshopDeliveryMode;
  status?: WorkshopStatus;
  offersCmeCredits?: string;
  groupDiscountEnabled?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface ListWorkshopsResponse {
  items: Workshop[];
  total: number;
  page: number;
  limit: number;
}
