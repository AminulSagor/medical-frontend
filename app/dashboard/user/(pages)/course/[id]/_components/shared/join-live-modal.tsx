"use client";

import { useState } from "react";
import { AlertCircle, Copy, ExternalLink, Video, X } from "lucide-react";
import type { CourseMeetingInfoResponse } from "@/types/user/course/course-detail-api.types";

function formatMeetingPlatform(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export default function JoinLiveModalClient({
  open,
  onClose,
  loading,
  data,
}: {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  data?: CourseMeetingInfoResponse | null;
}) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);

  if (!open) return null;

  const copyPasscode = async () => {
    if (!data?.meetingDetails.passcode) return;

    try {
      await navigator.clipboard.writeText(data.meetingDetails.passcode);
      setCopiedPasscode(true);
      window.setTimeout(() => setCopiedPasscode(false), 1500);
    } catch (error) {
      console.error("Failed to copy passcode", error);
    }
  };

  const copyCredentials = async () => {
    if (!data) return;

    const payload = `Meeting ID: ${data.meetingDetails.meetingId}\nPasscode: ${data.meetingDetails.passcode}\nJoin Link: ${data.meetingDetails.meetingLink}`;

    try {
      await navigator.clipboard.writeText(payload);
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 1500);
    } catch (error) {
      console.error("Failed to copy credentials", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[340px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-[18px] font-semibold text-slate-900">Joining Live Session</div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="px-5 py-5">
          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500">Loading meeting info...</div>
          ) : data ? (
            <>
              <div className="text-[26px] font-semibold leading-tight text-slate-900">
                {data.title}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                <Video className="h-3.5 w-3.5" /> Powered by {formatMeetingPlatform(data.meetingDetails.platform) || data.meetingDetails.platform}
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400">PASSCODE</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="text-[13px] font-semibold text-slate-900">{data.meetingDetails.passcode}</div>
                  <button
                    type="button"
                    onClick={copyPasscode}
                    className={copiedPasscode ? "text-emerald-500" : "text-sky-500"}
                    aria-label="Copy passcode"
                    title={copiedPasscode ? "Passcode copied" : "Copy passcode"}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400">JOIN LINK</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <a
                    href={data.meetingDetails.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-[12px] text-sky-500 underline-offset-2 hover:underline"
                  >
                    {data.meetingDetails.meetingLink}
                  </a>
                  <a href={data.meetingDetails.meetingLink} target="_blank" rel="noreferrer" className="text-sky-500">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[11px] leading-relaxed text-amber-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{data.description}</span>
                </div>
              </div>

              <a
                href={data.meetingDetails.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 text-[14px] font-semibold text-white shadow-[0_10px_20px_rgba(53,190,234,0.25)] hover:bg-sky-600"
              >
                <Video className="h-4 w-4" />
                {data.actions.join}
              </a>

              <button
                type="button"
                onClick={copyCredentials}
                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-700 hover:bg-slate-50"
              >
                <Copy className="h-4 w-4" />
                {copiedAll ? "Copied" : "Copy All Credentials"}
              </button>
            </>
          ) : (
            <div className="py-10 text-center text-sm text-slate-500">Meeting info not available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
