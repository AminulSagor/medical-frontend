export type CohortInfo = {
  id: string;
  titleUpper: string;
  scheduledDateLabel: string;
  systemReady: boolean;
};

export type Recipient = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials?: string;
};

export type PriorityKey = "general" | "material" | "urgent";

export type ComposeBroadcastServerData = {
  cohort: CohortInfo;
  recipients: Recipient[];
};