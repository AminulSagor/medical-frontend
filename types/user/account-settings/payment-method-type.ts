export type PaymentCardItem = {
  id: string;
  brandLabel: string;
  last4: string;
  expiresLabel: string;
  isDefault?: boolean;
  brandIconUrl?: string | null;
};

export type BillingAddress = {
  name: string;
  line1: string;
  line2: string;
};

export type PaymentMethodsModel = {
  cards: PaymentCardItem[];
  billingAddress: BillingAddress;
};