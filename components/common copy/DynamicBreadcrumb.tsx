"use client"
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DynamicBreadcrumb: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname()
  const currentPath = pathname;

  // Split the current path by slashes and filter out empty values
  const pathSegments = currentPath.split("/").filter(Boolean);

  // Build an array of paths for breadcrumb links
  const generateBreadcrumbItems = () => {
    return pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const isLastItem = index === pathSegments.length - 1;

      return (
        <BreadcrumbItem key={href}>
          {isLastItem ? (
            <BreadcrumbPage>{segment.replace(/-/g, " ")}</BreadcrumbPage>
          ) : (
            <>
              <BreadcrumbLink asChild>
                <Link href={href}>
                  {segment.replace(/-/g, " ").charAt(0).toUpperCase() +
                    segment.slice(1)}
                </Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </>
          )}
        </BreadcrumbItem>
      );
    });
  };

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {/* Generate Breadcrumb Items Dynamically */}
        {generateBreadcrumbItems()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
