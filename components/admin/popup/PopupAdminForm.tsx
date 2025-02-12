import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import ImageUploadDialog, {
  ImageType,
} from "@/components/common/ImageUploadDialog";
import { createPopup } from "@/actions/popups/create";
import { toast } from "@/hooks/use-toast";
import { PopupType, RecipientType } from "@prisma/client";
import {
  GetAllPopupsSuccess,
  isCreatePopupSuccess,
  isUpdatePopupSuccess,
  SearchPopupsInfoSuccess,
} from "@/types/popups";
import { updatePopup } from "@/actions/popups/update";

export default function PopupAdminForm({
  setPopups,
  initialData,
  children,
}: {
  setPopups: React.Dispatch<
    React.SetStateAction<SearchPopupsInfoSuccess["popups"]>
  >;
  initialData?: SearchPopupsInfoSuccess["popups"][number]["popup"];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [newPopup, setNewPopup] = useState<
    Partial<SearchPopupsInfoSuccess["popups"][number]["popup"]>
  >(
    () =>
      initialData || {
        type: "alert",
        recipient: "all",
        active: true,
        autoClose: undefined,
      }
  );
  const [loading, setLoading] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);

  const [selectedImage, setSelectedImage] = useState<ImageType | undefined>(
    undefined
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewPopup({ ...newPopup, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewPopup({ ...newPopup, [name]: value });
  };

  const resetForm = () => {
    if (!initialData) {
      setNewPopup({
        type: "alert",
        recipient: "all",
        active: true,
        autoClose: undefined,
      });
      setSelectedImage(undefined);
      setScheduleEnabled(false);
    }
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const popupData = {
        type: newPopup.type as PopupType,
        title: newPopup.title || "",
        message: newPopup.message || "",
        autoClose: newPopup.autoClose || undefined,
        recipient: newPopup.recipient as RecipientType,
        active: newPopup.active || false,
        startDate: scheduleEnabled ? newPopup.startDate || new Date() : new Date(),
        endDate: scheduleEnabled ? newPopup.endDate || undefined : undefined,
      };

      const fileData = selectedImage?.token
        ? {
            file: {
              token: selectedImage.token,
            },
          }
        : undefined;

      const response = initialData
        ? await updatePopup({
            id: initialData.id,
            data: popupData,
            file: fileData,
          })
        : await createPopup({
            data: popupData,
            file: fileData,
          });

      if ("error" in response) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: initialData
          ? "Popup updated successfully"
          : "Popup created successfully",
      });

      setPopups((prev) => {
        if (initialData) {
          return prev.map((popup) =>
            popup.popup.id === initialData.id
              ? { ...popup, ...response.popup }
              : popup
          );
        }

        return [...prev, { ...prev[0], ...response.popup }];
      });

      setLoading(false);
      resetForm();
    } catch (error) {
      console.error("Error handling popup:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the popup",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Popup" : "Create New Popup"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Modify existing popup settings"
              : "Set up a new popup for users"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Popup Type</Label>
              <Select
                name="type"
                value={newPopup.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Select
                name="recipient"
                value={newPopup.recipient}
                onValueChange={(value) =>
                  handleSelectChange("recipient", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={newPopup.title || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={newPopup.message || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableAutoClose"
                checked={!!newPopup.autoClose}
                onCheckedChange={(checked) =>
                  setNewPopup({
                    ...newPopup,
                    autoClose: checked ? 1000 : undefined,
                  })
                }
              />
              <Label htmlFor="enableAutoClose">Enable Auto Close</Label>
            </div>
            {!!newPopup.autoClose && (
              <div className="space-y-2">
                <Label htmlFor="autoClose">Auto Close Time (seconds)</Label>
                <Textarea
                  id="autoClose"
                  name="autoClose"
                  value={newPopup.autoClose || 0}
                  itemType="number"
                  inputMode="numeric"
                  onChange={(e) =>
                    setNewPopup({
                      ...newPopup,
                      autoClose: parseInt(e.target.value || "0"),
                    })
                  }
                  required
                />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableSchedule"
                checked={scheduleEnabled}
                onCheckedChange={setScheduleEnabled}
              />
              <Label htmlFor="enableSchedule">Enable Schedule</Label>
            </div>
            {scheduleEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={newPopup.startDate ? new Date(newPopup.startDate).toISOString().slice(0, 16) : ""}
                    onChange={(e) =>
                      setNewPopup({
                        ...newPopup,
                        startDate: new Date(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={newPopup.endDate ? new Date(newPopup.endDate).toISOString().slice(0, 16) : ""}
                    onChange={(e) =>
                      setNewPopup({
                        ...newPopup,
                        endDate: new Date(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
            )}
          </div>
          {(newPopup.type === "banner" || newPopup.type === "popup") && (
            <div className="space-y-2">
              <ImageUploadDialog
                handleSingle
                onSelectImages={(d) => setSelectedImage(d[0])}
              >
                <Button variant="outline">Upload Image</Button>
              </ImageUploadDialog>
              {initialData?.popupContentFile?.link && (
                <div className="flex items-center space-x-2">
                  <Image
                    src={initialData.popupContentFile?.link}
                    alt="Selected Image"
                    width={100}
                    height={100}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => setSelectedImage(undefined)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={newPopup.active}
              onCheckedChange={(checked) =>
                setNewPopup({ ...newPopup, active: checked })
              }
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {loading
                ? "Saving..."
                : initialData
                ? "Save Changes"
                : "Create Popup"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}