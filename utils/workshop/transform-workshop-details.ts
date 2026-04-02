import { PublicWorkshopDetails } from "@/types/workshop/public-workshop.types";
import { IMAGE } from "@/constant/image-config";
import { CourseDetails } from "@/app/public/types/course.details.types";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startFormatted = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  if (startDate === endDate) {
    return `${startFormatted}, ${start.getFullYear()}`;
  }

  const endFormatted = end.toLocaleDateString("en-US", {
    day: "numeric",
    year: "numeric",
  });

  return `${startFormatted} - ${endFormatted}`;
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
}

function getDayPill(dayNumber: number): string {
  const words = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN"];
  return `DAY ${words[dayNumber - 1] || dayNumber}`;
}

export function transformWorkshopToDetails(
  workshop: PublicWorkshopDetails,
): CourseDetails {
  const deliveryModeLabel =
    workshop.deliveryMode === "online" ? "ONLINE" : "IN-PERSON";
  const daysLabel =
    workshop.numberOfDays === 1
      ? "1-DAY WORKSHOP"
      : `${workshop.numberOfDays}-DAY WORKSHOP`;

  return {
    id: workshop.id,

    hero: {
      title: workshop.title,
      badges: [
        { label: daysLabel, tone: "primary" },
        ...(workshop.offersCmeCredits
          ? [{ label: "CME CREDITS", tone: "muted" as const }]
          : []),
      ],
      backgroundSrc: workshop.workshopPhoto || IMAGE.course_details_cover,
      backgroundAlt: workshop.title,
    },

    about: {
      title: "About this Workshop",
      description: workshop.description,
    },

    info: [
      {
        key: "location" as const,
        title: "DELIVERY MODE",
        lines: [
          deliveryModeLabel,
          workshop.deliveryMode === "online" && workshop.webinarPlatform
            ? `Via ${workshop.webinarPlatform.charAt(0).toUpperCase() + workshop.webinarPlatform.slice(1)}`
            : "",
        ].filter(Boolean),
      },
      {
        key: "dates" as const,
        title: "DATES",
        lines: [
          formatDateRange(workshop.startDate, workshop.endDate),
          `${workshop.numberOfDays}-Day ${workshop.deliveryMode === "online" ? "Online" : "Intensive"}`,
        ],
      },
      {
        key: "time" as const,
        title: "DURATION",
        lines: [workshop.totalHours, `${workshop.totalModules} Modules`],
      },
    ],

    pricing: {
      feeLabel: "REGISTRATION FEE",
      price: parseFloat(workshop.standardPrice),
      perLabel: "Per Participant",
      features: [
        {
          id: "f1",
          label: `Full ${workshop.numberOfDays}-Day Curriculum Access`,
        },
        {
          id: "f2",
          label:
            workshop.deliveryMode === "online"
              ? "Live Interactive Sessions"
              : "Hands-on Training Materials",
        },
        ...(workshop.offersCmeCredits
          ? [{ id: "f3", label: "CME Certificate of Completion" }]
          : []),
      ],
      groupSave:
        workshop.groupDiscountEnabled && workshop.groupDiscounts.length > 0
          ? {
              title: "GROUP & SAVE",
              oldPrice: parseFloat(workshop.standardPrice),
              newPrice: parseFloat(workshop.groupDiscounts[0].pricePerPerson),
              discountLabel: `SAVE $${workshop.groupDiscounts[0].savingsPerPerson}`,
              note: `Special pricing for ${workshop.groupDiscounts[0].minimumAttendees}+ attendees`,
            }
          : {
              title: "GROUP & SAVE",
              oldPrice: parseFloat(workshop.standardPrice),
              newPrice: parseFloat(workshop.standardPrice),
              discountLabel: "N/A",
              note: "Group discounts not available",
            },
      ctaLabel: "Enroll Now",
      warningLabel:
        workshop.availableSeats <= workshop.alertAt
          ? `Only ${workshop.availableSeats} seats remaining!`
          : `${workshop.availableSeats} seats available`,
      footnote: `LIMITED SLOTS: ONLY ${workshop.totalCapacity} AVAILABLE`,
    },

    itinerary: {
      title: "Workshop Itinerary",
      days: workshop.days.map((day, idx) => ({
        dayNumber: day.dayNumber,
        dayPill: getDayPill(day.dayNumber),
        dateLabel: formatDate(day.date),
        trackLabel: `${day.totalDayHours} HOURS`,
        title: day.segments[0]?.courseTopic || `Day ${day.dayNumber} Sessions`,
        description: day.segments.map((s) => s.courseTopic).join(", "),
        expanded: idx === 0,
        schedule: day.segments.map((seg) => ({
          id: `d${day.dayNumber}s${seg.segmentNumber}`,
          at: formatTime(seg.startTime),
          title: seg.courseTopic,
          description:
            seg.topicDetails || `Duration: ${seg.durationHours} hours`,
        })),
      })),
    },

    instructors: {
      title: "Workshop Instructors",
      list: workshop.faculty.map((f) => ({
        id: f.id,
        name: f.name,
        role: f.title,
        quote: f.bio || f.specialties,
        avatarSrc: f.profileImageUrl || IMAGE.instructor_1,
        avatarAlt: f.name,
      })),
    },

    trustedBy: {
      label: "LEARNING OBJECTIVES:",
      brands: workshop.learningObjectives
        .split(/[,.\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 3),
    },
  };
}
