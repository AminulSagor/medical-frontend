import type { TicketDetailsModel } from "@/types/ticket/ticket-details-type";
import TicketMainCard from "./ticket-main-card";
import VenueLogisticsCard from "./vanue-logistics-card";
import HelpDeskCard from "./help-desk-card";

export default function TicketDetailsLayout({
  model,
}: {
  model: TicketDetailsModel;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      <TicketMainCard model={model} />

      <div className="space-y-6">
        <VenueLogisticsCard venue={model.venue} />
        <HelpDeskCard />
      </div>
    </div>
  );
}