import {
  BroadcastCadenceTabKey,
  GeneralDataParentTabKey,
  PaginationState,
  WorkspaceFilterState,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import {
  GeneralBroadcastWorkspaceFrequencyType,
  GeneralBroadcastWorkspaceItem,
  GeneralBroadcastWorkspaceListResponse,
  GeneralBroadcastWorkspaceMeta,
  GetGeneralBroadcastWorkspaceListParams,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";

export const DEFAULT_WORKSPACE_FILTERS: WorkspaceFilterState = {
  contentTypes: [],
  author: null,
  audienceSegment: null,
  quickDateRange: null,
  fromDate: "",
  toDate: "",
};

export function buildWorkspaceListParams(
  parentTab: GeneralDataParentTabKey,
  cadenceTab: BroadcastCadenceTabKey,
  page: number,
  limit = 10,
): GetGeneralBroadcastWorkspaceListParams {
  if (parentTab === "queue") {
    return {
      tab: "queue",
      page,
      limit,
      sortBy: "scheduledDate",
      sortOrder: "ASC",
      status: "SCHEDULED",
      frequencyType: cadenceTab === "weekly" ? "WEEKLY" : "MONTHLY",
    };
  }

  if (parentTab === "drafts") {
    return {
      tab: "drafts",
      page,
      limit,
      sortBy: "scheduledDate",
      sortOrder: "ASC",
      status: "DRAFT",
    };
  }

  return {
    tab: "history",
    page,
    limit,
    sortBy: "sentDate",
    sortOrder: "DESC",
  };
}

export function buildPaginationState(
  meta: GeneralBroadcastWorkspaceMeta,
): PaginationState {
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  return {
    currentPage: meta.page,
    totalPages,
    totalItems: meta.total,
    limit: meta.limit,
    pages: buildPageList(meta.page, totalPages),
  };
}

function buildPageList(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export function getWorkspaceParentBadgeLabel(
  workspace: GeneralBroadcastWorkspaceListResponse | null,
  parentTab: GeneralDataParentTabKey,
): string {
  if (workspace?.viewFlags.activeBroadcastingView) {
    return "Active Broadcasting View";
  }

  if (workspace?.viewFlags.draftWorkspace) {
    return "Draft Workspace";
  }

  if (workspace?.viewFlags.archiveManagement) {
    return "Archive Management";
  }

  if (parentTab === "queue") return "Active Broadcasting View";
  if (parentTab === "drafts") return "Draft Workspace";
  return "Archive Management";
}

export function getToolbarTitle(
  parentTab: GeneralDataParentTabKey,
  cadenceTab: BroadcastCadenceTabKey,
): string {
  if (parentTab === "queue") {
    return `Current ${cadenceTab === "weekly" ? "Weekly" : "Monthly"} Broadcast Queue`;
  }

  if (parentTab === "drafts") {
    return "Newsletter Drafts";
  }

  return "Transmission History";
}

export function getToolbarSearchPlaceholder(
  parentTab: GeneralDataParentTabKey,
): string {
  if (parentTab === "queue") {
    return "Search by title, subject, audience, or type...";
  }

  if (parentTab === "drafts") {
    return "Search drafts by title, subject, or type...";
  }

  return "Search historical transmissions...";
}

export function getToolbarSortLabel(
  parentTab: GeneralDataParentTabKey,
): string {
  if (parentTab === "history") return "Sent Date";
  if (parentTab === "drafts") return "Scheduled Date";
  return "Schedule Date";
}

export function getWorkspaceRelevantDate(
  item: GeneralBroadcastWorkspaceItem,
  parentTab: GeneralDataParentTabKey,
): string | null {
  if (parentTab === "queue") return item.scheduledDate;
  if (parentTab === "drafts") return item.lastModified;
  return item.sentDate;
}

function extractTextValue(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    const candidates = [
      record.fullName,
      record.name,
      record.displayName,
      record.email,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return fallback;
}

export function filterWorkspaceItems(params: {
  items: GeneralBroadcastWorkspaceItem[];
  parentTab: GeneralDataParentTabKey;
  searchQuery: string;
  filters: WorkspaceFilterState;
}): GeneralBroadcastWorkspaceItem[] {
  const { items, parentTab, searchQuery, filters } = params;
  const normalizedSearch = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    const haystack = [
      item.articleTitle,
      item.subjectLine,
      item.type.displayLabel,
      item.type.code,
      item.target.displayLabel,
      formatAuthorName(item.author),
      item.status.displayLabel,
      item.frequency,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (normalizedSearch && !haystack.includes(normalizedSearch)) {
      return false;
    }

    if (
      filters.contentTypes.length > 0 &&
      !filters.contentTypes.includes(item.type.code)
    ) {
      return false;
    }

    if (filters.author && formatAuthorName(item.author) !== filters.author) {
      return false;
    }

    if (filters.audienceSegment) {
      const hasMatchingSegment =
        item.target.displayLabel === filters.audienceSegment ||
        item.target.segments.includes(filters.audienceSegment);

      if (!hasMatchingSegment) {
        return false;
      }
    }

    const relevantDate = getWorkspaceRelevantDate(item, parentTab);

    if (filters.quickDateRange && relevantDate) {
      const relevantTime = new Date(relevantDate).getTime();
      const now = Date.now();
      const diffDays = (now - relevantTime) / (1000 * 60 * 60 * 24);

      if (filters.quickDateRange === "LAST_7_DAYS" && diffDays > 7) {
        return false;
      }

      if (filters.quickDateRange === "LAST_30_DAYS" && diffDays > 30) {
        return false;
      }
    }

    if ((filters.fromDate || filters.toDate) && relevantDate) {
      const targetDate = new Date(relevantDate).getTime();

      if (filters.fromDate) {
        const fromTime = new Date(`${filters.fromDate}T00:00:00`).getTime();
        if (targetDate < fromTime) {
          return false;
        }
      }

      if (filters.toDate) {
        const toTime = new Date(`${filters.toDate}T23:59:59`).getTime();
        if (targetDate > toTime) {
          return false;
        }
      }
    }

    return true;
  });
}

export function formatDateLabel(value: string | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTimeLabel(value: string | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatAuthorName(value: unknown): string {
  return extractTextValue(value, "System");
}

export function formatAuthorInitials(value: unknown): string {
  const name = formatAuthorName(value);
  const parts = name.split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

export function formatFrequencyLabel(
  value: GeneralBroadcastWorkspaceFrequencyType | null,
): string {
  return value ? value.toLowerCase() : "—";
}

export function formatEstimatedReadMinutes(value: number | null): string {
  return value ? `${value} min` : "—";
}

export function getWorkspaceCountLabel(params: {
  total: number;
  visible: number;
  isFiltered: boolean;
}): string {
  const { total, visible, isFiltered } = params;
  const value = isFiltered ? visible : total;
  return `(${value} Items)`;
}

export function hasActiveClientFilters(
  searchQuery: string,
  filters: WorkspaceFilterState,
): boolean {
  return Boolean(
    searchQuery.trim() ||
    filters.contentTypes.length ||
    filters.author ||
    filters.audienceSegment ||
    filters.quickDateRange ||
    filters.fromDate ||
    filters.toDate,
  );
}
