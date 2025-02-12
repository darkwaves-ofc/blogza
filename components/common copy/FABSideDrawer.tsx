"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export default function FabSideDrawer({
  sideDrawerItems,
  isLoggedIn
}: {
  sideDrawerItems: {
    label: string;
    href: string;
  }[];
  isLoggedIn:boolean
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="z-50" asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Quick access to important features
          </SheetDescription>
        </SheetHeader>
        <nav className="pt-6">
          <ul className="space-y-4 min-h-[calc(100vh-200px)]">
            {sideDrawerItems.map((d, i) => (
              <li key={i}>
                <Link href={d.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={toggleDrawer}
                  >
                    {d.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
          {isLoggedIn && (
            <div className="pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 "
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
