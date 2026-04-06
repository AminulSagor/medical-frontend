"use client";

import { ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cx } from "../_utils/create-blog-post.helpers";

type CreateBlogPostSettingsSectionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  withBorder?: boolean;
};

export default function CreateBlogPostSettingsSection({
  title,
  children,
  defaultOpen = true,
  withBorder = true,
}: CreateBlogPostSettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className={cx("px-5 py-5", withBorder && "border-b border-slate-200")}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mb-5 flex w-full items-center justify-between text-left"
      >
        <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>

        <ChevronUp
          size={15}
          className={cx(
            "text-slate-400 transition-transform duration-200",
            isOpen ? "rotate-0" : "rotate-180",
          )}
        />
      </button>

      {isOpen ? children : null}
    </section>
  );
}