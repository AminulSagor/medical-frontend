export type NotificationTabKey = "all" | "unread" | "critical" | "system";

export interface NotificationSummaryItem {
    count: number;
    label: string;
}

export interface NotificationSummary {
    totalNotifications: NotificationSummaryItem;
    unreadAlerts: NotificationSummaryItem;
    refundRequests: NotificationSummaryItem;
    systemUpdates: NotificationSummaryItem;
}

export interface NotificationTab {
    key: NotificationTabKey;
    label: string;
    count: number;
    isActive: boolean;
}

export interface NotificationCategoryOption {
    label: string;
    value: string;
    selected: boolean;
}

export interface NotificationPriorityOption {
    label: string;
    value: string;
    selected: boolean;
}

export interface NotificationFilterOptions {
    dateFrom: string | null;
    dateTo: string | null;
    categoryOptions: NotificationCategoryOption[];
    status: string;
    statusOptions: string[];
    priorityOptions: NotificationPriorityOption[];
    canReset: boolean;
    canApply: boolean;
}

export interface NotificationPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    from: number;
    to: number;
    hasPrev: boolean;
    hasNext: boolean;
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    createdAt?: string;
    time?: string;
    type?: string;
    isRead?: boolean;
}

export interface GetNotificationsResponse {
    title: string;
    subtitle: string;
    canMarkAllRead: boolean;
    settingsRoute: string;
    summary: NotificationSummary;
    tabs: NotificationTab[];
    searchQuery: string;
    filterCount: number;
    hasActiveFilters: boolean;
    filterOptions: NotificationFilterOptions;
    notifications: NotificationItem[];
    pagination: NotificationPagination;
}

export interface GetNotificationsParams {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
}

export type DropdownNotificationType = "urgent" | "course" | "order" | "system";

export interface DropdownNotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    type: DropdownNotificationType;
    avatarUrl?: string;
}

export interface GetDropdownNotificationsResponse {
    title: string;
    unreadCount: number;
    viewAllRoute: string;
    recentNotifications: DropdownNotificationItem[];
}

export interface MarkAllNotificationsReadResponse {
    success: boolean;
}

export interface NotificationPreferenceItem {
    id: string;
    key: string;
    sectionKey: string;
    title: string;
    description: string;
    inAppEnabled: boolean;
    emailEnabled: boolean;
    supportsFrequency: boolean;
    frequency?: string;
    frequencyOptions?: string[];
    isEditable: boolean;
}

export interface NotificationPreferenceSection {
    id: string;
    key: string;
    title: string;
    icon: string;
    sortOrder: number;
    items: NotificationPreferenceItem[];
}

export interface NotificationPreferencesResponse {
    title: string;
    subtitle: string;
    canSave: boolean;
    sections: NotificationPreferenceSection[];
    communicationChannels: {
        emailDeliveryAddress: string;
        emailDeliveryEditable: boolean;
        desktopPushSupported: boolean;
        desktopPushEnabled: boolean;
        desktopPushPermissionStatus: string;
    };
}

export interface SaveNotificationPreferenceItemPayload {
    preferenceKey: string;
    inAppEnabled: boolean;
    emailEnabled: boolean;
    frequency?: string;
}

export interface SaveNotificationPreferencesPayload {
    preferences: SaveNotificationPreferenceItemPayload[];
    desktopPushEnabled: boolean;
}

export interface SaveNotificationPreferencesResponse {
    saveResult: {
        status: string;
        channelsUpdated: string[];
        frequencySummary: string[];
        message: string;
    };
}