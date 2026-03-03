import ContactSupportButton from "./contact-support-button";

export default function HelpDeskCard() {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 px-7 py-7 shadow-[0_18px_40px_rgba(2,6,23,0.35)]">
      <div className="text-[13px] font-bold tracking-[0.18em] text-sky-400">
        HELP DESK
      </div>

      <div className="mt-3 text-[22px] font-bold text-white">
        Registration Issues?
      </div>

      <div className="mt-6">
        <ContactSupportButton />
      </div>
    </section>
  );
}