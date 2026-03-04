"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      className="text-light-slate border border-light-slate/20 p-1 rounded-full flex items-center justify-center"
      onClick={() => router.back()}
    >
      <ArrowLeft size={18} />
    </button>
  );
};

export default BackButton;
