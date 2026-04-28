"use client";

import { useEffect, useState } from "react";
import type { UserTabKey } from "../_components/users-tabs";
import type { FilterState, SortOption } from "../_components/users-toolbar";

export function useUsersDirectoryQueryState() {
    const [tab, setTab] = useState<UserTabKey>("all");
    const [filters, setFilters] = useState<FilterState>({});
    const [query, setQuery] = useState("");
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<SortOption | undefined>(undefined);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchText(query.trim());
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        setPage(1);
    }, [tab]);

    return {
        tab,
        setTab,
        filters,
        setFilters,
        query,
        setQuery,
        searchText,
        page,
        setPage,
        sort,
        setSort,
    };
}