import { getTicketDetailsServer } from "@/service/user/course-details.server.service";
import type { TicketDetailsModel } from "@/types/user/ticket/ticket-details-type";
import TicketDetailsLayout from "./_component/ticket-details-layout";

const NOT_IN_API = "";

function text(value?: string | null) {
  return value && value.trim() ? value : NOT_IN_API;
}

function mapTicketModel(data: Awaited<ReturnType<typeof getTicketDetailsServer>>): TicketDetailsModel {
  const ticket = data.data;

  return {
    profile: {
      name: text(ticket.attendee?.name),
      verified: Boolean(ticket.attendee?.isVerified),
      subtitle: text(ticket.attendee?.department),
      meta: text(ticket.attendee?.roleInfo),
      avatarUrl: ticket.attendee?.avatarUrl || null,
    },
    attendees: (ticket.groupAttendees ?? []).map((item) => ({
      id: item.id,
      name: text(item.name),
      roleLabel: text(item.role),
      statusLabel: text(item.status),
    })),
    workshop: {
      title: text(ticket.course?.title),
      dateLabel: text(ticket.course?.dateRange),
      progressLabel: text(ticket.course?.progressBadge),
      waitlistStatus: text(ticket.bookingInfo?.waitlistStatus),
    },
    booking: {
      groupSizeLabel: text(ticket.bookingInfo?.groupSize),
      paymentStatusLabel: text(ticket.bookingInfo?.paymentStatus),
      bookingRef: text(ticket.bookingInfo?.bookingRef),
    },
    venue: {
      currentLocationLabel: text(ticket.venueLogistics?.currentLocation),
      addressLabel: text(ticket.venueLogistics?.facilities?.[0]?.physicalAddress),
      roomNumberLabel: text(ticket.venueLogistics?.facilities?.[0]?.roomNumber),
      facilities: (ticket.venueLogistics?.facilities ?? []).map((facility) => ({
        id: facility.id,
        name: text(facility.name),
        roomNumber: text(facility.roomNumber),
        physicalAddress: text(facility.physicalAddress),
      })),
      equipment: ticket.venueLogistics?.assignedEquipment?.length
        ? ticket.venueLogistics.assignedEquipment
        : [NOT_IN_API],
    },
  };
}

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const response = await getTicketDetailsServer(decodeURIComponent(ticketId)).catch(() => ({
    message: "",
    data: {
      attendee: {
        name: NOT_IN_API,
        department: NOT_IN_API,
        roleInfo: NOT_IN_API,
        isVerified: false,
        avatarUrl: null,
      },
      groupAttendees: [],
      course: {
        title: NOT_IN_API,
        dateRange: NOT_IN_API,
        progressBadge: NOT_IN_API,
      },
      bookingInfo: {
        groupSize: NOT_IN_API,
        paymentStatus: NOT_IN_API,
        bookingRef: NOT_IN_API,
        waitlistStatus: NOT_IN_API,
      },
      venueLogistics: {
        currentLocation: NOT_IN_API,
        facilities: [],
        assignedEquipment: [NOT_IN_API],
      },
    },
  }));
  const model = mapTicketModel(response);

  return (
    <div className="min-h-[calc(100vh-0px)] bg-slate-50">
      <div className="mx-auto w-full max-w-[980px] px-6 py-10">
        <TicketDetailsLayout model={model} />
      </div>
    </div>
  );
}
