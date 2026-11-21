import type { CollectionConfig, FieldHook } from "payload";
import { revalidatePath } from "next/cache";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Fill the slug from the title when it is left empty. */
const formatSlug: FieldHook = ({ value, data }) => {
  if (typeof value === "string" && value.trim().length > 0) return slugify(value);
  if (typeof data?.title === "string") return slugify(data.title);
  return value;
};

/** Rebuild the cached pages that show blogs whenever a post changes. */
const revalidateBlogPages = (slug?: string | null) => {
  try {
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    if (slug) revalidatePath(`/blog/${slug}`);
  } catch {
    // revalidatePath throws outside a Next.js request (e.g. the seed script) – safe to ignore.
  }
};

export const Blogs: CollectionConfig = {
  slug: "blogs",
  labels: { singular: "Blog", plural: "Blogs" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "isFeatured", "_status", "updatedAt"],
    preview: (doc) => (doc?.slug ? `/blog/${doc.slug}` : null),
  },
  defaultSort: "-date",
  access: {
    // Public visitors only see published posts; logged-in admins see drafts too.
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
  },
  // Draft / Publish workflow: unpublished edits stay private until you click Publish.
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        revalidateBlogPages(doc?.slug);
        if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
          revalidateBlogPages(previousDoc.slug);
        }
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateBlogPages(doc?.slug);
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      unique: true,
      maxLength: 255,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      maxLength: 255,
      admin: {
        position: "sidebar",
        description: "URL part: /blog/<slug>. Leave empty to generate from the title.",
      },
      hooks: { beforeValidate: [formatSlug] },
    },
    {
      name: "date",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly", displayFormat: "MMM d, yyyy" },
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Show this post in “Featured Articles” on the home page.",
      },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      maxLength: 255,
    },
    {
      type: "row",
      fields: [
        {
          name: "thumbnail",
          type: "upload",
          relationTo: "media",
          admin: { description: "Card image on the blog list / home page." },
        },
        {
          name: "featuredImage",
          type: "upload",
          relationTo: "media",
          admin: { description: "Large banner on the post page." },
        },
      ],
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
};
