import React, { useState } from "react";
import { Bell, Image as ImageIcon, Trash2, Edit, Eye } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import {
  GetAllPopupsSuccess,
  isDeletePopupSuccess,
  SearchPopupsInfoSuccess,
} from "@/types/popups";
import { toast } from "@/hooks/use-toast";
import { deletePopup } from "@/actions/popups/delete";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { togglePopupActive, updatePopup } from "@/actions/popups/update";
import PopupAdminForm from "./PopupAdminForm";

export default function AllPopups({
  popups,
  setPopups,
}: {
  popups: SearchPopupsInfoSuccess["popups"];
  setPopups: React.Dispatch<
    React.SetStateAction<SearchPopupsInfoSuccess["popups"]>
  >;
}) {
  const [loading, setLoading] = useState<
    Array<{ id: string; active: boolean }>
  >([
    {
      id: "",
      active: false,
    },
  ]);
  const togglePopupStatus = async (id: string) => {
    setLoading((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: true } : item))
    );

    const response = await togglePopupActive(id);
    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "Success",
        description: "Popup status updated successfully",
      });
    }
    setLoading((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: false } : item))
    );

    setLoading([{ id, active: false }]);
    setPopups(
      popups.map((notify) =>
        notify.popup.id === id
          ? { ...notify, active: response.active as boolean }
          : notify
      )
    );
  };

  const handleDeletePopup = async (id: string) => {
    setLoading((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: true } : item))
    );

    const response = await deletePopup({
      id,
    });
    if (!isDeletePopupSuccess(response)) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "Success",
        description: "Popup deleted successfully",
      });
    }
    setLoading((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: false } : item))
    );

    setPopups(popups.filter((notify) => notify.popup.id !== id));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Popup Management</CardTitle>
        <CardDescription>Manage and edit your current popups</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Metrics</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {popups.map(({ popup, viewCount }) => (
              <TableRow
                key={popup.id}
                className={loading.find((l) => l.id === popup.id)?.active ? 'opacity-50 pointer-events-none' : ''}
              >
                <TableCell>{popup.type}</TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link">{popup.title}</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">{popup.title}</h4>
                        <p className="text-sm">{popup.message}</p>
                        {popup.popupContentFile && (
                          <Image
                            src={popup.popupContentFile.link}
                            alt={popup.title}
                            width={500}
                            height={500}
                            className="rounded-md"
                          />
                        )}
                        <p className="text-xs text-muted-foreground">
                          Created by: {popup.createdBy}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>{popup.recipient}</TableCell>
                <TableCell>
                  <Switch
                    checked={popup.active}
                    onCheckedChange={() => togglePopupStatus(popup.id)}
                  />
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="sm">
                        View Stats
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span>{popup.viewCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Clicks:</span>
                          <span>{popup.clickCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>
                            {new Date(popup.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Updated:</span>
                          <span>
                            {new Date(popup.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">
                            Preview Details
                          </h4>
                          <p className="text-sm">ID: {popup.id}</p>
                          <p className="text-sm">Type: {popup.type}</p>
                          <p className="text-sm">
                            Status: {popup.active ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>

                    <PopupAdminForm initialData={popup} setPopups={setPopups}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PopupAdminForm>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the popup.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePopup(popup.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
