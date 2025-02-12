"use client"
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function BackClientButton() {
    const router = useRouter();
    return (
        <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Go Back
      </Button>
    );
}