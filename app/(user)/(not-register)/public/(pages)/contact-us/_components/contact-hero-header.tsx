type Props = {
  badgeText?: string;
  titleLeft?: string;
  titleHighlight?: string;
  titleRight?: string;
  subtitle?: string;
};

export default function ContactHeroHeader({
  badgeText = "WE'RE HERE TO HELP",
  titleLeft = "How can we",
  titleHighlight = "help you",
  titleRight = "today?",
  subtitle = "Reach out to our simulation specialists for enrollment inquiries, facility bookings, or technical support.",
}: Props) {
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 pt-10 text-center">
      <div className="inline-flex items-center justify-center rounded-full border border-light-slate/20 bg-white px-3 py-1 text-[11px] font-semibold tracking-widest text-light-slate">
        {badgeText}
      </div>

      <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
        {titleLeft} <span className="text-primary">{titleHighlight}</span>{" "}
        {titleRight}
      </h1>

      <p className="mx-auto mt-3 max-w-[650px] text-sm leading-6 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}
