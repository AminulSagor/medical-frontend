export type DeliveryMethod = "in_person" | "online";
export type CreditsRange = "1_4" | "5_8" | "8_plus";

export type CourseBadge = {
  label: string; // e.g. "ON-DEMAND"
  tone: "dark" | "light";
};

export type CourseAction =
  | { kind: "reserve"; label: "Reserve Seat" }
  | { kind: "start"; label: "Start Learning" }
  | { kind: "waitlist"; label: "Join Waitlist" };

export type CourseCardModel = {
  id: string;
  title: string;
  description?: string;

  delivery: DeliveryMethod;
  badge?: CourseBadge;

  // left date pill (for in-person / scheduled)
  date?: { month: string; day: string }; // "MAR" "12"

  // top image (for on-demand)
  imageSrc?: string;
  imageAlt?: string;

  metaTop?: { icon: "clock" | "pin" | "modules"; label: string }[]; // "8 Hours", "Houston, TX", "12 Modules"
  metaBottom?: { icon: "cme"; label: string }[]; // "8.0 CME", "4.5 CME"

  // availability bar
  availability?: {
    label: string; // "AVAILABILITY" / "CAPACITY"
    note: string;  // "Only 3 seats left!" / "Sold Out - Join Waitlist"
    percent: number; // 0..100
    tone: "primary" | "danger";
  };

  price: number;
  oldPrice?: number;

  action: CourseAction;

  // for filtering
  cmeCredits: number; // numeric, we’ll map to ranges
  isAvailable: boolean;
};