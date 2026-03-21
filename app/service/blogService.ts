import config from "./config";

type BlogResponse = {
  data: any[];
  meta: any;
};

const emptyBlogs: BlogResponse = { data: [], meta: {} };

const FETCH_TIMEOUT_MS = 12_000;
const REVALIDATE_SECONDS = 300;

export const fetchBlogs = async ({
  url,
}: {
  url: string;
}): Promise<BlogResponse> => {
  if (!config.api || config.api === "undefined") {
    console.warn("fetchBlogs: NEXT_PUBLIC_STRAPI_URL is not set");
    return emptyBlogs;
  }

  try {
    const response = await fetch(`${config.api}${url}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.warn(
        `fetchBlogs: ${response.status} for ${url} — using empty list for build/runtime`,
      );
      return emptyBlogs;
    }

    return await response.json();
  } catch (error) {
    console.warn("fetchBlogs failed, using empty list:", error);
    return emptyBlogs;
  }
};
