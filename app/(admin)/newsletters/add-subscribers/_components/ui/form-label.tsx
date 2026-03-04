export default function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-bold tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}