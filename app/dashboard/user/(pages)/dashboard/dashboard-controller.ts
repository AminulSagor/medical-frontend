"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDashboardSummary,
  getEnrolledWorkshops,
  getRecentProductOrder,
} from "@/service/user/logged-in-part/dasboard.service";
import { getUserProfile } from "@/service/user/profile.service";
import type {
  DashboardEnrollmentCardItem,
  DashboardRecentOrderCardItem,
  DashboardSummaryMetrics,
  EnrolledWorkshopItem,
  RecentProductOrderData,
} from "@/types/user/dashboard/dashboard.types";

const DEFAULT_SUMMARY: DashboardSummaryMetrics = {
  cmeCredits: "0.0",
  coursesCompleted: "0",
  nextClass: "N/A",
};

function formatDate(value?: string | null, withTime: boolean = false): string {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: withTime ? "long" : "short",
    day: "2-digit",
    year: "numeric",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      : {}),
  }).format(date);
}

function formatSchedule(value?: string | null): string {
  if (!value) return "Schedule to be announced";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const dateText = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(date);

  const timeText = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${dateText} • ${timeText}`;
}

function formatCurrency(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "$0.00";

  const amount = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(amount)) {
    const stringValue = String(value);
    return stringValue.startsWith("$") ? stringValue : `$${stringValue}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function toTitleCase(value?: string | null): string {
  if (!value) return "N/A";

  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function mapSummary(data?: {
  cmeCredits?: string;
  coursesCompleted?: number;
  nextClass?: string;
} | null): DashboardSummaryMetrics {
  return {
    cmeCredits: data?.cmeCredits ?? "0.0",
    coursesCompleted: String(data?.coursesCompleted ?? 0),
    nextClass: data?.nextClass && data.nextClass.trim() ? data.nextClass : "N/A",
  };
}

function getWorkshopMode(
  item: EnrolledWorkshopItem,
): "Live Workshop" | "Online Workshop" {
  const normalized = (item.courseType ?? item.deliveryMode ?? "").toLowerCase();
  return normalized.includes("online") ? "Online Workshop" : "Live Workshop";
}

function getWorkshopLocation(item: EnrolledWorkshopItem): string {
  if (item.location?.trim()) return item.location;
  if (item.facility?.trim()) return item.facility;
  if (getWorkshopMode(item) === "Online Workshop") {
    if (item.webinarPlatform?.trim()) return item.webinarPlatform;
    if (item.meetingLink?.trim()) return "Online Session";
    return "Online";
  }
  return "Location to be announced";
}

function mapEnrollments(items: EnrolledWorkshopItem[]): DashboardEnrollmentCardItem[] {
  return items.map((item) => {
    const mode = getWorkshopMode(item);
    const isOnline = mode === "Online Workshop";

    return {
      id: item.workshopId,
      mode,
      title: item.title,
      imageUrl: item.workshopPhoto,
      dateTime: formatSchedule(item.startDate),
      location: getWorkshopLocation(item),
      ctaLabel: isOnline ? "Enter Workshop" : "View Syllabus",
      ctaHref: `/dashboard/user/course/${item.workshopId}`,
      ctaIcon: isOnline ? "enter" : "syllabus",
    };
  });
}

function getRecentOrderTitleParts(order: RecentProductOrderData): {
  title: string;
  titleSuffix?: string;
} {
  const firstProduct = order.products?.[0];
  const baseTitle = firstProduct?.productName?.trim() || order.productName || "Product";
  const remainingCount = Math.max((order.products?.length ?? 0) - 1, 0);

  return {
    title: baseTitle,
    titleSuffix: remainingCount > 0 ? `+${remainingCount} more` : undefined,
  };
}

function getRecentOrderImage(order: RecentProductOrderData): string | null {
  const firstProduct = order.products?.[0];
  return firstProduct?.productImage ?? order.productImage ?? null;
}

function getOrderStatus(order: RecentProductOrderData): string {
  const shippingStatus = toTitleCase(order.shippingStatus);
  if (shippingStatus !== "N/A") return shippingStatus;

  const fulfillmentStatus = toTitleCase(order.fulfillmentStatus);
  if (fulfillmentStatus !== "N/A") return fulfillmentStatus;

  return toTitleCase(order.paymentStatus);
}

function mapRecentOrders(orders: RecentProductOrderData[]): DashboardRecentOrderCardItem[] {
  return orders.map((order) => {
    const { title, titleSuffix } = getRecentOrderTitleParts(order);

    return {
      id: order.id,
      title,
      titleSuffix,
      orderNo: `#${order.orderId}`,
      date: formatDate(order.orderedAt),
      amount: formatCurrency(order.price),
      status: getOrderStatus(order),
      imageUrl: getRecentOrderImage(order),
      detailsHref: `/dashboard/user/order-details?id=${encodeURIComponent(order.id)}`,
    };
  });
}

export function useDashboardController() {
  const [summary, setSummary] = useState<DashboardSummaryMetrics>(DEFAULT_SUMMARY);
  const [enrollments, setEnrollments] = useState<DashboardEnrollmentCardItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<DashboardRecentOrderCardItem[]>([]);
  const [firstName, setFirstName] = useState("there");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryResult, recentOrderResult, enrolledWorkshopsResult, profileResult] =
        await Promise.allSettled([
          getDashboardSummary(),
          getRecentProductOrder(),
          getEnrolledWorkshops(),
          getUserProfile(),
        ]);

      const failedSections: string[] = [];

      if (summaryResult.status === "fulfilled") {
        setSummary(mapSummary(summaryResult.value.data));
      } else {
        failedSections.push("summary metrics");
      }

      if (recentOrderResult.status === "fulfilled") {
        setRecentOrders(mapRecentOrders(recentOrderResult.value.data ?? []));
      } else {
        failedSections.push("recent orders");
      }

      if (enrolledWorkshopsResult.status === "fulfilled") {
        setEnrollments(mapEnrollments(enrolledWorkshopsResult.value.data ?? []));
      } else {
        failedSections.push("enrolled workshops");
      }

      if (profileResult.status === "fulfilled") {
        const apiFirstName = profileResult.value.data?.firstName?.trim();
        setFirstName(apiFirstName || "there");
      } else {
        failedSections.push("profile");
      }

      if (failedSections.length > 0) {
        setError(
          `Failed to load ${failedSections.join(", ")}. Some dashboard data may be incomplete.`,
        );
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    summary,
    enrollments,
    recentOrders,
    firstName,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}
