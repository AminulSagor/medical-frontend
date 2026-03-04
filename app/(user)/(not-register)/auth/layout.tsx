import Navbar from "@/components/layout/navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="max-w-6xl mx-auto mt-6">
        <Navbar />
      </div>
      {children}
    </div>
  );
};

export default layout;
