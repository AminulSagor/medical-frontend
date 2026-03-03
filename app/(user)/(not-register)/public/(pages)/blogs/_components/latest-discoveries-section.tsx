"use client";

import { useState } from "react";
import LatestDiscoveriesGrid from "@/app/(user)/(not-register)/public/(pages)/blogs/_components/latest-discoveries-grid";
import BlogsRightSideCard from "./right-side-cards/blogs-card";
import LatestDiscoveriesList from "./latest-discoveries-list";

type ViewMode = "grid" | "list";

export default function LatestDiscoveriesSection() {
  const [view, setView] = useState<ViewMode>("grid");

  return (
    <section className="w-full pt-10">
      <div className="padding">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {/* header */}
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[30px] leading-[34px] font-bold text-black">
                Latest Discoveries
              </h2>

              {/* view toggle (list will be used later) */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={[
                    "grid h-9 w-9 place-items-center rounded-lg border transition",
                    view === "grid"
                      ? "border-light-slate/15 bg-white shadow-sm"
                      : "border-transparent bg-transparent hover:bg-light-slate/5",
                  ].join(" ")}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  {/* grid icon */}
                  <span className="text-light-slate/70">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M3 3h5v5H3V3Zm7 0h5v5h-5V3ZM3 10h5v5H3v-5Zm7 0h5v5h-5v-5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={[
                    "grid h-9 w-9 place-items-center rounded-lg border transition",
                    view === "list"
                      ? "border-light-slate/15 bg-white shadow-sm"
                      : "border-transparent bg-transparent hover:bg-light-slate/5",
                  ].join(" ")}
                  aria-label="List view"
                  title="List view"
                >
                  {/* list icon */}
                  <span className="text-light-slate/70">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M4 5h11v2H4V5Zm0 6h11v2H4v-2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-6">
              {view === "grid" ? (
                <LatestDiscoveriesGrid />
              ) : (
                <LatestDiscoveriesList />
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                className="rounded-full border border-light-slate/15 bg-white px-6 py-2.5 text-sm font-semibold text-light-slate hover:bg-light-slate/5 active:scale-95 transition"
              >
                Load More Articles
              </button>
            </div>
          </div>

          <div className="lg:pt-11">
            <BlogsRightSideCard />
          </div>
        </div>
      </div>
    </section>
  );
}