// Base content child types
interface TextChild {
  text: string;
  type: "text";
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
}

interface LinkChild {
  type: "link";
  text?: string;
  url: string;
  children: TextChild[];
}

type ContentChild = TextChild | LinkChild;

// Content block types
interface ParagraphBlock {
  type: "paragraph";
  children: ContentChild[];
}

interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: TextChild[];
}

interface CodeBlock {
  type: "code";
  language?: string;
  children: TextChild[];
}

interface ListItemBlock {
  type: "list-item";
  text?: string;
  children: ContentChild[];
}

interface ListBlock {
  text?: string;
  type: "list";
  format: "ordered" | "unordered";
  children: (ListItemBlock | ListBlock)[];
  indentLevel?: number;
}

export type Content = ParagraphBlock | HeadingBlock | CodeBlock | ListBlock;

// Image format types
interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

interface ImageFormats {
  large?: ImageFormat;
  small?: ImageFormat;
  medium?: ImageFormat;
  thumbnail?: ImageFormat;
}

// Image/Media type
interface MediaFile {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: ImageFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Blog data type
export interface BlogData {
  id: number;
  documentId: string;
  Title: string;
  date: string;
  Summary: string;
  isFeatured: boolean;
  Content: Content[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Thumbnail: MediaFile;
  FeaturedImage: MediaFile;
}

// Pagination metadata
interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface Meta {
  pagination: PaginationMeta;
}

// API response type
export interface BlogResponse {
  data: BlogData[];
  meta: Meta;
}

// Single blog response (for detail page)
export interface SingleBlogResponse {
  data: BlogData;
  meta: Meta;
}

// export interface Blog {
//   id: number;
//   documentId: string;
//   Title: string;
//   isFeatured: boolean;
//   date: string;
//   Summary: string;
//   slug: string;
//   Thumbnail: {
//     url: string;
//     alternativeText: string | null;
//     width: number;
//     height: number;
//   };
// }

// export interface FeaturedBlogsProps {
//   blogs: Blog[];
// }

// export interface Content {
//   type: string;
//   language?: string;
//   level?: string;
//   format?: string;
//   children: Array<{
//     text: string;
//     type: string;
//   }>;
// }

// export interface BlogData {
//   id: number;
//   documentId: string;
//   Title: string;
//   date: string;
//   Summary: string;
//   Content: Content[];
//   slug: string;
//   FeaturedImage: {
//     url: string;
//     alternativeText: string | null;
//     width: number;
//     height: number;
//   };
// }
