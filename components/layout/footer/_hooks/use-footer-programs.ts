"use client";

import { useEffect, useState } from "react";
import type { FooterLink } from "@/app/public/data/footer.data";
import { getPublicWorkshops } from "@/service/public/workshop.service";

type FooterWorkshopLike = {
    id?: string;
    title?: string;
    name?: string;
    workshopTitle?: string;
};

export function useFooterPrograms() {
    const [footerPrograms, setFooterPrograms] = useState<FooterLink[]>([]);
    const [hasMorePrograms, setHasMorePrograms] = useState(false);

    useEffect(() => {
        const fetchFooterPrograms = async () => {
            try {
                const response = await getPublicWorkshops({
                    page: 1,
                    limit: 5,
                });

                const programs = (response.data ?? []) as FooterWorkshopLike[];

                setFooterPrograms(
                    programs
                        .filter((item) => item?.id)
                        .slice(0, 4)
                        .map((item) => ({
                            label:
                                item.title ||
                                item.name ||
                                item.workshopTitle ||
                                "Untitled Program",
                            href: `/public/courses/details/${item.id}`,
                        })),
                );

                setHasMorePrograms(
                    programs.length > 4 || (response.meta?.total ?? 0) > 4,
                );
            } catch (error) {
                console.error("Failed to load footer programs:", error);
                setFooterPrograms([]);
                setHasMorePrograms(false);
            }
        };

        void fetchFooterPrograms();
    }, []);

    return {
        footerPrograms,
        hasMorePrograms,
    };
}