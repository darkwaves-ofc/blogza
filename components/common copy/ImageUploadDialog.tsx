import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Upload, Check, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFile } from "@/actions/files/create";
import { cdnFileType, cdnToken } from "@/lib/cdn";
import { productFileType } from "@prisma/client";
import { isProductFilesInfoSuccess } from "@/types/product";
import { isCreateFileInfoSuccess } from "@/types/files";

export type ImageType = {
  url: string;
  id: string;
  token: string;
};

type UploadedImageType = {
  cdnLink: string | undefined;
  uploadToken: cdnToken;
  id: string;
  registerdAt: Date | null;
  uploadedAt: number | undefined;
  createdAt: number;
  name: string | null;
  extension: string | null;
  updatedAt: number;
  size: number | null;
  error?: string;
};

export default function ImageUploadDialog({
  onSelectImages,
  handleSingle = false,
  children,
}: {
  onSelectImages: (images: (ImageType | undefined)[]) => void;
  handleSingle?: boolean;
  children?: React.ReactNode;
}) {
  const [selectedImages, setSelectedImages] = useState<
    (ImageType | undefined)[]
  >([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUploadedImages = async () => {
      // const images = await getAllFilesOfUser();
      // setUploadedImages(images || []);
      setLoading(false);
    };

    if (loading && dialogOpen) {
      fetchUploadedImages();
    }
  }, [loading, dialogOpen]);

  const handleImageUpload = async (files: FileList) => {
    const filesToProcess = handleSingle ? [files[0]] : Array.from(files);

    for (const file of filesToProcess) {
      const fileId = Math.random().toString(36).substring(7);
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadedFile = await createFile(formData);
        console.log(uploadedFile);
        //  (progress) => {
        //     setUploadProgress((prev) => ({ ...prev, [fileId]: progress }))
        //   }
        if (isCreateFileInfoSuccess(uploadedFile)) {
          setUploadedImages((prev) => [...prev, uploadedFile]);
          setUploadProgress((prev) => {
            const { [fileId]: _, ...rest } = prev;
            return rest;
          });
        } else {
          throw new Error(uploadedFile?.error || "Upload failed");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadedImages((prev) => [
          ...prev,
          {
            id: fileId,
            cdnLink: URL.createObjectURL(file),
            error: "Upload failed",
          } as UploadedImageType,
        ]);
        setUploadProgress((prev) => {
          const { [fileId]: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleSelectImage = (image: UploadedImageType) => {
    console.log(image);
    if (handleSingle) {
      setSelectedImages([
        {
          url: image.cdnLink || "",
          id: image.id,
          token: image.uploadToken.token,
        },
      ]);
    } else {
      setSelectedImages((prev) => {
        const isSelected = prev.some((img) => img?.id === image.id);
        if (isSelected) {
          return prev.filter((img) => img?.id !== image.id);
        } else {
          return [
            ...prev,
            {
              url: image.cdnLink || "",
              id: image.id,
              token: image.uploadToken.token,
            },
          ];
        }
      });
    }
  };

  const handleImageSelection = () => {
    if (selectedImages.length > 0) {
      setDialogOpen(false);
      onSelectImages(selectedImages);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {<Button variant="outline">{children || "Upload Image"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Image Upload</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
          <DialogDescription>
            Upload or select images from your library.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "upload" | "library")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple={!handleSingle}
                onChange={(e) =>
                  e.target.files && handleImageUpload(e.target.files)
                }
                className="hidden"
              />
            </label>

            {Object.keys(uploadProgress).length > 0 && (
              <div className="mt-4 space-y-2">
                {Object.entries(uploadProgress).map(([id, progress]) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Progress value={progress} className="w-full" />
                    <span className="text-sm text-gray-500">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="library" className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <p className="text-gray-500">Loading images...</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="grid grid-cols-3 gap-4 m-1">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative rounded-lg overflow-hidden cursor-pointer ${
                        selectedImages.some((img) => img?.id === image.id)
                          ? "ring-2 ring-primary"
                          : "hover:opacity-75"
                      }`}
                      onClick={() => handleSelectImage(image)}
                    >
                      <Image
                        src={image.cdnLink || "/placeholder.svg"}
                        alt={image.name || "Uploaded image"}
                        width={500}
                        height={500}
                        className="w-full h-24 object-cover"
                      />
                      {image.error && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <AlertCircle className="text-red-500 w-8 h-8" />
                        </div>
                      )}
                      {selectedImages.some((img) => img?.id === image.id) && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {selectedImages.length} image
            {selectedImages.length !== 1 ? "s" : ""} selected
          </p>
          <Button
            onClick={handleImageSelection}
            disabled={selectedImages.length === 0}
          >
            {handleSingle ? "Select Image" : "Select Images"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
