import type { ReadonlyURLSearchParams } from "next/navigation";

import {
    CourseCardModel,
    CreditsRange,
} from "@/app/public/types/course-browse.types";
import type { CourseFiltersState } from "@/app/public/(pages)/courses/_components/course-filters-sidebar";
import type { PublicWorkshop } from "@/types/public/workshop/public-workshop.types";

export function inCreditsRange(cme: number, range: CreditsRange) {
    if (range === "1_4") return cme >= 1 && cme <= 4;
    if (range === "5_8") return cme >= 5 && cme <= 8;

    return cme >= 8;
}

export function getDeliveryModeFromFilters(
    delivery: CourseFiltersState["delivery"],
) {
    if (delivery.in_person && !delivery.online) return "in_person" as const;
    if (delivery.online && !delivery.in_person) return "online" as const;

    return undefined;
}

export function getResolvedQuery(searchParams: ReadonlyURLSearchParams) {
    return (
        searchParams.get("q") ??
        searchParams.get("search") ??
        searchParams.get("topic") ??
        ""
    );
}

function formatWebinarPlatform(value?: string | null) {
    if (!value) return "";

    return value
        .replace(/[_-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
}

function resolveLocation(workshop: PublicWorkshop) {
    if (workshop.deliveryMode === "online") {
        return formatWebinarPlatform(workshop.webinarPlatform) || "Online Course";
    }

    if (workshop.facilities?.length) {
        return workshop.facilities[0].name;
    }

    return "";
}

function isRegistrationDeadlineExpired(deadline?: string | null) {
    if (!deadline) return false;

    const parsed = new Date(deadline);
    if (Number.isNaN(parsed.getTime())) return false;

    return parsed.getTime() <= Date.now();
}

export function transformWorkshopToCourse(
    workshop: PublicWorkshop,
): CourseCardModel {
    const date = workshop.date ? new Date(workshop.date) : null;
    const month = date
        ? date.toLocaleString("en-US", { month: "short" }).toUpperCase()
        : undefined;
    const day = date ? String(date.getDate()) : undefined;

    const availableSeats = workshop.availableSeats;
    const totalCapacity = workshop.totalCapacity;
    const isRegistrationClosed = isRegistrationDeadlineExpired(
        workshop.registrationDeadline,
    );
    const isSoldOut = workshop.isFullyBooked || availableSeats <= 0;
    const percentFilled =
        totalCapacity > 0
            ? ((totalCapacity - availableSeats) / totalCapacity) * 100
            : 0;
    const isAvailable = !isSoldOut && !isRegistrationClosed;

    const action: CourseCardModel["action"] = isRegistrationClosed
        ? { kind: "disabled", label: "Expired" }
        : isSoldOut
            ? { kind: "disabled", label: "Sold Out" }
            : { kind: "reserve", label: "Reserve Seat" };

    const metaTop: CourseCardModel["metaTop"] = [];

    if (workshop.totalHours) {
        metaTop.push({ icon: "clock", label: workshop.totalHours });
    }

    const resolvedLocation = resolveLocation(workshop);

    if (resolvedLocation) {
        metaTop.push({ icon: "pin", label: resolvedLocation });
    } else if (workshop.totalModules > 0) {
        metaTop.push({
            icon: "modules",
            label: `${workshop.totalModules} Modules`,
        });
    }

    const metaBottom: CourseCardModel["metaBottom"] = [];
    const cmeCreditsCount = Number(workshop.cmeCreditsCount ?? 0);

    if (workshop.cmeCredits) {
        metaBottom.push({
            icon: "cme",
            label: `${cmeCreditsCount} CME`,
        });
    }

    const isLowAvailability = isAvailable && availableSeats <= 5;

    const availability: CourseCardModel["availability"] = {
        label: "AVAILABILITY",
        note: isSoldOut
            ? "Sold Out"
            : isLowAvailability
                ? `Only ${availableSeats} seats available`
                : `${availableSeats} seats available`,
        percent: percentFilled,
        tone: isSoldOut || isLowAvailability ? "danger" : "primary",
    };

    const currentPrice = Number(workshop.offerPrice ?? workshop.price) || 0;
    const oldPrice = workshop.offerPrice
        ? Number(workshop.price) || undefined
        : undefined;

    return {
        id: workshop.id,
        title: workshop.title,
        description: workshop.description,
        delivery: workshop.deliveryMode,
        date: month && day ? { month, day } : undefined,
        imageSrc: workshop.workshopPhoto || undefined,
        imageAlt: workshop.title,
        metaTop,
        metaBottom,
        availability,
        price: currentPrice,
        oldPrice,
        action,
        cmeCredits: cmeCreditsCount,
        isAvailable,
        isRegistrationClosed,
        isSoldOut,
    };
}