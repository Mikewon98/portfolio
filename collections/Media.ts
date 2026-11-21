import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // Images are public so the website can display them.
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image (used for accessibility and SEO)." },
    },
  ],
  upload: {
    // Stored on disk. In Docker this folder is a mounted volume (/app/media).
    staticDir: "media",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 432, position: "centre" },
      { name: "hero", width: 1600, height: undefined, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
  },
};
