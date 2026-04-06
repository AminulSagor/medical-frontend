"use client";

import {
  Bold,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  Quote,
  Underline,
} from "lucide-react";
import { ToolBtn } from "../shared/editor-form-controls";

export default function CreateBlogPostToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-3">
      <ToolBtn icon={<Bold size={16} />} />
      <ToolBtn icon={<Italic size={16} />} />
      <ToolBtn icon={<Underline size={16} />} />
      <ToolBtn icon={<LinkIcon size={16} />} />
      <ToolBtn icon={<ImageIcon size={16} />} />
      <ToolBtn icon={<Heading1 size={16} />} />
      <ToolBtn icon={<Heading2 size={16} />} />
      <ToolBtn icon={<Quote size={16} />} />
    </div>
  );
}