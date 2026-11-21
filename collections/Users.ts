import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    // Email + password are added automatically by `auth: true`.
    {
      name: "name",
      type: "text",
    },
  ],
};
