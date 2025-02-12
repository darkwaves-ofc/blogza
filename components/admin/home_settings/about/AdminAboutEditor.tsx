"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContentInfoSuccessType } from "@/types/pageContent";
import { updatePageContent } from "@/actions/pageContent/update";
import { createPageContent } from "@/actions/pageContent/create";
import { useHomeSettings } from "../use_home_settings";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import ImageUploadDialog from "@/components/common/ImageUploadDialog";

interface AdminAboutPreviewProps {
  _pageId?: string;
  page: {
    path: string;
    section: string;
  };
  initialContent?: string;
  initialTitle?: string;
  initialImages?: PageContentInfoSuccessType["files"];
}

export default function AdminAboutEditor({
  _pageId,
  page = {
    path: "home",
    section: "about",
  },
  initialContent = "Join us in celebrating the beauty of your favorite series through our artistry. Experience the difference of artist-direct creations with Zyvlon – where passion meets exceptional craftsmanship!",
  initialTitle = "ART\nFOR YOUR TOUCH.",
  initialImages,
}: AdminAboutPreviewProps) {
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
    initialContent,
    initialTitle,
    initialImages,
  });
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    // In a real application, you would save this change to your backend
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div className="">
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle>About Section Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="my-12 max-w-screen-md mx-auto relative text-center font-fjallaone_n42 text-xl font-medium">
            {content}
          </div>
        </CardContent>
      </Card>
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit About Content</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit About Content</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <div className="grid grid-cols-4 items-center gap-4">
              <Textarea
                id="content"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="col-span-3"
                rows={6}
              />
            </div>
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
          </div>
          <Button onClick={handleSaveChanges} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
