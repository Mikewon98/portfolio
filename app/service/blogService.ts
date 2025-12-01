import config from "./config";

type BlogResponse = {
  data: any[];
  meta: any;
};

export const fetchBlogs = async ({
  url,
}: {
  url: string;
}): Promise<BlogResponse> => {
  const reqOptions: RequestInit = {
    // headers: {
    //   Authorization: `Bearer ${process.env.API_TOKEN}`,
    // },
    // cache: "no-store", /api/blogs
  };

  try {
    const response = await fetch(`${config.api}${url}`, reqOptions);

    if (response.status != 200) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
