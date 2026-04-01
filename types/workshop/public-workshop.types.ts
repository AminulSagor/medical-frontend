export type PublicWorkshopDeliveryMode = "in_person" | "online";

export interface PublicWorkshopFaculty {
  id: string;
  name: string;
  title: string;
  profileImageUrl: string | null;
}

export interface PublicWorkshop {
  id: string;
  date: string;
  title: string;
  description: string;
  facility: string;
  deliveryMode: PublicWorkshopDeliveryMode;
  workshopPhoto: string | null;
  totalHours: string;
  cmeFredits: boolean;
  availableSeats: number;
  totalCapacity: number;
  price: string;
  offerPrice: string | null;
  totalModules: number;
  learningObjectives: string;
  groupDiscountEnabled: boolean;
  faculty: PublicWorkshopFaculty[];
  webinarPlatform: string | null;
}

export interface PublicWorkshopMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PublicWorkshopsResponse {
  message: string;
  meta: PublicWorkshopMeta;
  data: PublicWorkshop[];
}

// Workshop Details Types
export interface PublicWorkshopDetailsFaculty {
  id: string;
  name: string;
  title: string;
  bio: string;
  profileImageUrl: string | null;
  specialties: string;
}

export interface PublicWorkshopSegment {
  segmentNumber: number;
  courseTopic: string;
  topicDetails: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  durationHours: string;
}

export interface PublicWorkshopDay {
  dayNumber: number;
  date: string;
  totalDayHours: string;
  segments: PublicWorkshopSegment[];
}

export interface PublicWorkshopGroupDiscount {
  minimumAttendees: number;
  pricePerPerson: string;
  savingsPerPerson: string;
}

export interface PublicWorkshopDetails {
  id: string;
  title: string;
  description: string;
  learningObjectives: string;
  deliveryMode: PublicWorkshopDeliveryMode;
  status: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  facility: string;
  facilityIds: string[];
  webinarPlatform: string | null;
  meetingLink: string | null;
  autoRecordSession: boolean;
  workshopPhoto: string | null;
  totalHours: string;
  totalMinutes: number;
  offersCmeCredits: boolean;
  totalCapacity: number;
  reservedSeats: number;
  availableSeats: number;
  alertAt: number;
  standardPrice: string;
  offerPrice: string | null;
  groupDiscountEnabled: boolean;
  groupDiscounts: PublicWorkshopGroupDiscount[];
  totalModules: number;
  days: PublicWorkshopDay[];
  faculty: PublicWorkshopDetailsFaculty[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicWorkshopDetailsResponse {
  message: string;
  data: PublicWorkshopDetails;
}
