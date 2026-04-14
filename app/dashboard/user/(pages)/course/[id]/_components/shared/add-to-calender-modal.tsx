"use client";

import { X, CalendarDays, Clock } from "lucide-react";
import { resolveServiceHref } from "@/service/user/course-details.service";
import type {
  AddToCalendarModalProps,
  CalendarProviderKey,
} from "@/types/user/course/add-to-calender-type";
import NetworkImageFallback from "@/app/dashboard/user/_components/network-image-fallback";

function providerLabel(key: CalendarProviderKey) {
  if (key === "google") {
    return {
      title: "Google Calendar",
      subtitle: "Sync to your personal Google account",
    };
  }
  if (key === "outlook") {
    return {
      title: "Outlook Calendar",
      subtitle: "Office 365 or Outlook.com",
    };
  }
  if (key === "apple") {
    return {
      title: "Apple Calendar",
      subtitle: "iCal for Mac, iPhone or iPad",
    };
  }
  return {
    title: "Yahoo Calendar",
    subtitle: "Sync to your Yahoo account",
  };
}

export default function AddToCalendarModalClient({
  open,
  onClose,
  event,
  providers,
  loading,
  description,
  onAddProvider,
  onDownloadIcs,
}: AddToCalendarModalProps) {
  if (!open) return null;

  const providerItems =
    providers.length > 0
      ? providers
      : (["google", "outlook", "apple", "yahoo"] as CalendarProviderKey[]).map((key) => ({
          key,
          ...providerLabel(key),
        }));

  const appleHref = resolveServiceHref(
    providerItems.find((provider) => provider.key === "apple")?.href,
  );

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-[91] w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-[13px] font-semibold text-slate-900">Add to Calendar</div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="px-4 py-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="relative h-[90px] w-full overflow-hidden rounded-lg bg-slate-200">
              <NetworkImageFallback
                src={event.imageSrc}
                alt={event.title}
                className="h-full w-full object-cover"
                fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400"
                iconClassName="h-8 w-8"
              />
            </div>

            <div className="mt-3 text-[9px] font-bold tracking-[0.15em] text-sky-600">
              EVENT SUMMARY
            </div>

            <div className="mt-1 text-[13px] font-semibold text-slate-900">{event.title}</div>

            <div className="mt-2 space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                <span>{event.dateText}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{event.timeText}</span>
              </div>
            </div>
          </div>

          {description ? (
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{description}</p>
          ) : null}

          <div className="mt-4 text-[9px] font-bold tracking-[0.15em] text-slate-400">
            SELECT CALENDAR PROVIDER
          </div>

          <div className="mt-3 space-y-2.5">
            {providerItems.map((provider) => {
              const resolvedHref = resolveServiceHref(provider.href);
              const commonClasses =
                "inline-flex h-7 items-center rounded-md bg-[#35BEEA] px-3 text-[11px] font-semibold text-white hover:opacity-95 active:scale-[0.99]";

              return (
                <div
                  key={provider.key}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                >
                  <div>
                    <div className="text-[12px] font-medium text-slate-900">{provider.title}</div>
                    <div className="text-[10px] text-slate-500">{provider.subtitle}</div>
                  </div>

                  {provider.key === "apple" && resolvedHref ? (
                    <a href={resolvedHref} download className={commonClasses}>
                      Add
                    </a>
                  ) : resolvedHref ? (
                    <a
                      href={resolvedHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={commonClasses}
                    >
                      Add
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAddProvider(provider.key)}
                      disabled={loading}
                      className={commonClasses + " disabled:cursor-not-allowed disabled:opacity-60"}
                    >
                      Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-center">
            {appleHref ? (
              <a
                href={appleHref}
                download
                className="text-[11px] font-medium text-sky-600 hover:text-sky-700"
              >
                Prefer a manual file? <span className="underline underline-offset-2">Download .ics File</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={onDownloadIcs}
                disabled={loading}
                className="text-[11px] font-medium text-sky-600 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Prefer a manual file? <span className="underline underline-offset-2">Download .ics File</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
