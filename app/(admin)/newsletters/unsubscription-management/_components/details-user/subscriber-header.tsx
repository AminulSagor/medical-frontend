import type { UnsubscriptionDetails } from "../../_lib/details-user-types";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function SubscriberHeader({ data }: { data: UnsubscriptionDetails }) {
  return (
    <div className="flex items-center gap-5">
      {/* Avatar */}
      <div className="h-[76px] w-[76px] overflow-hidden rounded-2xl bg-[#141414] ring-1 ring-slate-200/40">
        {/* dummy logo-like */}
        <div className="grid h-full w-full place-items-center">
          <span className="text-[34px] font-black text-[#d9b36a]">
            {data.initials ?? "SC"}
          </span>
        </div>
      </div>

      {/* Name */}
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <p className="text-[22px] font-bold text-slate-900">
            {data.subscriberName}
          </p>

          {data.roleTag ? (
            <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold tracking-wide text-teal-700 ring-1 ring-teal-100">
              {data.roleTag}
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {data.subscriberEmail}
        </p>
      </div>
    </div>
  );
}