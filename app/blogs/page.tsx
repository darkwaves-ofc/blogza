import { getBlogs } from '../actions/blogActions'
import Header from '../components/Header'
import ClientSearch from './ClientSearch'

export default async function AllBlogs() {
  const blogs = await getBlogs()

  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">All Blogs</h1>
        <ClientSearch blogs={blogs} />
      </div>
    </>
  )
}

