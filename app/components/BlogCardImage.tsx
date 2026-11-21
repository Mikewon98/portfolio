import Image from "next/image";
import type { Blog } from "../types/blog";
import { getMedia } from "../types/blog";

/** Card image for a post, or a branded gradient when no thumbnail was uploaded. */
export default function BlogCardImage({ blog }: { blog: Blog }) {
  const image = getMedia(blog.thumbnail) ?? getMedia(blog.featuredImage);

  if (image?.url) {
    return (
      <Image
        src={image.url}
        alt={image.alt || blog.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover group-hover:scale-110 transition-transform duration-300"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 bg-linear-to-br from-green-600 to-green-400 dark:from-purple-700 dark:to-purple-500 group-hover:scale-110 transition-transform duration-300">
      <span className="text-white text-xl font-bold text-center line-clamp-3">
        {blog.title}
      </span>
    </div>
  );
}
