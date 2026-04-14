export type TicketProfile = {
  name: string;
  verified: boolean;
  subtitle: string;
  meta: string;
  avatarUrl?: string | null;
};

export type TicketAttendee = {
  id: string;
  name: string;
  roleLabel: string;
  statusLabel: string;
};

export type TicketWorkshop = {
  title: string;
  dateLabel: string;
  progressLabel: string;
  waitlistStatus: string;
};

export type TicketBooking = {
  groupSizeLabel: string;
  paymentStatusLabel: string;
  bookingRef: string;
};

export type VenueFacility = {
  id: string;
  name: string;
  roomNumber: string;
  physicalAddress: string;
};

export type VenueLogistics = {
  currentLocationLabel: string;
  addressLabel: string;
  roomNumberLabel: string;
  facilities: VenueFacility[];
  equipment: string[];
};

export type TicketDetailsModel = {
  profile: TicketProfile;
  attendees: TicketAttendee[];
  workshop: TicketWorkshop;
  booking: TicketBooking;
  venue: VenueLogistics;
};
export type TicketDetailsApiModel = TicketDetailsModel;
