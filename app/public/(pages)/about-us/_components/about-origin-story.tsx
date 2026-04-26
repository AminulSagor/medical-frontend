import { GraduationCap, Plane, PlusSquare } from "lucide-react";

type OriginStoryItem = {
  id: string;
  title: string;
  location: string;
  period: string;
  description: string;
  side: "left" | "right";
  icon: "cap" | "plane" | "medical";
};

const ITEMS: OriginStoryItem[] = [
  {
    id: "1",
    title: "Medical Foundation",
    location: "Germany",
    period: "1998 - 2004",
    description:
      "Completed rigorous medical training with honors, laying the groundwork in physiology and patient care protocols.",
    side: "left",
    icon: "cap",
  },
  {
    id: "2",
    title: "Transatlantic Move & Residency",
    location: "United States",
    period: "2005 - 2009",
    description:
      "Relocated to the US to pursue advanced specialization in Anesthesiology, quickly establishing a reputation for clinical excellence.",
    side: "right",
    icon: "plane",
  },
  {
    id: "3",
    title: "Texas Airway Institute",
    location: "Founder & Lead Physician",
    period: "Present",
    description:
      "Founded the institute to address critical gaps in airway management, creating a center of excellence for complex cases.",
    side: "left",
    icon: "medical",
  },
];

function NodeIcon({ kind }: { kind: OriginStoryItem["icon"] }) {
  const iconProps = { size: 18, strokeWidth: 2.2 };

  if (kind === "cap") return <GraduationCap {...iconProps} />;
  if (kind === "plane") return <Plane {...iconProps} />;

  return <PlusSquare {...iconProps} />;
}

export default function AboutOriginStory() {
  return (
    <section id="origin" className="py-24">
      <div className="padding">
        <div className="text-center">
          <div className="text-[11px] font-extrabold tracking-[0.22em] text-primary/60">
            THE ORIGIN STORY
          </div>

          <h2 className="mt-3 font-serif text-[44px] font-bold text-black">
            From Germany to Texas
          </h2>

          <div className="mx-auto mt-4 h-[2px] w-14 bg-primary/35" />

          <p className="mx-auto mt-5 max-w-[70ch] text-sm leading-6 text-light-slate/70">
            From academic foundations in Europe to clinical leadership in the US.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-[980px]">
          <div className="absolute left-6 top-0 h-full w-px bg-light-slate/15 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-14">
            {ITEMS.map((item) => {
              const isLeft = item.side === "left";

              return (
                <div
                  key={item.id}
                  className="relative grid gap-4 pl-16 md:grid-cols-2 md:gap-0 md:pl-0"
                >
                  <div className="absolute left-0 top-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-[0_10px_25px_rgba(31,110,128,0.25)]">
                      <NodeIcon kind={item.icon} />
                    </div>
                  </div>

                  {isLeft ? (
                    <>
                      <div className="text-left md:pr-16 md:text-right">
                        <div className="text-[15px] font-bold text-black">
                          {item.title}
                        </div>

                        <div className="mt-1 text-[13px] font-semibold text-primary">
                          {item.location}
                        </div>

                        <p className="mt-3 max-w-[320px] text-[12px] leading-6 text-light-slate/65 md:ml-auto">
                          {item.description}
                        </p>
                      </div>

                      <div className="md:pl-16">
                        <span className="inline-flex rounded-md bg-light-slate/5 px-3 py-1 text-xs font-semibold text-light-slate/60">
                          {item.period}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="order-2 md:order-none md:pr-16 md:text-right">
                        <span className="inline-flex rounded-md bg-light-slate/5 px-3 py-1 text-xs font-semibold text-light-slate/60">
                          {item.period}
                        </span>
                      </div>

                      <div className="order-1 text-left md:order-none md:pl-16">
                        <div className="text-[15px] font-bold text-black">
                          {item.title}
                        </div>

                        <div className="mt-1 text-[13px] font-semibold text-primary">
                          {item.location}
                        </div>

                        <p className="mt-3 max-w-[320px] text-[12px] leading-6 text-light-slate/65">
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}