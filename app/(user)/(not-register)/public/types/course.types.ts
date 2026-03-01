export type CourseMode = "In-Person" | "Online";

export type CourseTag = {
  label: string; // e.g. "In-Person"
  tone?: "dark" | "light"; // for badge style
};

export type Course = {
  id: string;
  imageSrc: string; // from IMAGE config or public path
  imageAlt: string;

  mode: CourseMode; // "In-Person" | "Online"
  durationLabel: string; // "2 Days", "1 Days", "3 Days"
  creditsLabel: string; // "5.0 CME Credits"

  dateLabel: string; // "Oct 12-13, 2024"
  title: string;
  description: string;

  price: number; // 1250
  detailsHref: string; // "/courses/basic-airway-skills"
};
