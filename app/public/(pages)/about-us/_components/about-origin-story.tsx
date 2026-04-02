import {
  GraduationCap,
  Plane,
  PlusSquare,
} from "lucide-react";

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
        {/* Head */}
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

        {/* Timeline */}
        <div className="relative mx-auto mt-16 max-w-[980px]">
          {/* center line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-light-slate/15" />

          <div className="space-y-14">
            {ITEMS.map((it) => {
              const isLeft = it.side === "left";

              return (
                <div
                  key={it.id}
                  className="relative grid items-center md:grid-cols-2"
                >
                  {/* LEFT CONTENT */}
                  <div className={isLeft ? "pr-16 text-right" : "pr-16"} />

                  {/* NODE */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-[0_10px_25px_rgba(31,110,128,0.25)]">
                      <NodeIcon kind={it.icon} />
                    </div>
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="pl-16">
                    {/* This block alternates by rendering on left or right column */}
                  </div>

                  {/* ACTUAL CONTENT L/R */}
                  {isLeft ? (
                    <>
                      {/* left side content */}
                      <div className="pr-16 text-right">
                        <div className="text-[15px] font-bold text-black">
                          {it.title}
                        </div>
                        <div className="mt-1 text-[13px] font-semibold text-primary">
                          {it.location}
                        </div>

                        <p className="mx-0 ml-auto mt-3 max-w-[320px] text-[12px] leading-6 text-light-slate/65">
                          {it.description}
                        </p>
                      </div>

                      {/* right side pill */}
                      <div className="pl-16">
                        <span className="inline-flex rounded-md bg-light-slate/5 px-3 py-1 text-xs font-semibold text-light-slate/60">
                          {it.period}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* left side pill */}
                      <div className="pr-16 text-right">
                        <span className="inline-flex rounded-md bg-light-slate/5 px-3 py-1 text-xs font-semibold text-light-slate/60">
                          {it.period}
                        </span>
                      </div>

                      {/* right side content */}
                      <div className="pl-16">
                        <div className="text-[15px] font-bold text-black">
                          {it.title}
                        </div>
                        <div className="mt-1 text-[13px] font-semibold text-primary">
                          {it.location}
                        </div>

                        <p className="mt-3 max-w-[320px] text-[12px] leading-6 text-light-slate/65">
                          {it.description}
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