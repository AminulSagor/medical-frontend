import { Course } from "@/app/(user)/(not-register)/public/types/course.types";
import { IMAGE } from "@/constant/image-config";

export const UPCOMING_COURSES: Course[] = [
  {
    id: "basic-airway-skills",
    imageSrc: IMAGE.course_1,
    imageAlt: "Basic Airway Skills Course",
    mode: "In-Person",
    durationLabel: "2 Days",
    creditsLabel: "5.0 CME Credits",
    dateLabel: "Oct 12-13, 2024",
    title: "Basic Airway Skills Course",
    description:
      "Master advanced techniques for uncomplicated difficult airways in emergency settings.",
    price: 1250,
    detailsHref: "/courses/basic-airway-skills",
  },
  {
    id: "iv-ultrasound",
    imageSrc: IMAGE.course_2,
    imageAlt: "IV including ultrasound techniques",
    mode: "Online",
    durationLabel: "1 Days",
    creditsLabel: "5.0 CME Credits",
    dateLabel: "Nov 04, 2024",
    title: "Learning how to start an IV including ultrasound techniques",
    description:
      "Hands-on workshop focusing on fiberoptic scope manipulation and awake intubation protocols.",
    price: 895,
    detailsHref: "/courses/iv-ultrasound",
  },
  {
    id: "pals",
    imageSrc: IMAGE.course_3,
    imageAlt: "Pediatric Advanced Life Support",
    mode: "In-Person",
    durationLabel: "3 Days",
    creditsLabel: "5.0 CME Credits",
    dateLabel: "Dec 01-03, 2024",
    title: "Pediatric Advanced Life Support",
    description:
      "Comprehensive PALS certification and advanced pediatric airway scenarios.",
    price: 1450,
    detailsHref: "/courses/pals",
  },
];
