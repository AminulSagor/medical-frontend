import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import InPersonView from "./views/in-person-view";
import OnlineView from "./views/online-view";
import { getCourseDetailsController } from "./course-details-controller";
import CompletedView from "./views/completed-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const courseId = decodeURIComponent(id);

  const state = await getCourseDetailsController(courseId);

  return (
    <main className="w-full bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {/* Back */}
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/dashboard/user/course"
            className="inline-flex items-center gap-2 hover:text-slate-700"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span>Back to My Courses</span>
          </Link>
        </div>

        {state.progressStatus === "completed" ? (
  <CompletedView data={state.completed} />
) : state.deliveryType === "inPerson" ? (
  <InPersonView
    hero={state.hero}
    summary={state.summary}
    about={state.about}
    booking={state.booking}
    schedule={state.schedule}
    checkin={state.checkin}
    help={state.help}
  />
) : (
  <OnlineView data={state.online} />
)}
      </div>
    </main>
  );
}