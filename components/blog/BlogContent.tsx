"use client";

import Markdown from "react-markdown";
export default function BlogContent({ markdown }: { markdown: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none md-preview">
      <Markdown>{markdown}</Markdown>
    </div>
  );
}
