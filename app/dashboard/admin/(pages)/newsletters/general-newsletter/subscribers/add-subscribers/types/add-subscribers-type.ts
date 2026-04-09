export type AddSubscriberSelectData = {
  clinicalRoles: string[];
  designations: string[];
  sources: string[];
  recommendedTags: string[];
};

export type AddSubscriberInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  clinicalRole: string;
  medicalDesignation: string;
  primaryInstitution: string;

  source: string;
  audienceTags: string[];
  initialStatus: "subscribed" | "unsubscribed";
};