"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { createBlog } from "@/actions/blogActions";

const BlogForm = ({ initialData }: { initialData?: any }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      slug: "",
      title: "",
      description: "",
      mainImage: "",
      sections: [],
      published: false,
    },
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    const res = await createBlog(data);
    console.log(res)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-4">
        <Input
          {...register("slug")}
          placeholder="blog-post-slug"
          className="w-full"
        />
        <Input
          {...register("title")}
          placeholder="Blog Title"
          className="w-full"
        />
        <Textarea
          {...register("description")}
          placeholder="Blog Description"
          className="w-full"
        />
        <Input
          {...register("mainImage")}
          placeholder="Main Image URL"
          className="w-full"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-5 w-5" />
                        </div>

                        <CardContent className="flex-1 space-y-4">
                          <Select
                            {...register(`sections.${index}.type`)}
                            defaultValue={field.id}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="gallery">Gallery</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="quote">Quote</SelectItem>
                              <SelectItem value="link">Link</SelectItem>
                              <SelectItem value="button">Button</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            {...register(`sections.${index}.title`)}
                            placeholder="Section Title"
                          />

                          <Input
                            {...register(`sections.${index}.subtitle`)}
                            placeholder="Section Subtitle"
                          />

                          <Textarea
                            {...register(`sections.${index}.content`)}
                            placeholder="Content"
                          />

                          {field.id === "image" && (
                            <Input
                              {...register(`sections.${index}.imageUrl`)}
                              placeholder="Image URL"
                            />
                          )}

                          {field.id === "button" && (
                            <div className="space-y-2">
                              <Input
                                {...register(`sections.${index}.buttonText`)}
                                placeholder="Button Text"
                              />
                              <Input
                                {...register(`sections.${index}.buttonUrl`)}
                                placeholder="Button URL"
                              />
                            </div>
                          )}
                        </CardContent>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              type: "text",
              title: "",
              subtitle: "",
              content: "",
              order: fields.length,
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Blog"}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
