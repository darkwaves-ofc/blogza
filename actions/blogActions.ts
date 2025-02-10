"use server";

import prisma from "@/lib/prisma";
import { checkAdminAuth } from "./auth";

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
export async function getBlogs() {
  return await prisma.blog.findMany();
}

export async function getFeaturedBlogs(count: number) {
  return await prisma.blog.findMany({
    take: count,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getBlogById(id: string) {
  return await prisma.blog.findUnique({
    where: { id },
  });
}

const BlogSectionSchema = z.object({
  type: z.enum(['text', 'image', 'gallery', 'video', 'quote', 'link', 'button']),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  linkText: z.string().optional(),
  linkUrl: z.string().optional(),
  order: z.number(),
})

const BlogSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  description: z.string(),
  mainImage: z.string().url(),
  sections: z.array(BlogSectionSchema),
  published: z.boolean().default(false),
})

export async function createBlog(data: z.infer<typeof BlogSchema>) {
  try {
    const validated = BlogSchema.parse(data)
    
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: validated.slug },
    })

    if (existingBlog) {
      throw new Error('Slug already exists')
    }

    const blog = await prisma.blog.create({
      data: {
        ...validated,
        // authorId: userId,
        sections: {
          create: validated.sections.map((section) => ({
            ...section,
          })),
        },
      },
      include: {
        sections: true,
      },
    })

    revalidatePath(`/blog/${blog.slug}`)
    return { success: true, data: blog }
  } catch (error) {
    console.error('Blog creation error:', error)
    return { success: false, error: 'Failed to create blog' }
  }
}

export async function updateBlog(
  blogId: string,
  data: z.infer<typeof BlogSchema>,
  userId: string
) {
  try {
    const validated = BlogSchema.parse(data)
    
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: { sections: true },
    })

    if (!blog) {
      throw new Error('Blog not found')
    }

    if (blog.authorId !== userId) {
      throw new Error('Unauthorized')
    }

    // Delete existing sections
    await prisma.blogSection.deleteMany({
      where: { blogId },
    })

    // Update blog with new data
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        ...validated,
        sections: {
          create: validated.sections.map((section) => ({
            ...section,
          })),
        },
      },
      include: {
        sections: true,
      },
    })

    revalidatePath(`/blog/${updatedBlog.slug}`)
    return { success: true, data: updatedBlog }
  } catch (error) {
    console.error('Blog update error:', error)
    return { success: false, error: 'Failed to update blog' }
  }
}

export async function deleteBlog(blogId: string, userId: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    })

    if (!blog) {
      throw new Error('Blog not found')
    }

    if (blog.authorId !== userId) {
      throw new Error('Unauthorized')
    }

    await prisma.blog.delete({
      where: { id: blogId },
    })

    revalidatePath('/blog')
    return { success: true }
  } catch (error) {
    console.error('Blog deletion error:', error)
    return { success: false, error: 'Failed to delete blog' }
  }
}