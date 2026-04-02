import type { LucideIcon } from "lucide-react";

export type FounderStat = {
  id: string;
  Icon: LucideIcon;
  value: string; // "120+"
  label: string; // "Accredited Courses"
};

export type FounderProfile = {
  heading: {
    lead: string; // "Bridging the gap"
    emphasizeMuted: string; // "theory and"
    emphasizePrimary: string; // "muscle memory."
  };
  bioLines: string[];
  name: string;
  titleLine: string; // "Founder, Texas Airway Institute"
  orgRightText: string; // "Texas Airway Inst."
  imageSrc: string;
  imageAlt: string;
};