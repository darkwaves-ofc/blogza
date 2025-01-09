import { getBlogById } from '../../actions/blogActions'
import Header from '../../components/Header'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Markdown from 'react-markdown'


interface BlogPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const blog = await getBlogById(params.id)

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  return {
    title: blog.title,
    description: blog.content.substring(0, 160),
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await getBlogById(params.id)

  if (!blog) {
    notFound()
  }

  return (
    <>
      <Header />
      <article className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">{blog.title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          <Markdown>{blog.markdown}</Markdown>
        </div>
      </article>
    </>
  )
}

