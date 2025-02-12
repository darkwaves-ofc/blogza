import { Button } from "@/components/ui/button";
import { Home, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="home-manager-header-actions flex flex-row gap-2">
            <Button>
              <Home className="h-3.5 w-3.5" />

              <Link href={"/"}>Home</Link>
            </Button>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
