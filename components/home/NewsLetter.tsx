'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle newsletter subscription logic here
    console.log('Subscribed with email:', email)
    setEmail('')
  }

  return (
    <div className="relative overflow-hidden bg-purple-700 dark:bg-purple-900">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-white dark:text-purple-100"
          >
            Stay Updated with Cosmic Insights
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-white/80 dark:text-purple-200"
          >
            Subscribe to our newsletter and never miss an update on the latest cosmic discoveries.
          </motion.p>

          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form onSubmit={handleSubmit}>
              <div className="relative z-10 flex gap-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-purple-500/20 dark:bg-purple-800 dark:border-purple-700 dark:shadow-purple-900/20">
                <div className="w-full">
                  <label htmlFor="hs-search-article-1" className="block text-sm text-gray-700 font-medium dark:text-white">
                    <span className="sr-only">Enter your email</span>
                  </label>
                  <input
                    type="email"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-purple-500 focus:ring-purple-500 dark:bg-purple-800 dark:border-transparent dark:text-purple-100 dark:placeholder-purple-300"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-[46px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  </Button>
                </div>
              </div>
            </form>

            {/* SVG Element */}
            <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
              <svg className="w-16 h-auto text-purple-400" width="121" height="135" viewBox="0 0 121 135" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                <path d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
                <path d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
              </svg>
            </div>
            {/* End SVG Element */}

            {/* SVG Element */}
            <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
              <svg className="w-40 h-auto text-purple-300" width="347" height="188" viewBox="0 0 347 188" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
              </svg>
            </div>
            {/* End SVG Element */}
          </div>

          <div className="mt-10 sm:mt-20">
            <a className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-purple-200 bg-white text-purple-800 shadow-sm hover:bg-purple-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-purple-700 dark:border-purple-600 dark:text-purple-100 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-purple-600" href="#">
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Cosmic Discoveries
            </a>
            <a className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-purple-200 bg-white text-purple-800 shadow-sm hover:bg-purple-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-purple-700 dark:border-purple-600 dark:text-purple-100 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-purple-600" href="#">
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              Space Exploration
            </a>
            <a className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-purple-200 bg-white text-purple-800 shadow-sm hover:bg-purple-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-purple-700 dark:border-purple-600 dark:text-purple-100 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-purple-600" href="#">
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              Astrophysics
            </a>
            <a className="m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-purple-200 bg-white text-purple-800 shadow-sm hover:bg-purple-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-purple-700 dark:border-purple-600 dark:text-purple-100 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-purple-600" href="#">
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              Exoplanets
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

