import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  BlocksFeature,
  CodeBlock,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Blogs } from "./collections/Blogs";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { migrations } from "./migrations/index";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " | Michaelyze CMS",
    },
  },
  collections: [Blogs, Media, Users],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Code blocks with language selection, rendered with a copy button on the site.
      BlocksFeature({
        blocks: [
          CodeBlock({
            defaultLanguage: "ts",
            languages: {
              ts: "TypeScript",
              tsx: "TSX",
              js: "JavaScript",
              bash: "Bash",
              shell: "Shell",
              json: "JSON",
              yaml: "YAML",
              dockerfile: "Dockerfile",
              go: "Go",
              python: "Python",
              sql: "SQL",
              css: "CSS",
              html: "HTML",
              plaintext: "Plain text",
            },
          }),
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    // Only used in dev; production schema changes go through migrations.
    push: process.env.NODE_ENV !== "production",
    // Run pending migrations automatically when the production server boots.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
});
