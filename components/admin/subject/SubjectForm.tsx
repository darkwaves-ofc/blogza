"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { createSubject } from "@/actions/subject/create";
import { updateSubject } from "@/actions/subject/update";
import { GetSubjectInfoSuccessType } from "@/types/subject";
import { createSubjectSchema, updateSubjectSchema } from "@/schemas/subject";

interface SubjectFormDialogProps {
  initialSubject?: GetSubjectInfoSuccessType["subject"];
}

export const SubjectFormDialog = ({
  initialSubject,
}: SubjectFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const SubjectFormSchema = initialSubject
    ? updateSubjectSchema
    : createSubjectSchema;

  const form = useForm<z.infer<typeof SubjectFormSchema>>({
    resolver: zodResolver(SubjectFormSchema),
    defaultValues: {
      name: initialSubject?.name || "",
      teachers: initialSubject?.teachers || [],
    },
  });

  const onSubmit = async (values: z.infer<typeof SubjectFormSchema>) => {
    try {
      let response;

      if (!initialSubject) {
        response = await createSubject(
          values as z.infer<typeof createSubjectSchema>
        );
        if ("error" in response) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
          return;
        }
      } else {
        response = await updateSubject(
          initialSubject.id,
          values as z.infer<typeof updateSubjectSchema>
        );
        if ("error" in response) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Success",
        description: `Subject ${
          !initialSubject ? "created" : "updated"
        } successfully`,
        variant: "default",
      });

      router.refresh();
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(
        `Subject ${!initialSubject ? "creation" : "update"} failed`,
        error
      );
      toast({
        title: "Error",
        description: `Failed to ${
          !initialSubject ? "create" : "update"
        } subject. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {!initialSubject ? (
          <Button>
            <Pencil className="mr-2 h-4 w-4" /> Create Subject
          </Button>
        ) : (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
          </DropdownMenuItem>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {!initialSubject ? "Create New Subject" : "Edit Subject"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Subject Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* to be done becuase I have no idea how to do it */}
            <FormField
              control={form.control}
              name="teachers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teachers</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Teacher Names (comma-separated)"
                      value={field.value?.join(",")}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(",").filter(Boolean)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {!initialSubject ? "Create Subject" : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectFormDialog;
