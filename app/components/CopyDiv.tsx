"use client";

import { Copy } from "lucide-react";

const CopyDiv = ({ language, code }: { language: string; code: string }) => {
  return (
    <div className=" flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
      <span className="text-xs font-medium text-gray-400 uppercase">
        {language}
      </span>

      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(code)}
        className=" right-3 top-2 inline-flex items-center gap-2 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs font-medium rounded"
        aria-label="Copy code"
      >
        <Copy className="w-4" />
      </button>
    </div>
  );
};

export default CopyDiv;
