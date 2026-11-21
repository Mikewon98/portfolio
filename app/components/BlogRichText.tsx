import type { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  type JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import CopyDiv from "./CopyDiv";

type CodeBlockFields = { blockType: "Code"; code?: string; language?: string };
type NodeTypes = DefaultNodeTypes | SerializedBlockNode<CodeBlockFields>;

const converters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    // Code blocks inserted in the editor ("+" → Code) or ``` fences in markdown.
    Code: ({ node }) => {
      const code = node.fields.code ?? "";
      const language = node.fields.language || "plaintext";
      return (
        <div className="mb-6 not-prose">
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
    },
  },
  // Images inserted inside the post body.
  upload: ({ node }) => {
    const doc = node.value;
    if (!doc || typeof doc !== "object" || !("url" in doc) || !doc.url) return null;
    const media = doc as { url: string; alt?: string; width?: number; height?: number };
    return (
      <Image
        src={media.url}
        alt={media.alt ?? ""}
        width={media.width ?? 1200}
        height={media.height ?? 675}
        className="rounded-xl my-8 w-full h-auto"
      />
    );
  },
});

export default function BlogRichText({ data }: { data: SerializedEditorState }) {
  return <RichText data={data} converters={converters} className="blog-content" />;
}
