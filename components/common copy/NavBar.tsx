"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User as NextAuthUser } from "next-auth";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  BookOpen,
  GraduationCap,
  BarChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { DEFAULT_AUTH_REDIRECT } from "@/routes";
import { cn, getUserImageByEmail } from "@/lib/utils";
import ProfileMenu from "../ui/profile-menu";

const NavBar = ({ user }: { user: NextAuthUser | undefined }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: Array<{
    title: string;
    href: string;
    icon: React.ElementType;
    isDropdown?: boolean;
    dropdownItems?: {
      title: string;
      href: string;
      description?: string;
    }[];
  }> = [
    { title: "Dashboard", href: "/dashboard", icon: BarChart },
    {
      title: "Courses",
      href: "/courses",
      icon: BookOpen,
      isDropdown: true,
      dropdownItems: [
        {
          title: "All Courses",
          href: "/courses",
          description: "Browse all available courses",
        },
        {
          title: "My Courses",
          href: "/courses/my-courses",
          description: "View your enrolled courses",
        },
        {
          title: "Course Calendar",
          href: "/courses/calendar",
          description: "See your course schedule",
        },
      ],
    },
    { title: "Resources", href: "/resources", icon: GraduationCap },
    { title: "Community", href: "/community", icon: User },
  ];

  const AuthRedirect =
    DEFAULT_AUTH_REDIRECT + (pathname ? "?callbackUrl=" + pathname : "");

  return (
    <header className="w-full fixed top-0 left-0 z-50 shadow-sm">
      <nav
        className={cn(
          "container mx-auto px-4 py-4 transition-all duration-300 ease-in-out after:opacity-100 after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-white/10 after:transition-opacity after:duration-300 after:ease-in-out",
          hasScrolled ? "after:opacity-100" : "md:after:opacity-0"
        )}
      >
        <div
          className={`absolute top-0 left-0 w-full h-full -z-20 transition-all duration-300 ease-in-out opacity-100 backdrop-blur-md bg-[#000000b6] ${
            hasScrolled
              ? "opacity-100 backdrop-blur-md bg-[#0000004b]"
              : "md:opacity-0 md:blur-none md:bg-transparent"
          } before:absolute before:w-full before:h-full before:bg-gradient-to-b before:from-white/[0.09] before:to-white/[0.001]`}
        ></div>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            EduLMS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6">
            {navLinks.map((link) => (
              <NavigationMenu key={link.title}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    {link.isDropdown ? (
                      <NavigationMenuTrigger
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                          pathname === link.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        <link.icon className="w-4 h-4 mr-2 inline-block" />
                        {link.title}
                      </NavigationMenuTrigger>
                    ) : (
                      <Link href={link.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={`text-sm font-medium transition-colors hover:text-primary ${
                            pathname === link.href
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          <link.icon className="w-4 h-4 mr-2 inline-block" />
                          {link.title}
                        </NavigationMenuLink>
                      </Link>
                    )}
                    {link.isDropdown && link.dropdownItems && (
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {link.dropdownItems.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {item.title}
                                  </div>
                                  {item.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {item.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <Link href={"/user"}>
                <ProfileMenu isAdmin={false} user={user}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getUserImageByEmail(user?.email || undefined)}
                      alt={user.name || ""}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </ProfileMenu>
              </Link>
            ) : (
              <Link href={AuthRedirect}>
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 space-y-2"
            >
              {navLinks.map((link) => (
                <div key={link.title}>
                  {link.isDropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-primary">
                        <span className="flex items-center">
                          <link.icon className="w-4 h-4 mr-2" />
                          {link.title}
                        </span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {link.dropdownItems?.map((item) => (
                          <DropdownMenuItem key={item.title}>
                            <Link href={item.href} className="w-full">
                              {item.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={link.href}
                      className="flex items-center py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default NavBar;
