export type AboutHero = {
  eyebrow: string; // e.g. "FOUNDER, TEXAS AIRWAY INSTITUTE"
  titleTop: string; // "Architect of"
  titleAccent: string; // "Breath."
  subtitle: string;
  ctaLabel: string; // "Read His Journey"
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  badgeValue: string; // "20+"
  badgeLabel: string; // "YEARS OF CLINICAL EXCELLENCE"
};

export type OriginStoryItem = {
  id: string;
  title: string;
  location: string;
  period: string; // "1998 - 2004"
  description: string;
  side: "left" | "right";
  icon: "cap" | "plane" | "medical";
};

export type FounderMessage = {
  title: string; // "Message from the Founder"
  quote: string;
  body: string;
  signature: string; // "Victor Enoh, MD"
};

export type AboutQuote = {
  icon: "heart";
  title: string; // "Every breath counts."
  description: string;
};

export type CredentialCard =
  | {
      id: string;
      type: "big";
      title: string;
      description: string;
      icon?: "badge";
    }
  | {
      id: string;
      type: "miniStat";
      value: string; // "5k+"
      label: string; // "PROCEDURES"
    }
  | {
      id: string;
      type: "center";
      title: string; // "Texas Airway Institute"
      subtitle: string; // "Founder & Lead Educator"
      linkLabel: string; // "View Curriculum"
      linkHref: string;
      icon?: "cap";
    }
  | {
      id: string;
      type: "wide";
      title: string;
      description: string;
      icon?: "trophy";
    }
  | {
      id: string;
      type: "banner";
      quote: string;
    };

export type VisitCenter = {
  headline: string; // "Ready to master the airway?"
  subhead: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;

  visitTitle: string; // "Visit Our Center"
  visitDesc: string;

  addressTitle: string; // "Texas Airway Institute"
  addressLines: string[];
  hoursTitle: string;
  hoursLines: string[];

  mapImageSrc: string;
  mapImageAlt: string;
};