import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Info, 
  Image as ImageIcon, 
  Layout, 
  Newspaper, 
  ShoppingCart,
  Settings,
  Users,
  Bell,
  BarChart
} from 'lucide-react'

const settingsPages = [
  { title: 'Hero', description: 'Manage hero section content', href: '/dashboard/home_settings/hero', icon: Layout },
  { title: 'About', description: 'Edit about section', href: '/dashboard/home_settings/about', icon: Info },
  { title: 'Banner', description: 'Update banner images', href: '/dashboard/home_settings/banner', icon: ImageIcon },
  { title: 'Hot News', description: 'Manage hot news items', href: '/dashboard/home_settings/hotnews', icon: Newspaper },
  { title: 'New Seller', description: 'Configure New Seller section', href: '/dashboard/home_settings/newseller', icon: ShoppingCart },
]

const additionalFeatures = [
  { title: 'General Settings', description: 'Configure site-wide settings', href: '/dashboard/settings', icon: Settings },
  { title: 'User Management', description: 'Manage user accounts and permissions', href: '/dashboard/users', icon: Users },
  { title: 'Notifications', description: 'Set up and manage notifications', href: '/dashboard/notifications', icon: Bell },
  // { title: 'Analytics', description: 'View site analytics and reports', href: '/dashboard/analytics', icon: BarChart },
]

export default function HomeSettingsDashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Home Settings Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsPages.map((page) => (
          <Card key={page.href}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <page.icon className="mr-2 h-6 w-6" />
                {page.title}
              </CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={page.href} passHref>
                <Button className="w-full">Manage</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6">Additional Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {additionalFeatures.map((feature) => (
          <Card key={feature.href}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <feature.icon className="mr-2 h-6 w-6" />
                {feature.title}
              </CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={feature.href} passHref>
                <Button className="w-full">Manage</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}