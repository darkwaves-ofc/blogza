'use client'

import { useState, useEffect } from 'react';
import Header from "./components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBlogs, getFeaturedBlogs } from "./actions/blogActions";
import LoadingSpinner from "./components/LoadingSpinner";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const blogs = await getFeaturedBlogs(3);
      setFeaturedBlogs(blogs);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-center text-white">
          <Image
            src="/hero-background.jpg"
            alt="Space background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="z-10 px-4">
            <motion.h1 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              Welcome to DarkWaves
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8"
            >
              Explore the mysteries of the universe through our captivating blog posts.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/blogs">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Start Exploring
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Featured Blogs Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((blog, index) => (
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
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/blogs">
                <Button size="lg">View All Blogs</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <Image
                  src="/about-image.jpg"
                  alt="About DarkWaves"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                  About DarkWaves
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  DarkWaves is your portal to the enigmatic and awe-inspiring wonders of the cosmos. Our passionate team of writers and researchers are dedicated to unraveling the mysteries of the universe, from the depths of black holes to the farthest reaches of space.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Join us on this cosmic journey as we explore cutting-edge scientific discoveries, delve into theoretical physics, and ponder the philosophical implications of our vast and mysterious universe.
                </p>
                <Link href="/about">
                  <Button variant="outline">Learn More About Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-purple-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Updated with Cosmic Insights
            </h2>
            <p className="text-xl mb-8">
              Subscribe to our newsletter and never miss an update on the latest cosmic discoveries.
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-900"
                />
                <Button type="submit" className="rounded-l-none bg-purple-800 hover:bg-purple-900">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
