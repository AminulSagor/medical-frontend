import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  className?: string;
  onClick?: () => void;
}

type ButtonSize = "sm" | "base" | "md" | "lg";
type ButtonVariant = "primary" | "secondary";
type ButtonShape = "square" | "rounded" | "pill" | "circle";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  base: "px-4 py-2 text-base",
  md: "px-5 py-2.5 text-lg",
  lg: "px-6 py-3 text-xl",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:opacity-90",
  secondary: "bg-white text-black border border-slate-300 hover:bg-slate-100",
};

const shapeClasses: Record<ButtonShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
  circle: "rounded-full w-10 h-10 p-0",
};

const Button = ({
  size = "base",
  variant = "primary",
  shape = "pill",
  children,
  className = "",
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${shapeClasses[shape]}
        inline-flex items-center justify-center gap-2
        font-medium
        cursor-pointer
        transition-all duration-150 ease-out
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
