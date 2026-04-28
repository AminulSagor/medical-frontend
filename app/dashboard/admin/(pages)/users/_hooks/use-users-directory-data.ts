"use client";

import { useEffect, useState } from "react";
import { getMasterUsersDirectory } from "@/service/admin/users.service";
import type { MasterUsersDirectoryResponse } from "@/types/admin/users.types";
import type { UserTabKey } from "../_components/users-tabs";
import { mapTabToApiRole, PAGE_SIZE } from "../_utils/users-directory.utils";

type UseUsersDirectoryDataParams = {
    tab: UserTabKey;
    page: number;
    searchText: string;
};

export function useUsersDirectoryData({
    tab,
    page,
    searchText,
}: UseUsersDirectoryDataParams) {
    const [isLoading, setIsLoading] = useState(false);
    const [directoryData, setDirectoryData] =
        useState<MasterUsersDirectoryResponse | null>(null);

    const [masterCounts, setMasterCounts] = useState({
        all: 0,
        students: 0,
        instructors: 0,
    });

    useEffect(() => {
        let ignore = false;

        const loadMasterCounts = async () => {
            try {
                const response = await getMasterUsersDirectory({
                    page: 1,
                    limit: PAGE_SIZE,
                    search: searchText || undefined,
                });

                const stats = response.statistics;

                if (!ignore) {
                    setMasterCounts({
                        all: stats?.totalCommunity ?? 0,
                        students: stats?.roleDistribution?.students ?? 0,
                        instructors: stats?.roleDistribution?.instructors ?? 0,
                    });
                }
            } catch (error) {
                console.error("Failed to load master counts:", error);
            }
        };

        loadMasterCounts();

        return () => {
            ignore = true;
        };
    }, [searchText]);

    useEffect(() => {
        let ignore = false;

        const loadUsers = async () => {
            try {
                setIsLoading(true);

                if (tab === "students") {
                    const [studentResponse, userResponse] = await Promise.all([
                        getMasterUsersDirectory({
                            page: 1,
                            limit: 100,
                            role: "student",
                            search: searchText || undefined,
                        }),
                        getMasterUsersDirectory({
                            page: 1,
                            limit: 100,
                            role: "user",
                            search: searchText || undefined,
                        }),
                    ]);

                    const mergedData = [
                        ...studentResponse.table.data,
                        ...userResponse.table.data,
                    ];

                    const sortedMergedData = mergedData.sort((a, b) => {
                        const left = new Date(b.joinedDate).getTime();
                        const right = new Date(a.joinedDate).getTime();
                        return left - right;
                    });

                    const start = (page - 1) * PAGE_SIZE;
                    const paginatedMergedData = sortedMergedData.slice(
                        start,
                        start + PAGE_SIZE
                    );

                    const mergedResponse: MasterUsersDirectoryResponse = {
                        statistics: studentResponse.statistics,
                        table: {
                            data: paginatedMergedData,
                            meta: {
                                page,
                                limit: PAGE_SIZE,
                                total:
                                    studentResponse.table.meta.total +
                                    userResponse.table.meta.total,
                                totalPages: Math.max(
                                    1,
                                    Math.ceil(
                                        (studentResponse.table.meta.total +
                                            userResponse.table.meta.total) /
                                        PAGE_SIZE
                                    )
                                ),
                            },
                        },
                    };

                    if (!ignore) {
                        setDirectoryData(mergedResponse);
                    }

                    return;
                }

                const response = await getMasterUsersDirectory({
                    page,
                    limit: PAGE_SIZE,
                    role: mapTabToApiRole(tab),
                    search: searchText || undefined,
                });

                if (!ignore) {
                    setDirectoryData(response);
                }
            } catch (error) {
                console.error("Failed to load users directory:", error);
                if (!ignore) {
                    setDirectoryData(null);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            ignore = true;
        };
    }, [tab, page, searchText]);

    return {
        isLoading,
        directoryData,
        masterCounts,
    };
}