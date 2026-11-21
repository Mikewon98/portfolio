/**
 * Seed / restore blog posts into Payload.
 *
 *   npm run seed
 *
 * - Idempotent: posts are matched by slug and updated instead of duplicated.
 * - Optionally creates the first admin user when SEED_ADMIN_EMAIL and
 *   SEED_ADMIN_PASSWORD are set in .env (nothing is hard-coded here).
 * - Post bodies are Markdown files in /seed, converted to Lexical rich text.
 *   ``` fenced code becomes a Code block (language after the backticks).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import config from "../payload.config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

type SeedPost = {
  file: string;
  title: string;
  slug: string;
  date: string;
  summary: string;
  isFeatured: boolean;
};

const posts: SeedPost[] = [
  {
    file: "vps-setup.md",
    title: "VPS Setup and Initial Configuration",
    slug: "vps-setup-and-initial-configuration",
    date: "2026-11-20",
    summary:
      "How I run this portfolio on a single Ubuntu VPS: hardened SSH, UFW, Docker, Traefik with automatic HTTPS, GitHub Actions + GHCR, Watchtower rolling deploys, and a self-hosted Payload CMS on Postgres.",
    isFeatured: true,
  },
];

async function seed() {
  const payload = await getPayload({ config });
  // Use the exact editor configured on Blogs.content (includes the Code block).
  const blogsCollection = payload.config.collections.find((c) => c.slug === "blogs");
  const contentField = blogsCollection?.fields.find(
    (f) => "name" in f && f.name === "content",
  );
  if (!contentField || contentField.type !== "richText") {
    throw new Error("Blogs.content rich text field not found");
  }
  const editorConfig = editorConfigFactory.fromField({ field: contentField });

  const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;
  if (SEED_ADMIN_EMAIL && SEED_ADMIN_PASSWORD) {
    const existing = await payload.count({ collection: "users" });
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: "users",
        data: { email: SEED_ADMIN_EMAIL, password: SEED_ADMIN_PASSWORD },
      });
      payload.logger.info(`Created admin user ${SEED_ADMIN_EMAIL}`);
    }
  }

  for (const post of posts) {
    const markdown = fs.readFileSync(path.resolve(dirname, "../seed", post.file), "utf8");
    const content = convertMarkdownToLexical({ editorConfig, markdown });

    const data = {
      title: post.title,
      slug: post.slug,
      // Noon UTC so the calendar day is the same in every timezone.
      date: new Date(`${post.date}T12:00:00.000Z`).toISOString(),
      summary: post.summary,
      isFeatured: post.isFeatured,
      content: content as never,
      _status: "published" as const,
    };

    const found = await payload.find({
      collection: "blogs",
      where: { slug: { equals: post.slug } },
      limit: 1,
      draft: true,
      overrideAccess: true,
    });

    if (found.docs[0]) {
      await payload.update({ collection: "blogs", id: found.docs[0].id, data });
      payload.logger.info(`Updated "${post.title}"`);
    } else {
      await payload.create({ collection: "blogs", data });
      payload.logger.info(`Created "${post.title}"`);
    }
  }
}

await seed();
process.exit(0);
