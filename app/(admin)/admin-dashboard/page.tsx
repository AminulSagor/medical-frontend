import StatCards from "./_components/stat-cards";
import RevenueTrends from "./_components/revenue-trends";
import RecentEnrollments from "./_components/recent-enrollments";
import QuickActions from "./_components/quick-actions";
import LowStockAlert from "./_components/low-stock-alert";
import RecentActivity from "./_components/recent-activity";
import TopPerformingCourses from "./_components/top-performing-courses";
import PageTitle from "../_components/page-title";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Title */}
            <PageTitle
                title="Overview Analytics"
                subtitle="Track your institute's performance at a glance."
            />

            {/* Stats */}
            <StatCards />

            {/* ✅ UI-1 style: left fluid + right fixed rail */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                {/* Left */}
                <div className="min-w-0 space-y-6">
                    <RevenueTrends />
                    <RecentEnrollments />
                </div>

                {/* Right */}
                <div className="min-w-0 space-y-6">
                    <QuickActions />
                    <LowStockAlert />
                    <RecentActivity />
                    <TopPerformingCourses />
                </div>
            </div>
        </div>
    );
}