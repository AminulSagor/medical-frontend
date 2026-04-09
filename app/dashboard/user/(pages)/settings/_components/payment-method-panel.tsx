import { PaymentMethodsModel } from "@/types/user/account-settings/payment-method-type";
import PaymentMethodsClient from "./payment-methods-client";

const SEED: PaymentMethodsModel = {
  cards: [
    {
      id: "card_visa_4242",
      brandLabel: "Visa",
      last4: "4242",
      expiresLabel: "12/26",
      isDefault: true,
      brandIconUrl: "/photos/image.png", // optional (replace later)
    },
    {
      id: "card_mc_8891",
      brandLabel: "Mastercard",
      last4: "8891",
      expiresLabel: "05/25",
      isDefault: false,
      brandIconUrl: "/photos/image.png", // optional (replace later)
    },
  ],
  billingAddress: {
    name: "Dr. Sarah Thompson",
    line1: "123 Medical Center Blvd",
    line2: "Houston, TX 77030",
  },
};

export default function PaymentMethodsPanel() {
  return (
    <div>
      <div>
        <div className="text-[14px] font-semibold text-slate-900">
          Payment Methods
        </div>
        <div className="mt-1 text-[12px] text-slate-500">
          Manage your saved cards and billing information.
        </div>
      </div>

      <div className="mt-6">
        <PaymentMethodsClient seed={SEED} />
      </div>
    </div>
  );
}
