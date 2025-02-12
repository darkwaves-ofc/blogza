"use client";
import { cn, generateCapitalLetters, getUserImageByEmail } from "@/lib/utils";
// import { ExtendedUser } from "@/next-auth";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import ProfileMenu from "../ui/profile-menu";
import { Avatar } from "@radix-ui/themes";

// Define the type for the context
interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Define the type for the Sidebar props
interface SidebarProps {
  children: ReactNode;
  user: User;
}

export default function Sidebar({ children, user }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       sidebarRef.current &&
  //       !sidebarRef.current.contains(event.target as Node)
  //     ) {
  //       setExpanded(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [sidebarRef]);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "h-screen transition-width duration-300 text-nowrap z-50",
        expanded
          ? "w-full sm:w-3/6 md:w-60 lg:w-64"
          : "w-16 sm:w-16 md:w-16 lg:w-16"
      )}
    >
      <nav className="h-full flex flex-col bg-background border-r border-border shadow-sm">
        <div
          className={cn(
            "p-4 pb-2 flex items-center",
            expanded ? "justify-between" : ""
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex-row flex items-center gap-3 overflow-hidden transition-width duration-300",
              expanded ? "w-32" : "w-0"
            )}
          >
            {expanded && (
              <h2
                className={cn(
                  "text-base font-bold flex flex-row gap-3 items-center overflow-hidden transition-all duration-300 text-nowrap",
                  !expanded && "hidden"
                )}
              >
                <Image
                  src={"/placeholder.svg"}
                  alt="site logo"
                  width={50}
                  height={50}
                />
                <h1>Zyvlon</h1>
              </h2>
            )}
          </Link>

          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-card hover:bg-muted"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-[0.65rem] overflow-y-auto overflow-x-hidden">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-border flex p-3">
          {expanded ? (
            user.image ? (
              <Image
                src={user.image}
                alt=""
                width={40}
                height={40}
                className="rounded-md"
              />
            ) : (
              <Avatar
                fallback={generateCapitalLetters(user.name || "Dark Waves", 2)}
                title={user.name || "Dark Waves"}
              />
            )
          ) : (
            <ProfileMenu isAdmin>
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              ) : (
                <Avatar
                  fallback={generateCapitalLetters(
                    user.name || "Dark Waves",
                    2
                  )}
                  src={
                    getUserImageByEmail(user?.email || undefined)
                  }
                  title={user.name || "Dark Waves"}
                />
              )}
            </ProfileMenu>
          )}
          <div
            className={cn(
              "flex justify-between items-center overflow-hidden transition-all duration-300",
              expanded ? "w-52 ml-3" : "w-0"
            )}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-foreground">{user.name}</h4>
            </div>
            <ProfileMenu isAdmin >
              <MoreVertical className="text-muted-foreground" size={20} />
            </ProfileMenu>
          </div>
        </div>
      </nav>
    </aside>
  );
}

import { useContext } from "react";
import { usePathname } from "next/navigation";
import { User } from "next-auth";

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  path: string;
  alert?: boolean;
}

export function SidebarItem({ icon, text, alert, path }: SidebarItemProps) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar");
  }
  const pathname = usePathname();
  const getActivePath = (pathname: string, path: string) => {
    const fullPath = path ? `/${path}` : "/";
    return fullPath === pathname;
  };

  const active = getActivePath(pathname, path);
  const { expanded } = context;

  return (
    <Link
      href={"/" + path}
      className={cn(
        "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group",
        active
          ? "bg-gradient-to-tr from-foreground to-foreground text-background"
          : "hover:bg-muted text-foreground"
      )}
    >
      {icon}
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          expanded ? "w-52 ml-3" : "w-0 h-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-destructive/70 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={cn(
            "absolute left-full rounded-md px-2 py-1 ml-6 bg-muted text-primary text-sm invisible opacity-0 -translate-x-3 transition-all duration-300",
            "group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
          )}
        >
          {text}
        </div>
      )}
    </Link>
  );
}
