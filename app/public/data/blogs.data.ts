import { IMAGE } from "@/constant/image-config";
import { BlogPost, BlogPromoCard, TrendingItem } from "@/types/blogs/blog-type";


export const BLOG_FEATURED: BlogPost = {
  id: "featured-trauma-haptics",
  category: "Editor's Pick",
  title: "Revolutionizing Trauma\nSimulation with\nHaptic Feedback",
  excerpt:
    "How new tactile technologies are transforming residency training for critical emergency procedures before patient contact.",
  dateLabel: "Oct 24, 2023",
  coverImageSrc: IMAGE.doctor,
  coverImageAlt: "Clinician in OR",
  href: "/public/blogs/featured-trauma-haptics",
  badge: { label: "EDITOR'S PICK" },
};

export const BLOG_LATEST: BlogPost[] = [
  {
    id: "pediatric-emergency-scenarios",
    category: "Pediatrics",
    title: "Pediatric Emergency\nScenarios: A\nComprehensive Case\nStudy",
    excerpt:
      "Analyzing the effectiveness of scenario-based learning in improving outcomes for pediatric resuscitation events in rural hospitals.",
    dateLabel: "Oct 22, 2023",
    readTimeLabel: "8 min read",
    coverImageSrc: IMAGE.child,
    coverImageAlt: "Pediatric illustration",
    author: { name: "Dr. Sarah Jenkins", avatarSrc: IMAGE.user },
    href: "/public/blogs/pediatric-emergency-scenarios",
  },
  {
    id: "vr-in-surgical-training",
    category: "Technology",
    title: "VR in Surgical Training",
    excerpt:
      "Exploring the efficacy of virtual reality in laparoscopic skill acquisition.",
    dateLabel: "Oct 22, 2023",
    coverImageSrc: IMAGE.course_3,
    coverImageAlt: "VR simulation",
    href: "/public/blogs/vr-in-surgical-training",
  },
  {
    id: "new-guidelines-acls-2024",
    category: "Cardiology",
    title: "New Guidelines for ACLS 2024",
    excerpt:
      "Key updates to the advanced cardiovascular life support algorithms.",
    dateLabel: "Oct 20, 2023",
    coverImageSrc: IMAGE.course_2,
    coverImageAlt: "Cardiology gradient",
    href: "/public/blogs/new-guidelines-acls-2024",
  },
  {
    id: "simulation-is-not-just-practice",
    category: "Interview",
    title: "\"Simulation is not just\npractice; it's patient\nsafety.\"",
    excerpt:
      "An exclusive conversation with Dr. Emily Chen, Director of Clinical Education, on the shifting paradigms of medical certification.",
    dateLabel: "Oct 18, 2023",
    coverImageSrc: IMAGE.founder,
    coverImageAlt: "Interview portrait",
    href: "/public/blogs/simulation-is-not-just-practice",
  },
];

export const BLOG_TRENDING: TrendingItem[] = [
  {
    id: "t1",
    title: "The Future of Haptics in\nRemote Surgery",
    readsLabel: "3.2k reads",
    href: "/public/blogs/the-future-of-haptics",
  },
  {
    id: "t2",
    title: "Nursing Sim Updates: Q4\n2023 Review",
    readsLabel: "2.8k reads",
    href: "/public/blogs/nursing-sim-updates-q4-2023",
  },
  {
    id: "t3",
    title: "Ethical Dilemmas in AI\nDiagnostics",
    readsLabel: "1.9k reads",
    href: "/public/blogs/ethical-dilemmas-ai-diagnostics",
  },
  {
    id: "t4",
    title: "Debriefing Techniques for Trauma Teams",
    readsLabel: "1.5k reads",
    href: "/public/blogs/debriefing-techniques-trauma-teams",
  },
];

export const BLOG_PROMO: BlogPromoCard = {
  pill: "UPCOMING COURSE",
  title: "Advanced Life\nSupport",
  subtitle: "Master the latest protocols in a high-fidelity environment.",
  dateLabel: "NOV 12-14",
  noteLabel: "LIMITED SEATS",
  ctaLabel: "Register Now",
  href: "/public/courses",
  backgroundImageSrc: IMAGE.course_details_cover,
  backgroundImageAlt: "Course promo background",
};