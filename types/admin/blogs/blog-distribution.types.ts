export type BlogDistributionChannel =
  | "email_blast"
  | "newsletter"
  | "trainees";

export type BlogNewsletterFrequencyType = "WEEKLY" | "MONTHLY";

export interface BlogDistributionArticleSnapshot {
  title: string;
  subjectLinePreview: string;
}

export interface BlogBlastDetails {
  targetAudience: string;
  totalRecipients: number;
}

export interface BlogNewsletterQueueInfo {
  nextDate: string;
  articlesInQueue: number;
}

export interface BlogNewsletterQueueDetails {
  weekly: BlogNewsletterQueueInfo;
  monthly: BlogNewsletterQueueInfo;
}

export interface BlogCourseCohort {
  id: string;
  name: string;
  date: string;
  students: number;
}

export interface GetBlogDistributionOptionsResponse {
  articleSnapshot: BlogDistributionArticleSnapshot;
  blastDetails: BlogBlastDetails;
  newsletterQueueDetails: BlogNewsletterQueueDetails;
  courseCohorts: BlogCourseCohort[];
}

export interface DistributeBlogBlastPayload {
  sendAdminCopy: boolean;
}

export interface DistributeBlogNewsletterPayload {
  frequencyType: BlogNewsletterFrequencyType;
}

export interface DistributeBlogCohortsPayload {
  cohortIds: string[];
}

export interface BlogDistributionActionResponse {
  message: string;
}