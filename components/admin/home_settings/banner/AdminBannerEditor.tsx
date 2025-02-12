"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContentInfoSuccessType } from "@/types/pageContent";
import ImageUploadDialog from "@/components/common/ImageUploadDialog";
import { updatePageContent } from "@/actions/pageContent/update";
import { createPageContent } from "@/actions/pageContent/create";
import { useHomeSettings } from "../use_home_settings";

interface AdminBannerPreviewProps {
  _pageId?: string;
  page: {
    path: string;
    section: string;
  };
  initialImages?: PageContentInfoSuccessType["files"];
}

export default function AdminBannerEditor({
  _pageId,
  page = {
    path: "home",
    section: "banner",
  },
  initialImages,
}: AdminBannerPreviewProps) {
  const {
    loading,
    title,
    setTitle,
    content,
    setContent,
    images,
    setImages,
    handleSaveChanges,
  } = useHomeSettings({
    _pageId,
    page,
    initialImages,
  });

  return (
    <div className="">
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle>Banner Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[450px] mx-4">
            {images.map((d, i) => (
              <Image
                src={d.link}
                key={i}
                alt="Hero Background"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                priority
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Change Banner Image</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Banner Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <ImageUploadDialog
                onSelectImages={(e) => {
                  setImages(
                    e.map((d) => ({
                      token: d ? d.token : "",
                      private: false,
                      link: d ? d.url : "",
                    }))
                  );
                }}
              />
            </div>
          </div>
          <Button onClick={handleSaveChanges} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
