import Link from 'next/link'
import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          DarkWaves
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/blogs" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            All Blogs
          </Link>
          <Button variant="ghost" size="icon">
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </nav>
    </header>
  )
}

