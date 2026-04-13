"use client";

import { Download, Plus } from "lucide-react";
import React from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PrimaryButton({
  children,
  leftIcon,
  className,
  onClick,
}: {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white",
        "hover:bg-[var(--primary-hover)] transition",
        className
      )}
    >
      {leftIcon}
      {children}
    </button>
  );
}

function GhostButton({
  children,
  leftIcon,
  className,
}: {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700",
        "hover:bg-slate-50 transition",
        className
      )}
    >
      {leftIcon}
      {children}
    </button>
  );
}

type BlogsHeaderProps = {
  onCreate: () => void;
};

export default function BlogsHeader({ onCreate }: BlogsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-lg font-extrabold text-slate-900">Blog Management</h1>
        <p className="mt-1 text-xs text-slate-500">
          Create and manage clinical articles and updates for the institute.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <PrimaryButton
          leftIcon={<Plus size={16} />}
          className="cursor-pointer"
          onClick={onCreate}
        >
          Create New Post
        </PrimaryButton>

        {/* <GhostButton leftIcon={<Download size={16} />}>Export</GhostButton> */}
      </div>
    </div>
  );
}