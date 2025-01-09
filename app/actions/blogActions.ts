'use server'

import prisma from '@/lib/prisma'

export async function getBlogs() {
  return await prisma.blog.findMany()
}

export async function getFeaturedBlogs(count: number) {
  return await prisma.blog.findMany({
    take: count,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getBlogById(id: string) {
  return await prisma.blog.findUnique({
    where: { id },
  })
}

export async function createBlog(data: { title: string; content: string; markdown: string }) {
  return await prisma.blog.create({
    data,
  })
}

export async function updateBlog(id: string, data: { title: string; content: string; markdown: string }) {
  return await prisma.blog.update({
    where: { id },
    data,
  })
}

export async function deleteBlog(id: string) {
  return await prisma.blog.delete({
    where: { id },
  })
}

