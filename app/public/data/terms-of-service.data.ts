export type TermsOfServiceTOCItem = {
    id: string;
    number: string;
    label: string;
};

export type TermsOfServiceBullet = {
    title: string;
    text: string;
};

export type TermsOfServiceCallout = {
    title: string;
    text: string;
};

export type TermsOfServiceContact = {
    title: string;
    description: string;
    emailLabel: string;
    emailValue: string;
    phoneLabel: string;
    phoneValue: string;
};

export type TermsOfServiceSection = {
    id: string;
    number: string;
    title: string;
    paragraphs?: string[];
    bullets?: TermsOfServiceBullet[];
    callout?: TermsOfServiceCallout;
    contact?: TermsOfServiceContact;
};

export const TERMS_OF_SERVICE_DATA: {
    toc: TermsOfServiceTOCItem[];
    helpCard: {
        title: string;
        subtitle: string;
        ctaLabel: string;
    };
    sections: TermsOfServiceSection[];
} = {
    toc: [
        { id: "introduction", number: "01.", label: "Introduction" },
        { id: "acceptance", number: "02.", label: "Acceptance of Terms" },
        { id: "eligibility", number: "03.", label: "Eligibility and Accounts" },
        { id: "enrollment-payments", number: "04.", label: "Enrollment and Payments" },
        { id: "refunds-cancellations", number: "05.", label: "Refunds and Cancellations" },
        { id: "educational-use", number: "06.", label: "Educational Use" },
        { id: "acceptable-use", number: "07.", label: "Acceptable Use" },
        { id: "intellectual-property", number: "08.", label: "Intellectual Property" },
        { id: "disclaimers", number: "09.", label: "Disclaimers" },
        { id: "liability", number: "10.", label: "Limitation of Liability" },
        { id: "privacy", number: "11.", label: "Privacy and Data Use" },
        { id: "changes", number: "12.", label: "Changes to Terms" },
    ],

    helpCard: {
        title: "Need Help?",
        subtitle: "Our support and compliance team is available Mon-Fri.",
        ctaLabel: "Contact →",
    },

    sections: [
        {
            id: "introduction",
            number: "01.",
            title: "Introduction",
            paragraphs: [
                "These Terms of Service govern your access to and use of the Texas Airway Institute website, educational materials, courses, products, communications, and related services.",
                "By using our services, you agree to be bound by these Terms. If you do not agree, you should not access or use the platform.",
            ],
            callout: {
                title: "Important Notice",
                text: "These Terms are intended to provide a clear business and operational framework for use of our platform. They should be reviewed by legal counsel before production launch or commercial rollout.",
            },
        },
        {
            id: "acceptance",
            number: "02.",
            title: "Acceptance of Terms",
            paragraphs: [
                "By accessing the site, creating an account, enrolling in a course, purchasing a product, or interacting with any part of the platform, you confirm that you have read and accepted these Terms.",
                "If you are using the platform on behalf of an institution, clinic, hospital, employer, or other entity, you represent that you have authority to bind that entity to these Terms.",
            ],
        },
        {
            id: "eligibility",
            number: "03.",
            title: "Eligibility and Accounts",
            bullets: [
                {
                    title: "Professional Use.",
                    text: "Certain services may be intended for healthcare professionals, clinical educators, faculty, trainees, or institutional representatives.",
                },
                {
                    title: "Accurate Information.",
                    text: "You agree to provide accurate, current, and complete registration, profile, and payment information.",
                },
                {
                    title: "Account Security.",
                    text: "You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.",
                },
            ],
        },
        {
            id: "enrollment-payments",
            number: "04.",
            title: "Enrollment and Payments",
            paragraphs: [
                "Course seats, program participation, and product availability are subject to capacity, eligibility, and confirmation by Texas Airway Institute.",
                "Prices, fees, taxes, and other charges displayed on the platform may change at any time before checkout or final confirmation.",
            ],
            bullets: [
                {
                    title: "Payment Authorization.",
                    text: "When you submit a payment, you authorize us and our payment service providers to process the applicable charges.",
                },
                {
                    title: "Order Review.",
                    text: "We may review, delay, limit, or cancel an order or enrollment if pricing, stock, eligibility, or compliance issues are identified.",
                },
                {
                    title: "Availability.",
                    text: "Products and training seats are not guaranteed until confirmed by the system and, where applicable, validated by our team.",
                },
            ],
        },
        {
            id: "refunds-cancellations",
            number: "05.",
            title: "Refunds and Cancellations",
            paragraphs: [
                "Refund, cancellation, transfer, and rescheduling policies may vary depending on the course, event, product category, promotional terms, or institutional agreement.",
                "If a separate refund or cancellation policy applies to a specific product or program, that policy will govern in addition to these Terms.",
            ],
            bullets: [
                {
                    title: "Institute-Initiated Changes.",
                    text: "We may reschedule, substitute, or cancel training sessions or offerings due to safety, faculty, operational, or minimum-enrollment reasons.",
                },
                {
                    title: "User-Initiated Requests.",
                    text: "Cancellation or refund requests may be subject to deadlines, administrative review, non-refundable fees, or product condition requirements.",
                },
            ],
        },
        {
            id: "educational-use",
            number: "06.",
            title: "Educational Use and Professional Responsibility",
            paragraphs: [
                "Our educational content is designed to support professional development and clinical training. It is not a substitute for clinical judgment, supervision, institutional protocol, licensing requirements, or patient-specific decision-making.",
                "You remain solely responsible for how you apply any educational material, procedural knowledge, simulation content, or training outcomes in practice.",
            ],
        },
        {
            id: "acceptable-use",
            number: "07.",
            title: "Acceptable Use",
            bullets: [
                {
                    title: "No Misuse.",
                    text: "You may not use the platform for unlawful, fraudulent, abusive, misleading, or unauthorized purposes.",
                },
                {
                    title: "No Interference.",
                    text: "You may not disrupt, probe, reverse engineer, scrape, overload, or interfere with the operation or security of the platform.",
                },
                {
                    title: "Respectful Conduct.",
                    text: "You may not upload or transmit content that is defamatory, discriminatory, infringing, harmful, or otherwise inappropriate.",
                },
            ],
        },
        {
            id: "intellectual-property",
            number: "08.",
            title: "Intellectual Property",
            paragraphs: [
                "All site content, course materials, branding, graphics, documents, videos, training frameworks, and related assets are owned by Texas Airway Institute or its licensors unless otherwise stated.",
                "You may not reproduce, distribute, republish, sell, license, modify, or create derivative works from our materials except as expressly permitted in writing.",
            ],
        },
        {
            id: "disclaimers",
            number: "09.",
            title: "Disclaimers",
            paragraphs: [
                "The platform and all content, services, products, and materials are provided on an “as is” and “as available” basis to the fullest extent permitted by law.",
                "We do not guarantee uninterrupted availability, error-free operation, universal compatibility, or that every item, course, feature, or outcome will meet your expectations or institutional requirements.",
            ],
        },
        {
            id: "liability",
            number: "10.",
            title: "Limitation of Liability",
            paragraphs: [
                "To the maximum extent permitted by law, Texas Airway Institute and its affiliates, officers, instructors, staff, licensors, and service providers shall not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages arising out of or related to your use of the platform.",
                "Where liability cannot be excluded, our total aggregate liability will be limited to the amount you paid to us for the specific product or service giving rise to the claim, or one hundred U.S. dollars, whichever is greater.",
            ],
        },
        {
            id: "privacy",
            number: "11.",
            title: "Privacy and Data Use",
            paragraphs: [
                "Your use of the platform is also governed by our Privacy Policy, which explains how we collect, use, store, and protect personal and professional information.",
                "By using the platform, you acknowledge that your information may be processed in accordance with our Privacy Policy and related operational practices.",
            ],
        },
        {
            id: "changes",
            number: "12.",
            title: "Changes to Terms",
            paragraphs: [
                "We may update these Terms from time to time to reflect business, legal, technical, or operational changes.",
                "When updates are made, we may revise the effective or last-updated date and publish the updated Terms on the platform. Continued use after changes become effective constitutes acceptance of the revised Terms.",
            ],
        },
    ],
};