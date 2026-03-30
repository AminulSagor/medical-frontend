"use client";

import React from "react";
import { Eye } from "lucide-react";
import { GhostButton, PrimaryButton } from "../ui/form-controls";

export default function PostSettingsActions({
  onSaveDraft,
  onPublish,
  onPreview,
}: {
  onSaveDraft: () => void;
  onPublish: () => void;
  onPreview: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <GhostButton className="flex-1" onClick={onSaveDraft}>
          Save Draft
        </GhostButton>
        <PrimaryButton className="flex-1" onClick={onPublish}>
          Publish
        </PrimaryButton>
      </div>

      <GhostButton className="w-full" onClick={onPreview}>
        <Eye size={16} />
        Preview Article
      </GhostButton>
    </>
  );
}

