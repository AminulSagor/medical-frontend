import { GraduationCap, Users, MonitorPlay, Star } from "lucide-react";
import { IMAGE } from "@/constant/image-config";
import { FounderProfile, FounderStat } from "@/app/public/types/founder.types";

export const FOUNDER_STATS: FounderStat[] = [
  {
    id: "courses",
    Icon: GraduationCap,
    value: "120+",
    label: "Accredited Courses",
  },
  { id: "trained", Icon: Users, value: "5k+", label: "Physicians Trained" },
  { id: "vr", Icon: MonitorPlay, value: "50+", label: "VR Simulations" },
  { id: "rating", Icon: Star, value: "4.9", label: "Average Rating" },
];

export const FOUNDER_PROFILE: FounderProfile = {
  heading: {
    lead: "Bridging the gap",
    emphasizeMuted: "between theory and",
    emphasizePrimary: "muscle memory.",
  },
  bioLines: [
    "Board-Certified Physician & Anesthesiologist",
    "Founder, Texas Airway Institute",
    "20+ years of real clinical experience",
  ],
  name: "Dr. Victor Enoh, MD",
  titleLine: "Founder, Texas Airway Institute",
  orgRightText: "Texas Airway Inst.",
  imageSrc: IMAGE.founder,
  imageAlt: "Founder",
};
