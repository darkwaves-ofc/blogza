"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "../../components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../actions/blogActions";
import { BlogTypes } from "@/types/blog";
import { checkAdminAuth } from "@/app/actions/auth";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<(BlogTypes & { id: string })[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await checkAdminAuth();
      if (!response.success || !response.isAuthenticated) {
        router.push("/admin/login");
      }
    };
    checkAuth();
    fetchBlogs();
  }, [router]);

  async function fetchBlogs() {
    const data = await getBlogs();
    setBlogs(data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateBlog(editingId, { title, content, markdown });
    } else {
      await createBlog({ title, content, markdown });
    }
    setTitle("");
    setContent("");
    setMarkdown("");
    setEditingId(null);
    fetchBlogs();
  };

  const handleEdit = (blog: BlogTypes & { id: string }) => {
    setTitle(blog.title);
    setContent(blog.content);
    setMarkdown(blog.markdown);
    setEditingId(blog.id);
  };

  const handleDelete = async (id: string) => {
    await deleteBlog(id);
    fetchBlogs();
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Admin Dashboard
        </h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <Input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
            required
          />
          <div className="mb-4">
            <MDEditor
              value={markdown}
              onChange={(value) => setMarkdown(value || "")}
              preview="edit"
            />
          </div>
          <Input
            type="text"
            placeholder="Short content (for previews)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4"
            required
          />
          <Button type="submit">{editingId ? "Update" : "Create"} Blog</Button>
        </form>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {blog.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {blog.content.substring(0, 100)}...
              </p>
              <div className="space-x-2">
                <Button onClick={() => handleEdit(blog)} variant="outline">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(blog.id)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
