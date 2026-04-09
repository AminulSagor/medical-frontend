export interface Facility {
  id: string;
  name: string;
  roomNumber: string;
  physicalAddress: string;
  capacity: number;
  notes: string;
}

export interface CreateFacilityRequest {
  name: string;
  roomNumber?: string;
  physicalAddress: string;
  capacity?: number;
  notes?: string;
}

export interface UpdateFacilityRequest {
  name?: string;
  roomNumber?: string;
  physicalAddress?: string;
  capacity?: number;
  notes?: string;
}

export interface ListFacilitiesResponse {
  items: Facility[];
}

export interface DeleteFacilityResponse {
  message: string;
}
