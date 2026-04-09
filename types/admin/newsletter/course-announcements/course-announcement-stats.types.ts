export type CourseAnnouncementStatsCards = {
  totalActiveStudents: {
    value: number;
  };
  scheduledBroadcasts: {
    pending: number;
  };
  averageCohortSize: {
    value: number;
  };
};

export type CourseAnnouncementStatsResponse = {
  cards: CourseAnnouncementStatsCards;
};