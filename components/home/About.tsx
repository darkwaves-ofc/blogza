'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

export default function About() {
  const [activeTab, setActiveTab] = useState('cosmic-journey')

  const tabs = [
    {
      id: 'cosmic-journey',
      title: 'Cosmic Journey',
      description: 'Explore the mysteries of the universe through our captivating blog posts.',
      icon: (
        <svg className="size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
    },
    {
      id: 'cutting-edge',
      title: 'Cutting-Edge Research',
      description: 'Stay updated with the latest scientific discoveries and theoretical physics.',
      icon: (
        <svg className="size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: 'philosophical',
      title: 'Philosophical Implications',
      description: 'Ponder the deeper questions about our existence and the nature of reality.',
      icon: (
        <svg className="size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto bg-gray-100 dark:bg-gray-900">
      <nav className="max-w-6xl mx-auto grid sm:flex sm:gap-x-4 gap-y-px sm:gap-y-0" aria-label="Tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent w-full flex flex-col text-start hover:bg-gray-200 p-3 md:p-5 rounded-xl dark:hs-tab-active:bg-neutral-800 dark:hover:bg-neutral-700 ${
              activeTab === tab.id ? 'bg-white shadow-md dark:bg-neutral-800' : ''
            }`}
            id={`tabs-with-card-item-${tab.id}`}
            data-hs-tab={`#tabs-with-card-${tab.id}`}
            aria-controls={`tabs-with-card-${tab.id}`}
            role="tab"
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="flex">
              <span className={`${activeTab === tab.id ? 'text-purple-600 dark:text-purple-500' : 'text-gray-800 dark:text-neutral-200'}`}>
                {tab.icon}
              </span>
            </span>
            <span className="mt-5">
              <span className={`block font-semibold ${activeTab === tab.id ? 'text-purple-600 dark:text-purple-500' : 'text-gray-800 dark:text-neutral-200'}`}>{tab.title}</span>
              <span className="hidden lg:block mt-2 text-gray-600 dark:text-neutral-400">{tab.description}</span>
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-12 md:mt-16">
        <div id={`tabs-with-card-${activeTab}`} role="tabpanel" aria-labelledby={`tabs-with-card-item-${activeTab}`}>
          <div className="max-w-[1140px] lg:pb-32 relative">
            <figure className="hidden absolute bottom-0 start-0 z-[2] max-w-full w-60 h-auto mb-20 ms-20 lg:block">
              <div className="p-1.5 bg-gray-100 rounded-3xl shadow-[0_2.75rem_5.5rem_-3.5rem_rgb(45_55_75_/_20%),_0_2rem_4rem_-2rem_rgb(45_55_75_/_30%),_inset_0_-0.1875rem_0.3125rem_0_rgb(45_55_75_/_20%)] dark:bg-neutral-700 dark:shadow-[0_2.75rem_5.5rem_-3.5rem_rgb(0_0_0_/_20%),_0_2rem_4rem_-2rem_rgb(0_0_0_/_30%),_inset_0_-0.1875rem_0.3125rem_0_rgb(0_0_0_/_20%)]">
                <Image
                  src="/landing/about-small.png"
                  alt="DarkWaves feature"
                  width={240}
                  height={400}
                  className="max-w-full rounded-[1.25rem] h-auto"
                />
              </div>
            </figure>

            <figure className="ms-auto me-20 relative z-[1] max-w-full w-[50rem] h-auto rounded-b-lg">
              <div className="relative flex items-center max-w-[50rem] bg-white border-b border-gray-100 rounded-t-lg py-2 px-24 dark:bg-neutral-800 dark:border-neutral-700">
                <div className="flex gap-x-1 absolute top-2/4 start-4 -translate-y-1">
                  <span className="size-2 bg-gray-200 rounded-full dark:bg-neutral-700"></span>
                  <span className="size-2 bg-gray-200 rounded-full dark:bg-neutral-700"></span>
                  <span className="size-2 bg-gray-200 rounded-full dark:bg-neutral-700"></span>
                </div>
                <div className="flex justify-center items-center size-full bg-gray-200 text-[.25rem] text-gray-800 rounded-sm sm:text-[.5rem] dark:bg-neutral-700 dark:text-neutral-200">www.darkwaves.blog</div>
              </div>

              <div className="bg-gray-800 rounded-b-lg">
                <Image
                  src="/landing/about.png"
                  alt="About DarkWaves"
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-b-lg"
                />
              </div>
            </figure>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">About DarkWaves</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            DarkWaves is your portal to the enigmatic and awe-inspiring wonders of the cosmos. Our passionate team of writers and researchers are dedicated to unraveling the mysteries of the universe, from the depths of black holes to the farthest reaches of space.
          </p>
          <Link href="/about">
            <Button variant="outline">Learn More About Us</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

