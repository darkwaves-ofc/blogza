"use server";

import prisma from "@/lib/prisma";

export async function getFeaturedBlogs(blogsCount: number) {
  const blogs = await getBlogs(blogsCount);
  return blogs.slice(0, blogsCount); // Return only the first 3 blogs as featured
}

export async function getBlogs(blogsCount?: number) {
  return await prisma.blog.findMany(
    blogsCount ? { take: blogsCount } : undefined
  );
}

export async function getBlogById(id: string) {
  return await prisma.blog.findUnique({
    where: { id },
  });
}

export async function createBlog(data: {
  title: string;
  content: string;
  markdown: string;
}) {
  return await prisma.blog.create({
    data,
  });
}

export async function updateBlog(
  id: string,
  data: { title: string; content: string; markdown: string }
) {
  return await prisma.blog.update({
    where: { id },
    data,
  });
}

export async function deleteBlog(id: string) {
  return await prisma.blog.delete({
    where: { id },
  });
}
