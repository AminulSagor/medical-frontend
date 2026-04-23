export type CourseDetailInfoKey = "location" | "dates" | "time";

export type CourseDetailInfoItem = {
  key: CourseDetailInfoKey;
  title: string;
  lines: string[];
};

export type CoursePricingFeature = {
  id: string;
  label: string;
};

export type CourseGroupSave = {
  title: string;
  oldPrice: number;
  newPrice: number;
  discountLabel: string;
  note: string;
};

export type CoursePricing = {
  feeLabel: string;
  price: number;
  perLabel: string;
  features: CoursePricingFeature[];
  groupSave: CourseGroupSave;
  ctaLabel: string;
  ctaDisabled?: boolean;
  ctaTone?: "primary" | "muted";
  warningLabel: string;
  warningTone?: "danger" | "default";
  footnote: string;
};

export type CourseScheduleItem = {
  id: string;
  at: string; // "08:30 AM"
  title: string;
  description: string;
};

export type CourseItineraryDay = {
  dayNumber: number;
  dayPill: string; // "DAY ONE"
  dateLabel: string; // "TUESDAY, MARCH 12"
  trackLabel: string; // "FOUNDATION & THEORY"
  title: string;
  description: string;
  expanded?: boolean;
  schedule?: CourseScheduleItem[];
};

export type CourseInstructor = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarSrc?: string | null;
  avatarAlt: string;
};

export type CourseDetails = {
  id: string;

  hero: {
    title: string;
    badges: { label: string; tone?: "primary" | "muted" }[];
    backgroundSrc?: string | null;
    backgroundAlt?: string;
  };

  about: {
    title: string;
    description: string;
    learningObjectives?: string[];
  };

  info: CourseDetailInfoItem[];

  pricing: CoursePricing;

  itinerary: {
    title: string;
    days: CourseItineraryDay[];
  };

  instructors: {
    title: string;
    list: CourseInstructor[];
  };

  trustedBy: {
    label: string;
    brands: string[];
  };
};