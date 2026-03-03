import { z } from "zod";

export const paymentCardSchema = z.object({
  id: z.string(),
  brandLabel: z.string(), // e.g. "Visa"
  last4: z.string(), // "4242"
  expiresLabel: z.string(), // "12/26"
  isDefault: z.boolean().optional().default(false),
  brandIconUrl: z.string().optional().nullable(),
});

export const billingAddressSchema = z.object({
  name: z.string(),
  line1: z.string(),
  line2: z.string(), // "Houston, TX 77030"
});

export const paymentMethodsSchema = z.object({
  cards: z.array(paymentCardSchema),
  billingAddress: billingAddressSchema,
});

export type PaymentMethodsValidated = z.infer<typeof paymentMethodsSchema>;