"use client";

import { ChevronDown, Loader2 } from "lucide-react";

import CourseBrowseCard from "./course-browse-card";
import type { CourseCardModel } from "@/app/public/types/course-browse.types";

export default function CourseResults({
    courses,
    loading,
    error,
    hasMore,
    onRetry,
    onReset,
    onLoadMore,
}: {
    courses: CourseCardModel[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    onRetry: () => void;
    onReset: () => void;
    onLoadMore: () => void;
}) {
    if (loading && courses.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="font-semibold text-red-500">{error}</p>
                <button
                    onClick={onRetry}
                    className="mt-4 rounded-full bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="font-semibold text-light-slate">
                    No courses found matching your filters.
                </p>
                <button
                    onClick={onReset}
                    className="mt-4 rounded-full bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90"
                >
                    Clear Filters
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                    <CourseBrowseCard key={course.id} course={course} />
                ))}
            </div>

            {hasMore ? (
                <div className="mt-10 flex justify-center">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-full border border-light-slate/15 bg-white px-6 py-4 text-sm font-extrabold text-light-slate shadow-sm transition hover:bg-light-slate/10 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Load More Courses <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                </div>
            ) : null}
        </>
    );
}