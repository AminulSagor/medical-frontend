export interface UpdateShippingAddressPayload {
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  zipCode: string;
}

export interface ShippingAddressData {
  fullName: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isComplete: boolean;
}

export interface UpdateShippingAddressResponse {
  message: string;
  data: ShippingAddressData;
}
