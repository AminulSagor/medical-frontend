"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react";

function CardShell({
    title,
    subtitle,
    icon,
    children,
}: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start gap-3 border-b border-slate-100 p-5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 ring-1 ring-sky-100 text-sky-700">
                    {icon}
                </div>
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
            </div>

            <div className="p-5">{children}</div>
        </section>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return <div className="text-[11px] font-semibold tracking-wider text-slate-500">{children}</div>;
}

function TextInput({
    right,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { right?: React.ReactNode }) {
    return (
        <div className="relative">
            <input
                {...props}
                className={[
                    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none",
                    "placeholder:text-slate-400 focus:border-sky-200 focus:ring-2 focus:ring-sky-100",
                    props.className ?? "",
                ].join(" ")}
            />
            {right ? (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div>
            ) : null}
        </div>
    );
}

function Requirement({ ok, children }: { ok: boolean; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className={ok ? "text-[var(--primary)]" : "text-slate-300"}>
                <CheckCircle2 size={14} />
            </span>
            <span className={ok ? "text-slate-700" : "text-slate-500"}>{children}</span>
        </div>
    );
}

export default function ChangePasswordCard() {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const checks = useMemo(() => {
        const min8 = next.length >= 8;
        const hasNumber = /\d/.test(next);
        const hasSpecial = /[^A-Za-z0-9]/.test(next);
        const hasMixedCase = /[a-z]/.test(next) && /[A-Z]/.test(next);
        return { min8, hasSpecial, hasNumber, hasMixedCase };
    }, [next]);

    const canSubmit = useMemo(() => {
        if (!current || !next || !confirm) return false;
        if (next !== confirm) return false;
        // require at least min8, number, special (you can adjust)
        if (!checks.min8 || !checks.hasNumber || !checks.hasSpecial) return false;
        return true;
    }, [current, next, confirm, checks]);

    async function onSubmit() {
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            // TODO: call API here
            await new Promise((r) => setTimeout(r, 700));
            setCurrent("");
            setNext("");
            setConfirm("");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <CardShell
            title="Change Password"
            subtitle="Ensure your account uses a complex password to maintain security standards."
            icon={<KeyRound size={18} />}
        >
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                {/* Left form */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>CURRENT PASSWORD</Label>
                        <TextInput
                            type={showCurrent ? "text" : "password"}
                            value={current}
                            onChange={(e) => setCurrent(e.target.value)}
                            placeholder="••••••••"
                            right={
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent((v) => !v)}
                                    className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                                    aria-label={showCurrent ? "Hide password" : "Show password"}
                                >
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            }
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>NEW PASSWORD</Label>
                            <TextInput
                                type="password"
                                value={next}
                                onChange={(e) => setNext(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>CONFIRM PASSWORD</Label>
                            <TextInput
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {next && confirm && next !== confirm ? (
                        <p className="text-xs text-red-500">Passwords do not match.</p>
                    ) : null}

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!canSubmit || submitting}
                        className={[
                            "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold text-white transition",
                            "bg-[var(--primary)] hover:bg-[var(--primary-hover)]",
                            "disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:bg-[var(--primary)]",
                        ].join(" ")}
                    >
                        {submitting ? "Resetting..." : "Reset Password"}
                    </button>
                </div>

                {/* Right requirements */}
                <aside className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-400">
                        PASSWORD REQUIREMENTS
                    </p>

                    <div className="mt-3 space-y-2">
                        <Requirement ok={checks.min8}>Min. 8 characters</Requirement>
                        <Requirement ok={checks.hasSpecial}>Special symbol (@, #, $)</Requirement>
                        <Requirement ok={checks.hasNumber}>Include numbers</Requirement>
                        <Requirement ok={checks.hasMixedCase}>Mixed case letters</Requirement>
                    </div>
                </aside>
            </div>
        </CardShell>
    );
}