// app/(user)/(public)/privacy-policy/_data/privacy-policy.data.ts

export type PrivacyPolicyTOCItem = {
  id: string; // anchor id
  number: string; // "01."
  label: string;
};

export type PrivacyPolicyBullet = {
  title: string; // bold lead
  text: string; // rest
};

export type PrivacyPolicyCallout = {
  title: string;
  text: string;
};

export type PrivacyPolicyContact = {
  title: string; // "TAI Helpline"
  description: string;
  emailLabel: string;
  emailValue: string;
  phoneLabel: string;
  phoneValue: string;
};

export type PrivacyPolicySection =
  | {
      id: string;
      number: string;
      title: string;
      paragraphs: string[];
      bullets?: never;
      callout?: never;
      contact?: never;
    }
  | {
      id: string;
      number: string;
      title: string;
      paragraphs: string[];
      bullets: PrivacyPolicyBullet[];
      callout?: never;
      contact?: never;
    }
  | {
      id: string;
      number: string;
      title: string;
      paragraphs: string[];
      callout: PrivacyPolicyCallout;
      bullets?: never;
      contact?: never;
    }
  | {
      id: string;
      number: string;
      title: string;
      paragraphs: string[];
      contact: PrivacyPolicyContact;
      bullets?: never;
      callout?: never;
    };

export type PrivacyPolicyPageData = {
  toc: PrivacyPolicyTOCItem[];
  helpCard: {
    title: string;
    subtitle: string;
    ctaLabel: string;
  };
  sections: PrivacyPolicySection[];
};

export const PRIVACY_POLICY_DATA: PrivacyPolicyPageData = {
  toc: [
    { id: "intro", number: "01.", label: "Introduction" },
    { id: "collect", number: "02.", label: "Information We Collect" },
    { id: "use", number: "03.", label: "Use of Data" },
    { id: "cme", number: "04.", label: "CME & ACCME Reporting" },
    { id: "rights", number: "05.", label: "Your Rights" },
    { id: "contact", number: "06.", label: "Contact Us" },
  ],

  helpCard: {
    title: "Need Help?",
    subtitle: "Our compliance team is available Mon-Fri.",
    ctaLabel: "Contact →",
  },

  sections: [
    {
      id: "intro",
      number: "01.",
      title: "Introduction",
      paragraphs: [
        "At the Texas Airway Institute, we recognize that privacy is of paramount importance, specifically within the context of continuing medical education and professional development. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our educational platform and services.",
        "We are committed to maintaining the trust and confidence of our medical professionals, faculty, and institutional partners. By accessing our services, you acknowledge the terms outlined in this document.",
      ],
    },

    {
      id: "collect",
      number: "02.",
      title: "Information We Collect",
      paragraphs: [
        "To provide accredited certification and maintain accurate educational transcripts, we collect specific professional data points. This information is strictly limited to what is necessary for administrative and compliance purposes.",
      ],
      bullets: [
        {
          title: "Personal Identification:",
          text: "Full legal name as it appears on your medical license.",
        },
        {
          title: "NPI Number:",
          text: "Your National Provider Identifier for verification against the NPPES registry.",
        },
        {
          title: "Contact Information:",
          text: "Institutional email address and primary phone number.",
        },
        {
          title: "Licensure Data:",
          text: "State of medical license issuance and expiration dates.",
        },
        {
          title: "Clinical Profile:",
          text: "Primary specialty and sub-specialty areas.",
        },
      ],
    },

    {
      id: "use",
      number: "03.",
      title: "Use of Data",
      paragraphs: [
        "The data collected is utilized primarily to facilitate your participation in our educational programs. This includes the generation of CME certificates, tracking of learning progress, and communication regarding upcoming symposia relevant to your specialty.",
        "We do not sell, rent, or lease your professional information to third-party pharmaceutical companies or device manufacturers for marketing purposes.",
      ],
    },

    {
      id: "cme",
      number: "04.",
      title: "CME & ACCME Reporting",
      paragraphs: [
        "This data transfer occurs over encrypted channels and is limited to the specific data points required by the ACCME for credit validation.",
      ],
      callout: {
        title: "Accreditation Data Sharing",
        text: "Please be advised that as an accredited provider, the Texas Airway Institute is required to share participant data with the Accreditation Council for Continuing Medical Education (ACCME) via the PARS system. This ensures that the credits you earn are properly recorded and recognized by your specific certifying board.",
      },
    },

    {
      id: "rights",
      number: "05.",
      title: "Your Rights",
      paragraphs: [
        "Under applicable data protection laws, you retain the right to access the personal information we hold about you. You may request corrections to any inaccurate data, such as an updated NPI number or change of surname.",
        "You may also request the deletion of your account profile, provided that such deletion does not conflict with our legal obligation to maintain records of awarded medical credits for a minimum of 6 years.",
      ],
    },

    {
      id: "contact",
      number: "06.",
      title: "Contact Us",
      paragraphs: [],
      contact: {
        title: "TAI Helpline",
        description:
          "For inquiries regarding compliance, data portability, or to exercise your rights, please contact our dedicated DPO.",
        emailLabel: "privacy@texasairway.edu",
        emailValue: "privacy@texasairway.edu",
        phoneLabel: "+1 (512) 555-0199",
        phoneValue: "+15125550199",
      },
    },
  ],
};