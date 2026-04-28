"use client";

import UsersHeader from "./users-header";
import UsersTable from "./users-table";
import UsersTabs from "./users-tabs";
import UsersStatsRow from "./users-stats-row";
import UsersToolbar from "./users-toolbar";
import { useUsersDirectory } from "../_hooks/use-users-directory";

export default function UsersDirectoryContent() {
    const {
        tab,
        setTab,
        filters,
        setFilters,
        query,
        setQuery,
        sort,
        setSort,
        items,
        safePage,
        totalItems,
        totalPages,
        setPage,
        isLoading,
        masterCounts,
        headerConfig,
        statsCards,
        handleView,
        handleEdit,
    } = useUsersDirectory();

    return (
        <div className="space-y-5">
            <UsersHeader
                title={headerConfig.title}
                subtitle={headerConfig.subtitle}
                actionLabel={headerConfig.actionLabel}
                onAction={headerConfig.onAction}
            />

            <UsersStatsRow cards={statsCards} />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <UsersTabs tab={tab} onChange={setTab} counts={masterCounts} />
            </div>

            <UsersToolbar
                tab={tab}
                query={query}
                onQueryChange={setQuery}
                filters={filters}
                onFiltersChange={setFilters}
                sort={sort}
                onSortChange={(value) => setSort(value)}
            />

            <div className="rounded-2xl border border-slate-200 bg-white">
                <UsersTable
                    items={items}
                    tab={tab}
                    page={safePage}
                    pageSize={4}
                    totalItems={totalItems}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onView={handleView}
                    onEdit={handleEdit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}