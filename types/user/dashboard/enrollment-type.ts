export type Enrollment = {
    id: string;
    mode: "Live Workshop" | "Online Workshop";
    title: string;
    imageUrl: string;

    // Left card (live)
    dateTime?: string;
    location?: string;

    // Right card (online)
    room?: string;
    access?: string;

    ctaLabel: string;
    ctaHref: string;
    ctaIcon?: "syllabus" | "enter";
};