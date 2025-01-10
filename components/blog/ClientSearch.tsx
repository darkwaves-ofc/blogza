"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogTypes } from "@/types/blog";
import Markdown from 'react-markdown'


export default function ClientSearch({ blogs }: { blogs: BlogTypes[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search blogs..."
          className="max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              {blog.title}
            </h2>
            <div className="text-gray-600 md-preview dark:text-gray-300 mb-4 prose dark:prose-invert">
              <Markdown>{blog.markdown.substring(0, 150)}</Markdown>
              {/* {blog.markdown.substring(0, 150)}... */}
            </div>
            <Link href={`/blogs/${blog.id}`}>
              <Button variant="outline">Read More</Button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
