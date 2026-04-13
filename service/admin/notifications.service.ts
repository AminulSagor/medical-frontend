import { serviceClient } from "@/service/base/axios_client";
import type {
    GetDropdownNotificationsResponse,
    GetNotificationsParams,
    GetNotificationsResponse,
    MarkAllNotificationsReadResponse,
    NotificationPreferencesResponse,
    SaveNotificationPreferencesPayload,
    SaveNotificationPreferencesResponse,
} from "@/types/admin/notifications.types";

export const getNotifications = async (
    params: GetNotificationsParams,
): Promise<GetNotificationsResponse> => {
    const response = await serviceClient.get<GetNotificationsResponse>(
        "/admin/notifications",
        {
            params,
        },
    );

    return response.data;
};

export const getDropdownNotifications =
    async (): Promise<GetDropdownNotificationsResponse> => {
        const response = await serviceClient.get<GetDropdownNotificationsResponse>(
            "/admin/notifications/dropdown",
        );

        return response.data;
    };

export const markAllNotificationsRead =
    async (): Promise<MarkAllNotificationsReadResponse> => {
        const response = await serviceClient.patch<MarkAllNotificationsReadResponse>(
            "/admin/notifications/mark-all-read",
        );

        return response.data;
    };

export const getNotificationPreferences =
    async (): Promise<NotificationPreferencesResponse> => {
        const response = await serviceClient.get<NotificationPreferencesResponse>(
            "/admin/notifications/preferences",
        );

        return response.data;
    };

export const saveNotificationPreferences = async (
    payload: SaveNotificationPreferencesPayload,
): Promise<SaveNotificationPreferencesResponse> => {
    const response = await serviceClient.post<SaveNotificationPreferencesResponse>(
        "/admin/notifications/preferences",
        payload,
    );

    return response.data;
};