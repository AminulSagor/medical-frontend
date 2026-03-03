import { Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function BlogDetailsHeader() {
    return (
        <div>
            {/* breadcrumb */}
            <div className="text-xs text-light-slate/60">
                <Link href="/public/blogs" className="text-primary hover:opacity-80">
                    ← Back to Discoveries
                </Link>
            </div>

            {/* center title */}
            <div className="mt-6 text-center">
                <div className="text-[11px] font-extrabold tracking-[0.22em] text-primary">
                    EDITOR&apos;S PICK
                </div>

                <h1 className="mt-3 font-serif text-[34px] leading-[1.1] font-bold text-black md:text-[44px]">
                    Revolutionizing Trauma
                    <br />
                    Simulation with Haptic
                    <br />
                    Feedback
                </h1>

                {/* meta row */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-light-slate/60">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#F2C94C]" />
                        <span className="font-semibold text-light-slate/70">Dr. Alex Reid</span>
                    </div>
                    <span>Oct 24, 2023</span>
                    <span>8 min read</span>
                </div>

                {/* small share icons row */}
                <div className="mt-5 flex items-center justify-center gap-3 text-light-slate/60">
                    {/* LinkedIn */}
                    <button className="grid h-9 w-9 place-items-center rounded-full border border-light-slate/15 bg-white hover:bg-light-slate/5 transition">
                        <Linkedin size={16} strokeWidth={1.8} />
                    </button>

                    {/* Twitter */}
                    <button className="grid h-9 w-9 place-items-center rounded-full border border-light-slate/15 bg-white hover:bg-light-slate/5 transition">
                        <Twitter size={16} strokeWidth={1.8} />
                    </button>

                    {/* Mail */}
                    <button className="grid h-9 w-9 place-items-center rounded-full border border-light-slate/15 bg-white hover:bg-light-slate/5 transition">
                        <Mail size={16} strokeWidth={1.8} />
                    </button>
                </div>
            </div>
        </div>
    );
}