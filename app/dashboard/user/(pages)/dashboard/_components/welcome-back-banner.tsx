type WelcomeBackBannerProps = {
  name?: string;
  subtitle?: string;
  metrics?: {
    cmeCredits: string;
    coursesCompleted: string;
    nextClass: string;
  };
  isLoading?: boolean;
};

export default function WelcomeBackBanner({
  name = "there",
  subtitle = "Your clinical journey continues. You're making great progress this week.",
  metrics,
  isLoading = false,
}: WelcomeBackBannerProps) {
  const statItems = [
    {
      label: "CME CREDITS",
      value: metrics?.cmeCredits ?? "0.0",
      icon: "🎓",
    },
    {
      label: "COURSES COMPLETED",
      value: metrics?.coursesCompleted ?? "0",
      icon: "✅",
    },
    {
      label: "NEXT CLASS",
      value: metrics?.nextClass ?? "N/A",
      icon: "📅",
    },
  ];

  return (
    <section className="relative -mt-6">
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-16 text-center text-white shadow-[0_12px_35px_rgba(2,132,199,0.25)] sm:px-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back, <span className="font-bold">{name}</span>
        </h1>

        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
          {subtitle}
        </p>
      </div>

      <div className="-mt-10 flex flex-wrap justify-center gap-4 px-4 sm:-mt-10">
        {statItems.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  isLoading,
}: {
  label: string;
  value: string;
  icon: string;
  isLoading: boolean;
}) {
  return (
    <div
      className={[
        "w-[180px] rounded-2xl px-5 py-4 text-center",
        "bg-gradient-to-b from-sky-50/90 via-white to-white",
        "border border-slate-200/70",
        "shadow-[0_10px_22px_rgba(15,23,42,0.10)]",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto grid h-10 w-10 place-items-center rounded-xl",
          "bg-sky-500 text-white",
          "shadow-[0_8px_18px_rgba(2,132,199,0.25)]",
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="mt-3 min-h-6 text-[18px] font-semibold leading-6 text-slate-900">
        {isLoading ? "..." : value}
      </div>

      <div className="mt-1 text-[10px] font-semibold tracking-wider text-slate-500">
        {label}
      </div>
    </div>
  );
}
