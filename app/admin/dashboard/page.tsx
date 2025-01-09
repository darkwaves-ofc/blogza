'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../actions/blogActions'

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
    fetchBlogs()
  }, [router])

  async function fetchBlogs() {
    const data = await getBlogs()
    setBlogs(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await updateBlog(editingId, { title, content })
    } else {
      await createBlog({ title, content })
    }
    setTitle('')
    setContent('')
    setEditingId(null)
    fetchBlogs()
  }

  const handleEdit = (blog) => {
    setTitle(blog.title)
    setContent(blog.content)
    setEditingId(blog.id)
  }

  const handleDelete = async (id) => {
    await deleteBlog(id)
    fetchBlogs()
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Admin Dashboard</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <Input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
            required
          />
          <Textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4"
            required
          />
          <Button type="submit">{editingId ? 'Update' : 'Create'} Blog</Button>
        </form>
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{blog.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.content.substring(0, 100)}...</p>
              <div className="space-x-2">
                <Button onClick={() => handleEdit(blog)} variant="outline">Edit</Button>
                <Button onClick={() => handleDelete(blog.id)} variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

