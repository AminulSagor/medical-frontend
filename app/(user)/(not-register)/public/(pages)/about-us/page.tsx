import AboutCredentials from "./_components/about-credentials";
import AboutCtaVisit from "./_components/about-cta-visit";
import AboutFounderMessage from "./_components/about-founder-message";
import AboutHero from "./_components/about-hero";
import AboutOriginStory from "./_components/about-origin-story";
import AboutQuoteSection from "./_components/about-quote";


export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* navbar is fixed overlay in your PublicLayout */}
      <div className="pt-24">
        <AboutHero />
        <AboutOriginStory />
        <AboutFounderMessage />
        <AboutQuoteSection />
        <AboutCredentials />
        <AboutCtaVisit />
      </div>
    </div>
  );
}