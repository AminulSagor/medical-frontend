"use client";

import { CreditCard, Lock } from "lucide-react";

const PaymentMethodCard = () => {
  return (
    <div className="bg-white border border-light-slate/10 rounded-2xl p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-light-slate/20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
            3
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Payment Method
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Lock size={14} />
          Secure 256-bit SSL Encrypted
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-light-slate/20 mb-6">
          <button className="pb-4 border-b-2 border-primary text-primary text-sm font-semibold flex items-center gap-2">
            <CreditCard size={16} />
            Credit Card
          </button>

          <button className="pb-4 text-sm text-slate-500 hover:text-slate-700">
            PayPal
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Input label="CARD NUMBER" placeholder="0000 0000 0000 0000" />

          <div className="grid grid-cols-2 gap-6">
            <Input label="EXPIRY DATE" placeholder="MM / YY" />
            <Input label="CVV" placeholder="123" />
          </div>

          <Input label="NAME ON CARD" placeholder="Dr. Sarah Thompson" />

          <label className="flex items-center gap-3 text-sm text-slate-600 pt-2">
            <input
              type="checkbox"
              className="w-4 h-4 border border-light-slate/30 rounded"
            />
            Save this card for future purchases
          </label>
        </div>
      </div>
    </div>
  );
};

const Input = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
      {label}
    </span>
    <input
      placeholder={placeholder}
      className="h-11 px-4 bg-white border border-light-slate/20 rounded-xl text-sm text-slate-700 outline-none focus:border-primary transition-colors"
    />
  </div>
);

export default PaymentMethodCard;