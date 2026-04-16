export type PublicWorkshopDeliveryMode = "in_person" | "online";

export interface PublicWorkshopFacility {
  id: string;
  name: string;
  roomNumber: string;
  physicalAddress: string;
  capacity: number;
  notes: string;
}

export interface PublicWorkshopFaculty {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  primaryClinicalRole?: string;
  medicalDesignation?: string;
  institutionOrHospital?: string;
  assignedRole?: string;
  title?: string;
  imageUrl?: string | null;
  profileImageUrl?: string | null;
  npiNumber?: string;
}

export interface PublicWorkshop {
  id: string;
  date: string;
  title: string;
  description: string;
  deliveryMode: PublicWorkshopDeliveryMode;
  workshopPhoto: string | null;
  totalHours: string;
  cmeCredits?: boolean;
  cmeCreditsCount?: number;
  cmeFredits?: boolean;
  availableSeats: number;
  totalCapacity: number;
  isFullyBooked?: boolean;
  isUpcoming?: boolean;
  price: string;
  offerPrice: string | null;
  totalModules: number;
  topics?: string[];
  learningObjectives: string;
  groupDiscountEnabled: boolean;
  facility?: string;
  facilityIds?: string[];
  facilities?: PublicWorkshopFacility[];
  faculty: PublicWorkshopFaculty[];
  webinarPlatform: string | null;
}

export interface FeaturedPublicWorkshop {
  id: string;
  title: string;
  shortBlurb: string;
  courseType: PublicWorkshopDeliveryMode;
  coverImageUrl: string | null;
  dateRange: string;
  location: string;
  cmeCredits: number;
  offersCmeCredits: boolean;
  isFeatured: boolean;
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

export interface FeaturedPublicWorkshopResponse {
  message: string;
  data: FeaturedPublicWorkshop;
}

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
  facilities?: PublicWorkshopFacility[];
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
