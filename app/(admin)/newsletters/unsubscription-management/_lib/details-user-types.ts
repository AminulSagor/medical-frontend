export type ClinicalActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  isActive?: boolean; // first one green dot
};

export type UnsubscriptionDetails = {
  id: string;

  subscriberName: string;
  subscriberEmail: string;

  roleTag?: string; // "CHIEF ANESTHESIOLOGIST"

  avatarMode?: "logo" | "initials";
  initials?: string;

  requestInfo: {
    dateLabel: string;
    sourceLabel: string;
    feedback: string;
  };

  clinicalActivityHistory: ClinicalActivityItem[];
};