'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover"
import { Skeleton } from "@/components/ui/skeleton"
import { getFeaturedBlogs } from "@/actions/blogActions"
import { BlogTypes } from "@/types/blog"

export default function Featured() {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogTypes[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const blogs = await getFeaturedBlogs(3)
      setFeaturedBlogs(blogs)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const featuresData = [
    {
      icon: (
        <svg className="shrink-0 mt-1 size-6 text-purple-600 dark:text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      title: "Cosmic Exploration",
      description: "Embark on mind-bending journeys through the cosmos with our expertly crafted articles.",
    },
    {
      icon: (
        <svg className="shrink-0 mt-1 size-6 text-purple-600 dark:text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Cutting-Edge Insights",
      description: "Stay ahead of the curve with our analysis of the latest breakthroughs in astrophysics and cosmology.",
    },
    {
      icon: (
        <svg className="shrink-0 mt-1 size-6 text-purple-600 dark:text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Interactive Learning",
      description: "Engage with our interactive simulations and visualizations to deepen your understanding of complex cosmic phenomena.",
    },
    {
      icon: (
        <svg className="shrink-0 mt-1 size-6 text-purple-600 dark:text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Community Discussions",
      description: "Join our vibrant community of space enthusiasts and engage in thought-provoking discussions about the universe.",
    },
  ]

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="aspect-w-16 aspect-h-7 mb-12">
        <DirectionAwareHover imageUrl="/featured-image.jpg">
          <p className="font-bold text-2xl text-white">Explore the Cosmos</p>
          <p className="font-normal text-lg text-white">Unravel the mysteries of the universe</p>
        </DirectionAwareHover>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-1">
          <h2 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
            Discover the Wonders of Space
          </h2>
          <p className="mt-2 md:mt-4 text-gray-500 dark:text-neutral-400">
            DarkWaves brings you captivating stories and insights from the far reaches of the cosmos. Our expert writers and researchers are dedicated to unraveling the mysteries of the universe.
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
            {featuresData.map((feature, index) => (
              <div key={index} className="flex gap-x-5">
                {feature.icon}
                <div className="grow">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Featured Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-1/3" />
                  </div>
                </div>
              ))
            : featuredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
                >
                  <Image
                    src={`/blog-image-${index + 1}.jpg`}
                    alt={blog.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {blog.content.substring(0, 100)}...
                    </p>
                    <Link href={`/blogs/${blog.id}`}>
                      <Button variant="outline">Read More</Button>
                    </Link>
                  </div>
                </motion.div>
              ))
          }
        </div>
        <div className="text-center mt-12">
          <Link href="/blogs">
            <Button size="lg">View All Blogs</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

