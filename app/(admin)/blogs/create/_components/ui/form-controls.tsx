import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import React from "react";
import { cx } from "./shared";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </p>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={cx(
        "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400",
        "focus:border-cyan-200 focus:ring-2 focus:ring-cyan-100",
        className
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      className={cx(
        "w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400",
        "focus:border-cyan-200 focus:ring-2 focus:ring-cyan-100",
        className
      )}
      {...props}
    />
  );
}

export function GhostButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      type={props.type ?? "button"}
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700",
        "hover:bg-slate-50 transition",
        className
      )}
    />
  );
}

export function PrimaryButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      type={props.type ?? "button"}
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white",
        "hover:bg-[var(--primary-hover)] transition",
        className
      )}
    />
  );
}

