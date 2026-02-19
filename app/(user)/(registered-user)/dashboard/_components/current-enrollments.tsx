// app/(dashboard)/_components/current-enrollments.tsx
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Video, BookOpen, LogIn } from "lucide-react";

type Enrollment = {
    id: string;
    mode: "Live Workshop" | "Online Workshop";
    title: string;
    imageUrl: string;

    // Left card (live)
    dateTime?: string;
    location?: string;

    // Right card (online)
    room?: string;
    access?: string;

    ctaLabel: string;
    ctaHref: string;
    ctaIcon?: "syllabus" | "enter";
};

export default function CurrentEnrollments(props: { items?: Enrollment[] }) {
    const items: Enrollment[] =
        props.items ??
        [
            {
                id: "1",
                mode: "Live Workshop",
                title: "Advanced Airway Management",
                imageUrl: "/photos/Image.png",

                dateTime: "March 15, 2024 • 09:00 AM",
                location: "Sim Lab B, Main Campus",
                ctaLabel: "View Syllabus",
                ctaHref: "#",
                ctaIcon: "syllabus",
            },
            {
                id: "2",
                mode: "Online Workshop",
                title: "Pediatric Anesthesia Update",
                imageUrl: "/photos/Image.png",

                room: "Virtual Training Room 4",
                access: "Self-paced Access",
                ctaLabel: "Enter Workshop",
                ctaHref: "#",
                ctaIcon: "enter",
            },
        ];

    return (
        <section className="mt-8">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Current Enrollments</h2>

                <Link
                    href="#"
                    className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
                >
                    View All
                </Link>
            </div>

            {/* Cards */}
            <div className="mt-4 grid gap-5 md:grid-cols-2">
                {items.slice(0, 2).map((it) => (
                    <EnrollmentCard key={it.id} item={it} />
                ))}
            </div>
        </section>
    );
}

function EnrollmentCard({ item }: { item: Enrollment }) {
    const badgeClass =
        item.mode === "Live Workshop"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-sky-50 text-sky-700 ring-sky-200";

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
            {/* image */}
            <div className="relative h-[170px] w-full bg-slate-100">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" priority={false} />
            </div>

            {/* content */}
            <div className="p-5">
                <span
                    className={[
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1",
                        badgeClass,
                    ].join(" ")}
                >
                    {item.mode}
                </span>

                <h3 className="mt-2 text-sm font-semibold text-slate-900">{item.title}</h3>

                {/* meta rows */}
                <div className="mt-3 space-y-2 text-[12px] text-slate-600">
                    {item.dateTime ? (
                        <MetaRow icon={<Clock className="h-4 w-4" />} text={item.dateTime} />
                    ) : null}

                    {item.location ? (
                        <MetaRow icon={<MapPin className="h-4 w-4" />} text={item.location} />
                    ) : null}

                    {item.room ? (
                        <MetaRow icon={<Video className="h-4 w-4" />} text={item.room} />
                    ) : null}

                    {item.access ? (
                        <MetaRow icon={<BookOpen className="h-4 w-4" />} text={item.access} />
                    ) : null}
                </div>

                <div className="mt-4 h-px bg-slate-200/70" />

                <div className="mt-4">
                    <Link
                        href={item.ctaHref}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(2,132,199,0.22)] transition hover:bg-sky-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
                    >
                        {item.ctaIcon === "syllabus" ? <BookOpen className="h-4 w-4" /> : null}
                        {item.ctaIcon === "enter" ? <LogIn className="h-4 w-4" /> : null}
                        {item.ctaLabel}
                    </Link>
                </div>
            </div>
        </article>
    );
}

function MetaRow({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-slate-400">{icon}</span>
            <span>{text}</span>
        </div>
    );
}
