import type { ReactNode } from "react";

export default function CoursesLayout({ children }: { children: ReactNode }) {
    // (admin)/layout.tsx already wraps sidebar + topbar
    // This layout is just for the courses section (optional wrapper).
    return <>{children}</>;
}