import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  Bell,
  Calendar,
  Home,
  HomeIcon,
  Users,
  Megaphone,
  ClipboardList,
  School,
  Clock,
  Monitor,
  BookOpen,
  Expand,
  BarChart3,
  UserCircle2,
  Settings,
  LifeBuoy,
  UsersRound,
} from "lucide-react";
import Sidebar, { SidebarItem } from "../../components/common/SideBar";
import TopBar from "../../components/common/TopBar";
import Unworthy from "../../components/common/unworthy";
import { redirect } from "next/navigation";
import type { Viewport } from "next";
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};
import {
  getPermissions,
  getPages,
  Permissions,
  Pages,
  RawPages,
} from "@/lib/permission_manager";

import { Metadata } from "next";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import React from "react";
import { checkCurrentPage, currentPages } from "@/actions/user/info";
import { parseBoolean } from "@/lib/utils";
import { FaProductHunt } from "react-icons/fa";
import { currentSession } from "@/utils/auth";
import { headers } from "next/headers";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mahinda Rajapaksa College LMS Dashboard",
  description:
    "The dashboard for Mahinda Rajapaksa College LMS provides students, teachers, and administrators with access to classes, assignments, announcements, and more.",
  applicationCategory: "Educational",
  operatingSystem: "All",
  url: "https://lms.mrcm.lk/dashboard",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "LKR",
  },
};

export const metadata: Metadata = {
  title: "Dashboard | Mahinda Rajapaksa College LMS",
  description:
    "Access your personalized dashboard on the Mahinda Rajapaksa College LMS to manage classes, assignments, exams, and communication in a seamless and efficient way.",

  openGraph: {
    title: "Mahinda Rajapaksa College LMS - Dashboard",
    description:
      "The LMS Dashboard is your centralized hub for managing education activities, including assignments, results, events, and user interactions.",
    url: "https://lms.mrcm.lk/dashboard",
    images: [
      {
        url: `${process.env.APP_URL}/dashboard-og-image.png`,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mahinda Rajapaksa College LMS Dashboard",
    description:
      "Your personalized dashboard for managing education, assignments, results, and communication in Mahinda Rajapaksa College LMS.",
    images: [`${process.env.APP_URL}/dashboard-twitter-card-image.jpg`],
  },

  other: {
    "schema:WebApplication": JSON.stringify(jsonLd),
  },
};

const iconMapping: { [key: string]: JSX.Element } = {
  home: <Home />,
  announcements: <Megaphone />,
  assignments: <ClipboardList />,
  classes: <School />,
  events: <Calendar />,
  exams: <Clock />,
  home_settings: <Monitor />,
  lessons: <BookOpen />,
  notifications: <Bell />,
  parents: <Users />,
  popup: <Expand />,
  results: <BarChart3 />,
  roles: <UserCircle2 />,
  settings: <Settings />,
  support_tickets: <LifeBuoy />,
  users: <Users />,
  students: <UsersRound />,
  teachers: <Users />,
  parent: <UserCircle2 />,
  student: <UserCircle2 />,
  teacher: <UserCircle2 />,
};

export default async function ApplicationLayout(props: {
  children: React.ReactNode;
}) {
  const session = await currentSession();
  const { check } = await checkCurrentPage("dashboard");
  const pages = await currentPages();

  return (
    <NextAuthProvider session={session} type="private">
      {!session || !check || pages.error || !pages.pages ? (
        <Unworthy />
      ) : (
        <main className="flex flex-col h-screen max-h-screen overflow-y-hidden">
          <div className="flex flex-row flex-grow">
            <Sidebar user={session.user}>
              {
                // Dynamically map pages to sidebar items based on user permissions
                Array.from(pages.pages).map((page) => (
                  <SidebarItem
                    key={page}
                    icon={iconMapping[page] || <HomeIcon />} // Fallback to HomeIcon if no icon found
                    text={page.charAt(0).toUpperCase() + page.slice(1)} // Capitalize first letter
                    path={page === "dashboard" ? page : "dashboard/" + page}
                  />
                ))
              }
            </Sidebar>
            <div className="flex-grow">
              <TopBar />
              <div className="component_page overflow-y-auto max-h-dashPage">
                <div className="flex min-h-screen w-full flex-col bg-muted/40">
                  <div className="flex flex-col sm:gap-4 sm:py-4">
                    {props.children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </NextAuthProvider>
  );
}
