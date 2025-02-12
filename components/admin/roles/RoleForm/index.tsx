"use client";
import React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RoleSearchInfoSuccessType } from "@/types/roles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRolesFormAdmin } from "./role-form.data";
import Details from "./Details";
import Pages from "./Pages";
import Permissions from "./Permissions";
import Position from "./Position";

export default function RoleForm({
  initialData,
}: {
  initialData?: RoleSearchInfoSuccessType["roles"][number]["role"];
}) {
  const {
    open,
    setOpen,
    form,
    selectedPageGroups,
    selectedPermissionGroups,
    handlePageGroupSelect,
    handlePermissionGroupSelect,
    onSubmit,
  } = useRolesFormAdmin(initialData);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {initialData ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit Role
          </DropdownMenuItem>
        ) : (
          <Button>Create Role</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Details form={form} />
            <Pages
              form={form}
              selectedPageGroups={selectedPageGroups}
              handlePageGroupSelect={handlePageGroupSelect}
            />
            <Permissions
              form={form}
              handlePermissionGroupSelect={handlePermissionGroupSelect}
              selectedPermissionGroups={selectedPermissionGroups}
            />
            <Position form={form} />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Submitting..."
                : initialData
                ? "Update Role"
                : "Create Role"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
