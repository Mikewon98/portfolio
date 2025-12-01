export interface Blog {
  id: number;
  documentId: string;
  Title: string;
  isFeatured: boolean;
  date: string;
  Summary: string;
  slug: string;
  Thumbnail: {
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
  };
}

export interface FeaturedBlogsProps {
  blogs: Blog[];
}

export interface Content {
  type: string;
  children: Array<{
    text: string;
    type: string;
  }>;
}

export interface BlogData {
  id: number;
  documentId: string;
  Title: string;
  date: string;
  Summary: string;
  Content: Content[];
  slug: string;
  FeaturedImage: {
    url: string;
    alternativeText: string | null;
    width: number;
    height: number;
  };
}
