import Header from './components/Header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getBlogs } from './actions/blogActions'

async function getFeaturedBlogs() {
  const blogs = await getBlogs()
  return blogs.slice(0, 3) // Return only the first 3 blogs as featured
}

export default async function Home() {
  const featuredBlogs = await getFeaturedBlogs()
console.log(featuredBlogs)
  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Welcome to DarkWaves
        </h1>
        <p className="text-center text-xl mb-12 text-gray-600 dark:text-gray-300">
          Explore the mysteries of the universe through our captivating blog posts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBlogs.map((blog) => (
            <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{blog.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.content.substring(0, 100)}...</p>
              <Link href={`/blogs/${blog.id}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/blogs">
            <Button>View All Blogs</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

