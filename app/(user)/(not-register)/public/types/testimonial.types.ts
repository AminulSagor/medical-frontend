export type TestimonialAuthor = {
  name: string;
  role: string;
  avatarSrc?: string;
};

export type Testimonial = {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  author: TestimonialAuthor;
};
