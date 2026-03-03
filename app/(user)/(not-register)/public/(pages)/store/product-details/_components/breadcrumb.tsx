import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({
  items,
  className = "",
}: {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}) {
  return (
    <nav className={`flex items-center gap-2 text-sm text-light-slate ${className}`}>
      <Home className="h-4 w-4" />
      {items.map((it, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${it.label}-${idx}`}>
            <ChevronRight className="h-4 w-4 opacity-50" />
            {it.href && !isLast ? (
              <Link className="hover:text-primary" href={it.href}>
                {it.label}
              </Link>
            ) : (
              <span className={isLast ? "text-black font-medium" : ""}>{it.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}