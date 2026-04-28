"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { FooterLink } from "@/app/public/data/footer.data";

type FooterLinksColumnProps = {
    title: string;
    links: FooterLink[];
    emptyText?: string;
    showMore?: boolean;
    moreHref?: string;
};

export default function FooterLinksColumn({
    title,
    links,
    emptyText,
    showMore = false,
    moreHref = "#",
}: FooterLinksColumnProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-black">{title}</h3>

            <div className="flex flex-col gap-3">
                {links.length > 0 ? (
                    <>
                        {links.map((item) => (
                            <FooterLinkItem
                                key={`${item.href}-${item.label}`}
                                href={item.href}
                                label={item.label}
                            />
                        ))}

                        {showMore ? <FooterLinkItem href={moreHref} label="More..." /> : null}
                    </>
                ) : (
                    <p className="text-sm text-light-slate">
                        {emptyText || "No items available right now."}
                    </p>
                )}
            </div>
        </div>
    );
}

function FooterLinkItem({ href, label }: { href: string; label: string }) {
    return (
        <motion.div
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            <Link
                href={href}
                className="text-sm font-medium text-light-slate transition-colors hover:text-black"
            >
                {label}
            </Link>
        </motion.div>
    );
}