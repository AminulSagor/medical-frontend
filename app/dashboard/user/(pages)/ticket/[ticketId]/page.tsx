import { TicketDetailsModel } from "@/types/user/ticket/ticket-details-type";
import TicketDetailsLayout from "./_component/ticket-details-layout";

const SEED: TicketDetailsModel = {
  profile: {
    name: "Dr. Sarah Jen",
    verified: true,
    subtitle: "Department of Anesthesiology • Resident PGY-4",
    meta: "Primary Registrant • ID: #C-99281-HOU",
    avatarUrl: "/photos/image.png",
  },
  attendees: [
    {
      id: "a2",
      name: "Attendee 2: Dr. Michael Chen",
      roleLabel: "Role: Anesthesiologist",
      statusLabel: "PENDING CHECK-IN",
    },
  ],
  workshop: {
    title: "Advanced Difficult Airway Workshop",
    dateLabel: "Mar 12 - 14",
    progressLabel: "Day 1 Complete",
    waitlistStatus: "N/A (Primary Enrollment)",
  },
  booking: {
    groupSizeLabel: "2 People",
    paymentStatusLabel: "Paid in Full ($450.00)",
    bookingRef: "#8829-AC",
  },
  venue: {
    currentLocationLabel: "Room 4B (Sim Lab)",
    equipment: [
      "Fiberoptic Scope A-01",
      "High-Fidelity Manikin #4",
      "Video Laryngoscope Kit",
    ],
  },
};

export default function TicketDetailsPage() {
  return (
    <div className="min-h-[calc(100vh-0px)] bg-slate-50">
      <div className="mx-auto w-full max-w-[980px] px-6 py-10">
        <TicketDetailsLayout model={SEED} />
      </div>
    </div>
  );
}
