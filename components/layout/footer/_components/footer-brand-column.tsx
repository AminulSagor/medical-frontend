"use client";

import Link from "next/link";
import { Globe, Mail, PlusSquare, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function FooterBrandColumn() {
    const [shareMessage, setShareMessage] = useState("");

    async function handleShare() {
        const shareUrl =
            typeof window !== "undefined"
                ? `${window.location.origin}/public/home`
                : "/public/home";

        setShareMessage("");

        try {
            if (typeof navigator !== "undefined" && navigator.share) {
                await navigator.share({
                    title: "Texas Airway Institute",
                    text: "Explore Texas Airway Institute",
                    url: shareUrl,
                });

                setShareMessage("Sharable link is ready.");
                return;
            }

            if (typeof navigator !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                setShareMessage("Sharable link copied to clipboard.");
                return;
            }

            setShareMessage("Sharing is not supported on this device.");
        } catch {
            setShareMessage("Unable to share right now.");
        } finally {
            window.setTimeout(() => {
                setShareMessage("");
            }, 2500);
        }
    }

    return (
        <div className="space-y-5">
            <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            >
                <Link href="/public/home" className="inline-flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-md border border-light-slate/20 bg-white">
                        <PlusSquare className="text-primary" size={18} />
                    </span>

                    <span className="text-base font-extrabold text-black">
                        Texas Airway Inst.
                    </span>
                </Link>
            </motion.div>

            <p className="max-w-xs text-sm leading-relaxed text-light-slate">
                Defining the global standard for airway management and clinical
                simulation training since 2018.
            </p>

            <div className="flex items-center gap-5">
                <FooterSocialLink href="/public/home" label="Website">
                    <Globe size={21} strokeWidth={2} />
                </FooterSocialLink>

                <FooterSocialLink href="mailto:support@simcenter.edu" label="Email">
                    <Mail size={21} strokeWidth={2} />
                </FooterSocialLink>

                <motion.button
                    type="button"
                    onClick={handleShare}
                    whileHover={{ y: -3, scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-light-slate/50 transition-colors hover:text-black"
                    aria-label="Share"
                >
                    <Share2 size={21} strokeWidth={2} />
                </motion.button>
            </div>

            {shareMessage ? (
                <p className="text-xs font-medium text-green-600">{shareMessage}</p>
            ) : null}
        </div>
    );
}

function FooterSocialLink({
    href,
    label,
    children,
}: {
    href: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            whileHover={{ y: -3, scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            <Link
                href={href}
                className="text-light-slate/50 transition-colors hover:text-black"
                aria-label={label}
            >
                {children}
            </Link>
        </motion.div>
    );
}