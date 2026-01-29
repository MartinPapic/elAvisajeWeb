export interface GeoPoint {
    lat: number;
    lng: number;
}

export interface DateRange {
    start: string; // ISO date string
    end?: string; // ISO date string
}

export interface Tag {
    name: string;
    slug: string;
}

export interface Category {
    title: string;
    slug: string;
    icon?: string;
    description?: string;
    color?: string;
}

export interface SubmissionInfo {
    name?: string;
    email?: string;
    phone?: string;
    relation?: string;
}

export interface Event {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description?: any; // Rich text content (Portable Text)
    address?: string;
    dateRange: DateRange;
    location: GeoPoint;
    mainImage?: string; // URL
    category?: Category;
    tags?: Tag[];
    submittedBy?: SubmissionInfo;
    submittedAt?: string;
}

export interface Post {
    _id: string;
    title: string;
    slug: string;
    content: any; // Rich text content
    relatedEvent?: Event;
    publishedAt: string;
}
