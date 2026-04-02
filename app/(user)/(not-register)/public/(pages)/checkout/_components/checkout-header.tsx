"use client";
import { ArrowLeft, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const CheckOutHeader = () => {
  const router = useRouter();
  return (
    <div>
      <button
        className="border rounded-full border-light-slate/20 flex items-center gap-2 px-4 py-1.5 bg-white"
        onClick={() => router.back()}
      >
        <ArrowLeft size={18} /> <span>Back to Catalog</span>
      </button>

      <h1 className="flex items-center gap-2 text-xl font-bold mt-2">
        <span>
          <LockIcon size={20} className="text-primary" />
        </span>
        <span>Secure Checkout</span>
      </h1>
    </div>
  );
};

export default CheckOutHeader;
