import { getBlogBySlug } from "@/app/service/blogService";
import BlogRichText from "@/app/components/BlogRichText";
import { getMedia } from "@/app/types/blog";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Rendered per request: posts are read from Postgres via Payload's Local API
// (a few ms). This avoids serving the empty snapshot taken during `next build`,
// when the database is not reachable.
export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const featuredImage = getMedia(blog.featuredImage) ?? getMedia(blog.thumbnail);

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>

        {featuredImage?.url && (
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <time dateTime={blog.date}>
                {new Date(blog.date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        </header>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 italic">
            {blog.summary}
          </p>
        </div>

        {blog.content && (
          <BlogRichText data={blog.content as unknown as SerializedEditorState} />
        )}

        <div className="my-12 border-t border-gray-200 dark:border-gray-700"></div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-green-400 dark:from-purple-600 dark:to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            View All Articles
          </Link>
        </div>
      </article>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return { title: "Blog Not Found" };

  const image = getMedia(blog.featuredImage) ?? getMedia(blog.thumbnail);

  return {
    title: blog.title,
    description: blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      type: "article",
      publishedTime: blog.date,
      ...(image?.url ? { images: [{ url: image.url }] } : {}),
    },
  };
}
