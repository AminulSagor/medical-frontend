"use client";

import { motion } from "motion/react";

type FooterNewsletterColumnProps = {
    email: string;
    errorMessage: string;
    isSubmitting: boolean;
    onEmailChange: (value: string) => void;
    onClearError: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function FooterNewsletterColumn({
    email,
    errorMessage,
    isSubmitting,
    onEmailChange,
    onClearError,
    onSubmit,
}: FooterNewsletterColumnProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-black">Stay Updated</h3>

            <p className="max-w-sm text-sm leading-relaxed text-light-slate">
                Clinical updates and course alerts. delivered to your inbox.
            </p>

            <form onSubmit={onSubmit} className="space-y-3">
                <motion.input
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    type="email"
                    value={email}
                    onChange={(e) => {
                        onEmailChange(e.target.value);
                        if (errorMessage) onClearError();
                    }}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className={[
                        "h-12 w-full rounded-full",
                        "border bg-white px-5 text-sm text-black",
                        "placeholder:text-light-slate outline-none transition",
                        "focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
                        errorMessage ? "border-red-300" : "border-light-slate/25",
                        isSubmitting ? "cursor-not-allowed opacity-70" : "",
                    ].join(" ")}
                />

                <motion.button
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                    whileHover={{ y: isSubmitting ? 0 : -2 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                </motion.button>

                {errorMessage ? (
                    <p className="px-1 text-sm text-red-600">{errorMessage}</p>
                ) : null}
            </form>
        </div>
    );
}