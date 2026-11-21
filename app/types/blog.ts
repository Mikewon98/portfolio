// Types are generated from the Payload collections by `npm run generate:types`.
import type { Blog, Media } from "@/payload-types";

export type { Blog, Media };

export interface FeaturedBlogsProps {
  blogs: Blog[];
}

/** Upload fields are an ID (depth 0) or the populated Media doc (depth >= 1). */
export function getMedia(value: Blog["thumbnail"]): Media | null {
  return value && typeof value === "object" ? value : null;
}
