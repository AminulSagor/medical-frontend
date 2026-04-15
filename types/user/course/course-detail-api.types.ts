export type CourseDetailDeliveryMode = "online" | "in_person";

export interface CourseDetailFacultyItem {
  id: string;
  firstName: string;
  lastName: string;
  primaryClinicalRole: string;
  medicalDesignation: string;
  institutionOrHospital: string;
  npiNumber: string;
  assignedRole: string;
  imageUrl: string | null;
}

export interface CourseDetailFacilityItem {
  id: string;
  name: string;
  roomNumber: string | null;
  physicalAddress: string | null;
  capacity: number | null;
  notes: string | null;
}

export interface CourseDetailSegment {
  id: string;
  segmentNumber: number;
  courseTopic: string;
  topicDetails: string;
  startTime: string;
  endTime: string;
}

export interface CourseDetailDay {
  id: string;
  date: string;
  dayNumber: number;
  segments: CourseDetailSegment[];
}

export interface CourseDetailResponse {
  courseId: string;
  workshop: {
    id: string;
    title: string;
    shortBlurb: string | null;
    deliveryMode: CourseDetailDeliveryMode;
    status: string;
    coverImageUrl: string | null;
    learningObjectives: string | null;
    offersCmeCredits: boolean;
    facilityIds: string[];
    facilities?: CourseDetailFacilityItem[] | null;
    webinarPlatform: string | null;
    meetingLink: string | null;
    meetingPassword: string | null;
    autoRecordSession: boolean;
    capacity: number | null;
    alertAt: number | null;
    standardBaseRate: string | null;
    groupDiscountEnabled: boolean;
    groupDiscounts: Array<{
      id: string;
      minimumAttendees: number;
      groupRatePerPerson: string;
    }>;
    faculty: CourseDetailFacultyItem[];
    days: CourseDetailDay[];
    createdAt: string;
    updatedAt: string;
  };
  heroImage: string | null;
  breadcrumb: string[];
  banner: {
    badgePrimary: string;
    badgeSecondary: string;
    title: string;
    description: string;
    dateBox: {
      dateRange: string;
      locationOrPlatform: string;
      time: string;
    };
  };
  bookingDetails: {
    status: string;
    totalPayment: string;
    paymentBadge: string;
    refundNote: string;
  };
  progress: {
    status: string;
    statusLabel: string;
    totalDays: number;
    completedDays: number;
    remainingDays: number;
    startedAt: string | null;
    completedAt: string | null;
  };
  scheduleHeader: {
    title: string;
    badge: string;
  };
  schedule: Array<{
    title: string;
    date: string;
    status: string;
    sessions: Array<{
      id: string;
      timeLabel: string;
      title: string;
      description: string;
      isCompleted: boolean;
      isCurrent: boolean;
      joinLink: string | null;
    }>;
  }>;
  sidebar: {
    certificateBox: {
      title: string;
      message: string;
      certId: string;
      downloadUrl: string;
      ticketId?: string | null;
    } | null;
    onlineDetails: {
      title?: string | null;
      message?: string | null;
    } | null;
    inPersonDetails: {
      ticketId: string;
      qrNote: string;
      qrDataUrl: string;
      downloadPdfUrl: string;
      ticketReference: string;
    } | null;
  };
}

export interface CourseRefundInfoResponse {
  isEligible: boolean;
  daysBeforeStart?: number;
  hoursBeforeStart?: number;
  policy: {
    fullRefundDays?: number;
    partialRefundDaysMin?: number;
    partialRefundDaysMax?: number;
    partialRefundPercentage?: number;
    deadlineHours?: number;
    processingFee?: number;
  };
  courseDetails: {
    title: string;
    startDate?: string;
    dateRange?: string;
    bookedFor?: string;
    refundWindowRemaining?: string;
  };
  financials: {
    amountPaid: string;
    processingFee?: string;
    estimatedRefund: string;
    currency: string;
  };
  uiMessages: {
    title: string;
    description?: string;
    policyWarning?: string;
  };
}

export interface CourseRefundSubmitRequest {
  refundAmount: number;
  reason: string;
  confirmedTerms: boolean;
}

export interface CourseRefundSubmitResponse {
  success: boolean;
  title: string;
  message: string;
  refundAmountRequested: string;
  reasonRecorded: string;
}

export interface CourseCalendarLinksResponse {
  title: string;
  description: string;
  links: {
    google: string;
    outlook: string;
    yahoo: string;
    appleOrIcs: string;
  };
}

export interface CourseMeetingInfoResponse {
  title: string;
  description: string;
  courseStatus: string;
  courseStatusLabel: string;
  startedAt: string | null;
  meetingDetails: {
    platform: string;
    meetingLink: string;
    meetingId: string;
    passcode: string;
  };
  actions: {
    cancel: string;
    join: string;
  };
}

export interface TicketQrCodeResponse {
  message: string;
  data: {
    qrCodeUrl: string;
  };
}

export interface TicketDetailsApiResponse {
  message: string;
  data: {
    attendee: {
      name: string;
      department: string;
      roleInfo: string;
      isVerified: boolean;
      avatarUrl: string | null;
    };
    groupAttendees: Array<{
      id: string;
      name: string;
      role: string;
      status: string;
    }>;
    course: {
      title: string;
      dateRange: string;
      progressBadge: string;
    };
    bookingInfo: {
      groupSize: string;
      paymentStatus: string;
      bookingRef: string;
      waitlistStatus: string;
    };
    venueLogistics: {
      currentLocation: string;
      facilities?: Array<{
        id: string;
        name: string;
        roomNumber: string | null;
        physicalAddress: string | null;
        capacity: number | null;
        notes: string | null;
      }>;
      assignedEquipment: string[];
    };
  };
}
