export type BlogBadge = {
  label: string; // e.g. "EDITOR'S PICK"
};

export type BlogAuthor = {
  name: string;
  avatarSrc?: string; // optional
};

export type BlogPost = {
  id: string;
  category: string; // keep flexible for API
  title: string;
  excerpt: string;
  dateLabel: string; // "Oct 24, 2023"
  readTimeLabel?: string; // "8 min read"
  coverImageSrc: string;
  coverImageAlt: string;
  author?: BlogAuthor;
  href: string;
  badge?: BlogBadge;
};

export type TrendingItem = {
  id: string;
  title: string;
  readsLabel: string; // "3.2k reads"
  href: string;
};

export type BlogPromoCard = {
  pill: string; // e.g. "UPCOMING COURSE"
  title: string;
  subtitle: string;
  dateLabel: string; // "NOV 12-14"
  noteLabel: string; // "LIMITED SEATS"
  ctaLabel: string; // "Register Now"
  href: string;
  backgroundImageSrc: string;
  backgroundImageAlt: string;
};