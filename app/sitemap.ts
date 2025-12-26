// import { BlogData } from "./types/blog";
// import { MetadataRoute } from "next";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseUrl = "https://michaelyze.com";

//   // Define your static pages
//   const routes = [
//     {
//       url: baseUrl,
//       lastModified: new Date(),
//       changeFrequency: "weekly" as const,
//       priority: 1.0,
//     },
//     {
//       url: `${baseUrl}/#projects`,
//       lastModified: new Date(),
//       changeFrequency: "monthly" as const,
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/#experience`,
//       lastModified: new Date(),
//       changeFrequency: "monthly" as const,
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/#contact`,
//       lastModified: new Date(),
//       changeFrequency: "yearly" as const,
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/blog`,
//       lastModified: new Date(),
//       changeFrequency: "weekly" as const,
//       priority: 0.9,
//     },
//   ];

//   // Handle API fetch failure gracefully during build
//   let blogPosts: MetadataRoute.Sitemap = [];

//   try {
//     if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
//       console.log("Skipping blog posts in sitemap - API URL not available");
//       return routes;
//     }

//     const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs`, {
//       signal: AbortSignal.timeout(5000),
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       console.warn("API returned non-OK status, skipping static generation");
//       return routes;
//     }

//     const blogs = await res.json();

//     if (blogs.data && blogs.data.length > 0) {
//       blogPosts = blogs.data.map((blog: BlogData) => ({
//         url: `${baseUrl}/blog/${blog.slug}`,
//         lastModified: new Date(blog.date),
//         changeFrequency: "monthly" as const,
//         priority: 0.7,
//       }));
//     }
//   } catch (error) {
//     console.warn(
//       "Failed to fetch blogs for sitemap, continuing with static routes only:",
//       error
//     );
//     // Return static routes only if blog fetch fails
//     return routes;
//   }

//   return [...routes, ...blogPosts];
// }

import { BlogData } from "./types/blog";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://michaelyze.com";

  // Define your static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#experience`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // Handle API fetch failure gracefully during build
  let blogPosts: MetadataRoute.Sitemap = [];

  try {
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      console.log("Skipping blog posts in sitemap - API URL not available");
      return routes;
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs`, {
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(
        `API returned status ${res.status}, skipping blog posts in sitemap`
      );
      return routes;
    }

    const blogs = await res.json();

    if (blogs.data && blogs.data.length > 0) {
      blogPosts = blogs.data.map((blog: BlogData) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn(
          "Request timeout fetching blogs for sitemap (10s exceeded)"
        );
      } else {
        console.warn("Failed to fetch blogs for sitemap:", error.message);
      }
    } else {
      console.warn("Unknown error fetching blogs for sitemap");
    }
    // Return static routes only if blog fetch fails
    return routes;
  }

  return [...routes, ...blogPosts];
}
