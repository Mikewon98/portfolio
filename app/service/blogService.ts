import config from "@payload-config";
import { getPayload, type Where } from "payload";
import type { Blog } from "../types/blog";

/**
 * Blog data comes straight from Payload's Local API (same process, no HTTP).
 * Every function swallows errors and returns an empty result so that
 * `next build` (where the database is not reachable) and DB hiccups never
 * crash the site – the pages just show "no posts" until the next revalidation.
 */

const published: Where = { _status: { equals: "published" } };

export async function getBlogs({
  featured,
  limit = 100,
}: { featured?: boolean; limit?: number } = {}): Promise<Blog[]> {
  try {
    const payload = await getPayload({ config });
    const where: Where = featured
      ? { and: [published, { isFeatured: { equals: true } }] }
      : published;

    const result = await payload.find({
      collection: "blogs",
      where,
      sort: "-date",
      depth: 1,
      limit,
    });
    return result.docs;
  } catch (error) {
    console.warn("getBlogs failed, using empty list:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "blogs",
      where: { and: [published, { slug: { equals: slug } }] },
      depth: 1,
      limit: 1,
    });
    return result.docs[0] ?? null;
  } catch (error) {
    console.warn(`getBlogBySlug(${slug}) failed:`, error);
    return null;
  }
}
