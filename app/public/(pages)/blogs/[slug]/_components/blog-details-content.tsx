export default function BlogDetailsContent() {
    return (
        <article className="prose max-w-none">
            {/* we are not using prose classes from tailwind typography plugin
          because your project seems custom — so we build styles manually */}
            <div className="space-y-6 text-[14px] leading-7 text-light-slate/70">
                <p>
                    The intersection of haptic technology and medical simulation marks a pivotal moment
                    in residency training. New tactile feedback systems allow trainees to build muscle
                    memory before ever touching a patient.
                </p>

                <p>
                    Traditional resuscitation practice has relied on visual auditory cues — the missing
                    piece has always been tactile feedback. Recent breakthroughs in sensor arrays and
                    soft robotics now make it possible.
                </p>
            </div>

            <h2 className="mt-10 font-serif text-[20px] font-bold text-black">
                Bridging the Sensory Gap
            </h2>

            <div className="mt-4 space-y-6 text-[14px] leading-7 text-light-slate/70">
                <p>
                    Haptic systems paired with scenario-based learning can dramatically improve
                    performance under pressure. The goal is not to replace hands-on training, but to
                    accelerate readiness and reduce avoidable error.
                </p>

                {/* quote block like screenshot */}
                <div className="max-w-[760px] border-l-4 border-primary pl-6">
                    <p className="font-serif italic text-[26px] leading-[36px] text-black/80">
                        “Simulation isn&apos;t just about repetition; it&apos;s about neural mapping of crisis
                        responses. We are teaching the nervous system, not just the mind.”
                    </p>

                    <p className="mt-4 text-[12px] font-extrabold tracking-[0.22em] text-primary uppercase">
                        — DR. EMILY CHEN, LEAD RESEARCHER
                    </p>
                </div>

                <p>
                    With the right implementation, these tools can align assessment with real-world
                    skill, not just knowledge recall.
                </p>
            </div>

            <h2 className="mt-10 font-serif text-[20px] font-bold text-black">
                The Reassessment of Ethical Training
            </h2>

            <div className="mt-4 space-y-6 text-[14px] leading-7 text-light-slate/70">
                <p>
                    Ethical considerations follow any emerging clinical technology. The focus must be
                    on transparency, accessibility, and patient safety.
                </p>

                {/* bullet list like screenshot */}
                <ul className="mt-4 list-disc space-y-2 pl-6">
                    <li>Reduced risk during early-stage skill acquisition.</li>
                    <li>Faster skill acquisition through repeatable practice.</li>
                    <li>Objective feedback loops for continuous improvement.</li>
                    <li>Customizable scenarios for trauma and airway response.</li>
                </ul>
            </div>

            {/* second image + caption like screenshot */}
            <div className="mt-10 overflow-hidden rounded-[18px] border border-light-slate/10 bg-white">
                <div className="relative h-[220px] w-full md:h-[260px]">
                    {/* use any existing image for now */}
                    <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/5 to-transparent" />
                </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-light-slate/55">
                Figure 1: Conceptual model for tactile feedback in simulation environments.
            </p>

            <h2 className="mt-10 font-serif text-[20px] font-bold text-black">
                Future Implications
            </h2>

            <div className="mt-4 space-y-6 text-[14px] leading-7 text-light-slate/70">
                <p>
                    As these systems mature, the next step is standardization — ensuring curricula
                    remain evidence-based and equitable across institutions.
                </p>
            </div>
        </article>
    );
}