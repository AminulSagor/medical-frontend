export type NavbarSearchIdentityType = "BLOG" | "PRODUCT" | "WORKSHOP";

export interface NavbarSearchItem {
    id: string;
    identityType: NavbarSearchIdentityType;
    title: string;
    subtitle?: string | null;
    imageUrl?: string | null;
    authorName?: string | null;
    publishedAt?: string | null;
    readTimeMinutes?: number | null;
    readCount?: number | null;
}

export interface NavbarSearchCounts {
    workshops: number;
    products: number;
    blogs: number;
    total: number;
}

export interface NavbarSearchData {
    query: string;
    items: NavbarSearchItem[];
    counts: NavbarSearchCounts;
}

export interface NavbarSearchResponse {
    message: string;
    data: NavbarSearchData;
}