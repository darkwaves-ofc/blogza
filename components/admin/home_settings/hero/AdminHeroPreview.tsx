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
import ImageUploadDialog from "@/components/common/ImageUploadDialog";
import { z } from "zod";
import { updatePageContent } from "@/actions/pageContent/update";
import { createPageContent } from "@/actions/pageContent/create";
import path from "path";
import {
  isCreatePageContentSuccess,
  isUpdatePageContentSuccess,
  PageContentFilesInfoSuccessType,
  PageContentInfoSuccessType,
} from "@/types/pageContent";
import { toast } from "@/hooks/use-toast";
import { useHomeSettings } from "../use_home_settings";

interface AdminHeroPreviewProps {
  _pageId?: string;
  page: {
    path: string;
    section: string;
  };
  initialTitle?: string;
  initialContent?: string;
  initialImages?: PageContentInfoSuccessType["files"];
}

export default function AdminHeroPreview({
  _pageId,
  page = {
    path: "home",
    section: "hero",
  },
  initialTitle = "ART\nFOR YOUR TOUCH.",
  initialContent = "Lorem ipsum dolor sit amet...",
  initialImages,
}: AdminHeroPreviewProps) {
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
    initialTitle,
    initialContent,
    initialImages,
  });

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="">
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle>Hero Section Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[400px] bg-black">
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

            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="absolute inset-0 flex items-center flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-fjallaone_n4 tracking-widest leading-tight text-white text-center">
                {title &&
                  title.split("\n").map((line, index) => (
                    <span key={index} className="block">
                      {line}
                    </span>
                  ))}
              </h1>
              <span>{content}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Title</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Hero Title</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <Input
                  id="content"
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleSaveChanges} disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Change Banner Image</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Banner Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="items-center gap-4 flex">
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
    </div>
  );
}
