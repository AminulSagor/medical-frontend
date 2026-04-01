"use client";

import React from "react";
import { Eye } from "lucide-react";
import { GhostButton, PrimaryButton } from "../ui/form-controls";

export default function PostSettingsActions({
  onSaveDraft,
  onPublish,
  onPreview,
  disabled,
}: {
  onSaveDraft: () => void;
  onPublish: () => void;
  onPreview: () => void;
  disabled?: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <GhostButton className="flex-1" onClick={onSaveDraft} disabled={disabled}>
          Save Draft
        </GhostButton>
        <PrimaryButton className="flex-1" onClick={onPublish} disabled={disabled}>
          Publish
        </PrimaryButton>
      </div>

      <GhostButton className="w-full" onClick={onPreview} disabled={disabled}>
        <Eye size={16} />
        Preview Article
      </GhostButton>
    </>
  );
}

