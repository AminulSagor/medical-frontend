import { GraduationCap, Users, BriefcaseMedical, Newspaper } from "lucide-react";
import { IMAGE } from "@/constant/image-config";
import { FounderProfile, FounderStat } from "@/app/public/types/founder.types";

export const FOUNDER_STATS: FounderStat[] = [
  {
    id: "courses",
    Icon: GraduationCap,
    value: "",
    label: "Accredited Courses",
  },
  {
    id: "trained",
    Icon: Users,
    value: "",
    label: "Physicians Trained",
  },
  {
    id: "equipment",
    Icon: BriefcaseMedical,
    value: "",
    label: "Medical Equipment",
  },
  {
    id: "blogs",
    Icon: Newspaper,
    value: "",
    label: "Medical Blog Articles",
  },
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