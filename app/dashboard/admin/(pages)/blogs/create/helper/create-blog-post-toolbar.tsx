"use client";

import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  Quote,
  Underline,
} from "lucide-react";
import { ToolBtn } from "../shared/editor-form-controls";

type CreateBlogPostToolbarProps = {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onH1: () => void;
  onH2: () => void;
  onQuote: () => void;
};

export default function CreateBlogPostToolbar({
  onBold,
  onItalic,
  onUnderline,
  onH1,
  onH2,
  onQuote,
}: CreateBlogPostToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b  px-4 py-2">
      <ToolBtn icon={<Bold size={16} />} onClick={onBold} />
      <ToolBtn icon={<Italic size={16} />} onClick={onItalic} />
      <ToolBtn icon={<Underline size={16} />} onClick={onUnderline} />
      <ToolBtn icon={<Heading1 size={16} />} onClick={onH1} />
      <ToolBtn icon={<Heading2 size={16} />} onClick={onH2} />
      <ToolBtn icon={<Quote size={16} />} onClick={onQuote} />
    </div>
  );
}
