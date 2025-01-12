"use client";

import { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBlogs, getFeaturedBlogs } from "../../actions/blogActions";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Image from "next/image";
import { motion } from "framer-motion";
import { BlogTypes } from "@/types/blog";
import Hero from "@/components/home/Hero";
import Featured from "@/components/home/Featured";
import About from "@/components/home/About";
import NewsLetter from "@/components/home/NewsLetter";

export default function Home() {

  return (
    <>
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Hero Section */}
        <Hero />

        {/* Featured Blogs Section */}
        <Featured />

        {/* About Section */}
        <About />

        {/* Newsletter Section */}
        <NewsLetter />
      </main>
    </>
  );
}
