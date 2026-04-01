export type AdminUserRow = {
  type: "student" | "faculty" | string;
  id: string;
  name: string;
  email: string;
  role: string;
  credential: string | null;
  status: "active" | "inactive" | string;
  coursesCount: number | null;
  joinedAt: string;
};

export type AdminUsersResponse = {
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  tabSelected?: string;
  tabsCount?: Record<string, number>;
  data: AdminUserRow[];
};