"use client";

import { useUsersDirectoryData } from "./use-users-directory-data";
import { useUsersDirectoryQueryState } from "./use-users-directory-query-state";
import { useUsersDirectoryViewModel } from "./use-users-directory-view-model";

export function useUsersDirectory() {
    const queryState = useUsersDirectoryQueryState();

    const dataState = useUsersDirectoryData({
        tab: queryState.tab,
        page: queryState.page,
        searchText: queryState.searchText,
    });

    const viewModel = useUsersDirectoryViewModel({
        tab: queryState.tab,
        filters: queryState.filters,
        sort: queryState.sort,
        directoryData: dataState.directoryData,
    });

    return {
        ...queryState,
        ...dataState,
        ...viewModel,
    };
}