"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FOOTER_BOTTOM } from "@/app/public/data/footer.data";

export default function FooterBottomBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col gap-4 border-t border-light-slate/20 pt-6 md:flex-row md:items-center md:justify-between"
        >
            <p className="text-sm text-light-slate">
                © 2024 Texas Airway Institute. All rights reserved.
            </p>

            <div className="flex items-center gap-8">
                {FOOTER_BOTTOM.map((item) => (
                    <motion.div
                        key={item.href}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <Link
                            href={item.href}
                            className="text-sm font-medium text-light-slate transition-colors hover:text-black"
                        >
                            {item.label}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}