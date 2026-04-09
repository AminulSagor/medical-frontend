export interface AdminUserItem {
  type: string;
  id: string;
  name: string;
  email: string;
  role: string;
  credential: string | null;
  status: string;
  coursesCount: number | null;
  joinedAt: string;
}

export interface AdminUsersResponse {
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  tabSelected: string;
  tabsCount: {
    all: number;
    students: number;
    faculty: number;
  };
  data: AdminUserItem[];
}