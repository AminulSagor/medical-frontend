export type DistributionChannel = "email_blast" | "newsletter" | "trainees";

export type ShareStep =
  | "pick"
  | "email_blast"
  | "newsletter"
  | "cohorts"
  | "newsletter_added";

export type CohortTone = "cyan" | "purple" | "blue";

export type CohortItem = {
  id: string;
  name: string;
  date: string;
  students: number;
  tone: CohortTone;
};
