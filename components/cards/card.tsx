import React from "react";

interface CardProps {
  children: React.ReactNode;
  shape?: CardShape;
  className?: string;
}

type CardShape = "square" | "rounded" | "soft" | "pill";

const shapeClasses: Record<CardShape, string> = {
  square: "rounded-none",
  rounded: "rounded-lg",
  soft: "rounded-3xl",
  pill: "rounded-full",
};

const Card = ({
  children,
  shape = "soft", // default
  className = "",
}: CardProps) => {
  return (
    <div
      className={`
        bg-white
        p-6
        shadow-sm
        border border-slate-100
        ${shapeClasses[shape]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
