import { CourseCardModel } from "@/app/public/types/course-browse.types";
import { IMAGE } from "@/constant/image-config";

export const COURSE_BROWSE_LIST: CourseCardModel[] = [
  {
    id: "difficult-airway",
    title: "Difficult Airway Management",
    delivery: "online",
    date: { month: "MAR", day: "12" },
    metaTop: [
      { icon: "clock", label: "8 Hours" },
      { icon: "pin", label: "Houston, TX" },
    ],
    metaBottom: [{ icon: "cme", label: "8.0 CME" }],
    availability: {
      label: "AVAILABILITY",
      note: "Only 3 seats left!",
      percent: 72,
      tone: "primary",
    },
    price: 450,
    action: { kind: "reserve", label: "Reserve Seat" },
    cmeCredits: 8.0,
    isAvailable: true,
  },
  {
    id: "online-ultrasound",
    title: "Online Ultrasound Basics",
    description:
      "Master the fundamentals of point-of-care ultrasound with high-yiel...",
    delivery: "online",
    badge: { label: "ON-DEMAND", tone: "dark" },
    imageSrc: IMAGE.course_3,
    imageAlt: "Ultrasound course",
    metaTop: [{ icon: "modules", label: "12 Modules" }],
    metaBottom: [{ icon: "cme", label: "4.5 CME" }],
    price: 199,
    oldPrice: 299,
    action: { kind: "start", label: "Start Learning" },
    cmeCredits: 4.5,
    isAvailable: true,
  },
  {
    id: "advanced-airway",
    title: "Advanced Airway Techniques",
    delivery: "in_person",
    date: { month: "APR", day: "05" },
    metaTop: [
      { icon: "clock", label: "16 Hours" },
      { icon: "pin", label: "Chicago, IL" },
    ],
    metaBottom: [{ icon: "cme", label: "16.0 CME" }],
    availability: {
      label: "CAPACITY",
      note: "Sold Out - Join Waitlist",
      percent: 92,
      tone: "danger",
    },
    price: 850,
    action: { kind: "waitlist", label: "Join Waitlist" },
    cmeCredits: 16.0,
    isAvailable: false,
  },
];
