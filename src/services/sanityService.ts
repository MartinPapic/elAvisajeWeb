import { client } from '@/lib/sanity';
import { Event } from '@/models';
import { groq } from 'next-sanity';

// Mappers
const mapSanityEventToDomain = (raw: any): Event => {
  return {
    _id: raw._id,
    title: raw.title || 'Sin título',
    slug: raw.slug?.current || '',
    shortDescription: raw.shortDescription || '',
    description: raw.content || raw.description, // Fallback
    address: raw.address,
    dateRange: {
      start: raw.startDate || raw.dateRange?.start,
      end: raw.endDate || raw.dateRange?.end,
    },
    location: {
      lat: raw.location?.lat || 0,
      lng: raw.location?.lng || 0,
    },
    category: raw.category ? {
      title: raw.category.title,
      slug: raw.category.slug?.current,
      icon: raw.category.icon,
      description: raw.category.description,
      color: raw.category.color?.hex || raw.category.color,
    } : undefined,
    tags: raw.tags ? raw.tags.map((tag: any) => ({
      name: tag.name,
      slug: tag.slug?.current,
    })) : [],
    submittedBy: raw.submittedBy,
    submittedAt: raw.submittedAt
  };
};

// Queries
export const getEvents = async (): Promise<Event[]> => {
  // Only fetch PUBLISHED events (excludes drafts)
  const query = groq`*[_type == "event" && !(_id in path("drafts.**"))]{
    _id,
    title,
    slug,
    shortDescription,
    description,
    address,
    startDate,
    endDate,
    location,
    submittedBy,
    submittedAt,
    "category": category->{
      title,
      slug,
      icon,
      description,
      color
    },
    "tags": tags[]->{
      name,
      slug
    }
  }`;

  const rawEvents = await client.fetch(query);
  return rawEvents.map(mapSanityEventToDomain);
};

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  // Only fetch PUBLISHED event (excludes drafts)
  const query = groq`*[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    slug,
    shortDescription,
    description,
    address,
    startDate,
    endDate,
    location,
    submittedBy,
    submittedAt,
    "category": category->{
      title,
      slug,
      icon,
      description,
      color
    },
    "tags": tags[]->{
      name,
      slug
    }
  }`;

  const rawEvent = await client.fetch(query, { slug });
  return rawEvent ? mapSanityEventToDomain(rawEvent) : null;
};
