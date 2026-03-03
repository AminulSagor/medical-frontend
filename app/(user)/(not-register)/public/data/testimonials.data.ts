import { Testimonial } from "@/app/(user)/(not-register)/public/types/testimonial.types";
import { IMAGE } from "@/constant/image-config";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "emily-rivera",
    rating: 5,
    quote:
      "The simulation scenarios are incredibly realistic. The pressure they induce is exactly what we face in the ER. Invaluable training.",
    author: {
      name: "Dr. Emily Rivera",
      role: "ER Physician",
      avatarSrc: IMAGE.user,
    },
  },
  {
    id: "marcus-chen",
    rating: 5,
    quote:
      "I've taken many airway courses, but this is the first one that focused on the psychology of crisis management alongside the technical skills.",
    author: {
      name: "Dr. Marcus Chen",
      role: "Anesthesiologist",
    },
  },
  {
    id: "sarah-thompson",
    rating: 5,
    quote:
      "Excellent instructors who are leaders in the field. The equipment in the 'Shop The Lab' section is also top-tier for our own clinic.",
    author: {
      name: "Dr. Sarah Thompson",
      role: "Chief Resident",
    },
  },
];
