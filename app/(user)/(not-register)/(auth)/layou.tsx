import Navbar from "@/components/layout/navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
