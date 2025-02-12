import { createPageContent } from "@/actions/pageContent/create";
import { updatePageContent } from "@/actions/pageContent/update";
import { useToast } from "@/hooks/use-toast";
import {
  isCreatePageContentSuccess,
  isUpdatePageContentSuccess,
  PageContentInfoSuccessType,
} from "@/types/pageContent";
import { useState } from "react";

interface UseHomeSettingsProps {
  page: {
    path: string;
    section: string;
  };
  _pageId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialImages?: PageContentInfoSuccessType["files"];
}

export const useHomeSettings = ({
  _pageId,
  page,
  initialTitle,
  initialContent,
  initialImages,
}: UseHomeSettingsProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<
    {
      token?: string;
      private: boolean;
      link: string;
    }[]
  >(
    initialImages?.map((d) => ({
      private: false,
      link: d.link,
    })) || []
  );
  const { toast } = useToast();

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const contentData = {
        title,
        content,
        path: page.path,
        section: page.section,
      };

      if (page.path && page.section) {
        const filesData = images.map(({ token, private: isPrivate }) => ({
          token: token || "",
          private: isPrivate,
        }));

        if (_pageId) {
          // Update existing page
          const response = await updatePageContent(
            _pageId,
            contentData,
            {
              files: filesData,
            },
            initialImages?.map((d) => d.id) || []
          );

          if (!isUpdatePageContentSuccess(response)) {
            toast({
              title: "Error",
              description: response.error,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Success",
              description: "Page content updated successfully.",
            });
          }
        } else {
          // Create new page
          const response = await createPageContent(contentData, {
            files: filesData,
          });

          if (!isCreatePageContentSuccess(response)) {
            toast({
              title: "Error",
              description: response.error,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Success",
              description: "Page content created successfully.",
            });
          }
        }
      } else {
        console.log("No page path or section provided.");
        toast({
          title: "Error",
          description: "No page path or section provided.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    title,
    setTitle,
    content,
    setContent,
    images,
    setImages,
    handleSaveChanges,
  };
};
