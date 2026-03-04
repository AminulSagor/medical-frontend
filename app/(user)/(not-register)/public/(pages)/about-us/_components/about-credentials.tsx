import CredentialsGrid from "./credentials-grid";

export default function AboutCredentials() {
  return (
    <section className="py-20 bg-[rgba(246,247,248,0.55)]">
      <div className="padding">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="font-serif text-[38px] font-bold text-black">
              Expertise & <span className="italic text-primary">Credentials</span>
            </h3>
          </div>
          <p className="max-w-[46ch] text-xs leading-6 text-light-slate/60">
            A snapshot of professional milestones and core competencies.
          </p>
        </div>

        <CredentialsGrid />
      </div>
    </section>
  );
}