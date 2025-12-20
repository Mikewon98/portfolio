import { BlogData, Content, ListBlock } from "@/app/types/blog";
import { fetchBlogs } from "@/app/service/blogService";
import CopyDiv from "@/app/components/CopyDiv";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const blogData = await fetchBlogs({
      url: `/api/blogs?filters[slug][$eq]=${slug}&populate=*`,
    });

    if (!blogData.data || blogData.data.length === 0) {
      notFound();
    }

    const blog: BlogData = blogData.data[0];

    console.log(blogData);

    const renderContent = (content: Content[]) => {
      return content.map((block, index) => {
        // Render paragraphs
        if (block.type === "paragraph") {
          const text = block.children.map((child) => child.text).join("");
          const cleanText = text.replace(/<[^>]*>/g, "");
          return (
            <p
              key={index}
              className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg"
            >
              {cleanText}
            </p>
          );
        }

        // Render code blocks
        if (block.type === "code") {
          const code = block.children.map((child) => child.text).join("");
          const language = block.language || "plaintext";

          return (
            <div key={index} className="mb-6">
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
                <CopyDiv code={code} language={language} />

                <pre className="p-4 overflow-x-auto bg-gray-900">
                  <code className="text-sm text-gray-100 font-mono whitespace-pre">
                    {code}
                  </code>
                </pre>
              </div>
            </div>
          );
        }

        // Render headings
        if (block.type === "heading") {
          const text = block.children.map((child) => child.text).join("");
          const tag = `h${block.level}`;
          const headingClasses = {
            1: "text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-8",
            2: "text-3xl font-bold text-gray-900 dark:text-white mb-5 mt-8",
            3: "text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6",
            4: "text-xl font-bold text-gray-900 dark:text-white mb-4 mt-6",
            5: "text-lg font-bold text-gray-900 dark:text-white mb-3 mt-5",
            6: "text-base font-bold text-gray-900 dark:text-white mb-3 mt-4",
          };

          const className =
            headingClasses[block.level as keyof typeof headingClasses];

          return React.createElement(tag, { key: index, className }, text);
        }

        // Render lists

        // if (block.type === "list") {
        //   const renderList = (listBlock: ListBlock, key: number) => {
        //     const ListTag = listBlock.format === "ordered" ? "ol" : "ul";
        //     const indentClass = listBlock.indentLevel
        //       ? `ml-${listBlock.indentLevel * 6}`
        //       : "";
        //     const listClasses =
        //       listBlock.format === "ordered"
        //         ? `list-decimal list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300 ${indentClass}`
        //         : `list-disc list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300 ${indentClass}`;

        //     return (
        //       <ListTag key={key} className={listClasses}>
        //         {listBlock.children.map((item, itemIndex) => {
        //           // Handle list items
        //           if (item.type === "list-item") {
        //             return (
        //               <li key={itemIndex} className="leading-relaxed">
        //                 {item.children.map((child, childIndex) => {
        //                   if (child.type === "text") {
        //                     return (
        //                       <span
        //                         key={childIndex}
        //                         className={child.bold ? "font-bold" : ""}
        //                       >
        //                         {child.text}
        //                       </span>
        //                     );
        //                   }
        //                   if (child.type === "link") {
        //                     return (
        //                       <a
        //                         key={childIndex}
        //                         href={child.url}
        //                         className="text-blue-600 dark:text-blue-400 hover:underline"
        //                         target="_blank"
        //                         rel="noopener noreferrer"
        //                       >
        //                         {child.children.map((linkChild, linkIndex) => (
        //                           <span
        //                             key={linkIndex}
        //                             className={
        //                               linkChild.bold ? "font-bold" : ""
        //                             }
        //                           >
        //                             {linkChild.text}
        //                           </span>
        //                         ))}
        //                       </a>
        //                     );
        //                   }
        //                   return null;
        //                 })}
        //               </li>
        //             );
        //           }
        //           // Nested lists are rendered as separate elements, not inside <li>
        //           return null;
        //         })}
        //       </ListTag>
        //     );
        //   };

        //   // First render the main list
        //   const mainList = renderList(block, index);

        //   // Then check for nested lists in children and render them separately
        //   const nestedLists = block.children
        //     .filter((item) => item.type === "list")
        //     .map((nestedList, nestedIndex) =>
        //       renderList(
        //         nestedList as ListBlock,
        //         `${index}-nested-${nestedIndex}` as any
        //       )
        //     );

        //   return (
        //     <React.Fragment key={index}>
        //       {mainList}
        //       {nestedLists}
        //     </React.Fragment>
        //   );
        // }

        // This handles nested lists as siblings in the children array

        if (block.type === "list") {
          const ListTag = block.format === "ordered" ? "ol" : "ul";
          const listClasses =
            block.format === "ordered"
              ? "list-decimal list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300"
              : "list-disc list-inside mb-6 space-y-2 text-gray-700 dark:text-gray-300";

          const items = [];
          let i = 0;

          while (i < block.children.length) {
            const item = block.children[i];

            if (item.type === "list-item") {
              // Check if the next item is a nested list
              const nextItem = block.children[i + 1];
              const hasNestedList = nextItem && nextItem.type === "list";

              items.push(
                <li key={i} className="leading-relaxed">
                  {/* Render the list item content */}
                  {item.children.map((child, childIndex) => {
                    if (child.type === "text") {
                      return (
                        <span
                          key={childIndex}
                          className={child.bold ? "font-bold" : ""}
                        >
                          {child.text}
                        </span>
                      );
                    }
                    if (child.type === "link") {
                      return (
                        <a
                          key={childIndex}
                          href={child.url}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {child.children.map((linkChild, linkIndex) => (
                            <span
                              key={linkIndex}
                              className={linkChild.bold ? "font-bold" : ""}
                            >
                              {linkChild.text}
                            </span>
                          ))}
                        </a>
                      );
                    }
                    return null;
                  })}

                  {/* If next item is a nested list, render it here */}
                  {hasNestedList &&
                    (() => {
                      const nestedList = nextItem as ListBlock;
                      const NestedListTag =
                        nestedList.format === "ordered" ? "ol" : "ul";
                      const nestedListClasses =
                        nestedList.format === "ordered"
                          ? "list-decimal list-inside ml-6 mt-2 space-y-2 text-gray-700 dark:text-gray-300"
                          : "list-disc list-inside ml-6 mt-2 space-y-2 text-gray-700 dark:text-gray-300";

                      return (
                        <NestedListTag className={nestedListClasses}>
                          {nestedList.children.map(
                            (nestedItem, nestedIndex) => {
                              if (nestedItem.type === "list-item") {
                                return (
                                  <li
                                    key={nestedIndex}
                                    className="leading-relaxed"
                                  >
                                    {nestedItem.children.map(
                                      (child, childIndex) => {
                                        if (child.type === "text") {
                                          return (
                                            <span
                                              key={childIndex}
                                              className={
                                                child.bold ? "font-bold" : ""
                                              }
                                            >
                                              {child.text}
                                            </span>
                                          );
                                        }
                                        if (child.type === "link") {
                                          return (
                                            <a
                                              key={childIndex}
                                              href={child.url}
                                              className="text-blue-600 dark:text-blue-400 hover:underline"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {child.children.map(
                                                (linkChild, linkIndex) => (
                                                  <span
                                                    key={linkIndex}
                                                    className={
                                                      linkChild.bold
                                                        ? "font-bold"
                                                        : ""
                                                    }
                                                  >
                                                    {linkChild.text}
                                                  </span>
                                                )
                                              )}
                                            </a>
                                          );
                                        }
                                        return null;
                                      }
                                    )}
                                  </li>
                                );
                              }
                              return null;
                            }
                          )}
                        </NestedListTag>
                      );
                    })()}
                </li>
              );

              // Skip the next item if it was a nested list we just rendered
              i += hasNestedList ? 2 : 1;
            } else if (item.type === "list") {
              // This handles orphaned nested lists (shouldn't happen with your structure)
              i++;
            } else {
              i++;
            }
          }

          return (
            <ListTag key={index} className={listClasses}>
              {items}
            </ListTag>
          );
        }

        return null;
      });
    };

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

          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <Image
              src={`${blog.FeaturedImage.url}`}
              alt={blog.FeaturedImage.alternativeText || blog.Title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <header className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {blog.Title}
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
              {blog.Summary}
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {blog.Content && renderContent(blog.Content)}
          </div>

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
  } catch (error) {
    console.error("Error fetching blog:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const blogData = await fetchBlogs({
      url: `/api/blogs?filters[slug][$eq]=${slug}&populate=*`,
    });

    if (!blogData.data || blogData.data.length === 0) {
      return {
        title: "Blog Not Found",
      };
    }

    const blog: BlogData = blogData.data[0];

    return {
      title: blog.Title,
      description: blog.Summary,
    };
  } catch (error) {
    return {
      title: "Blog Not Found",
    };
  }
}
