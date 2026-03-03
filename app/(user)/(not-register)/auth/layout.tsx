import Navbar from "@/components/layout/navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border">
      <div className="padding pt-4">
        <Navbar />
      </div>
      {children}
    </div>
  );
};

export default layout;
