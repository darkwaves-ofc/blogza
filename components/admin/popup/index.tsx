"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GetAllPopupsSuccess, SearchPopupsInfoSuccess } from "@/types/popups";
import AllPopups from "./AllPopups";
import PopupAdminForm from "./PopupAdminForm";

export default function AdminPopupManagement({
  initialData,
}: {
  initialData: SearchPopupsInfoSuccess["popups"];
}) {
  const [popups, setPopups] = useState<SearchPopupsInfoSuccess["popups"]>(
    initialData || []
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="product-manager-header-actions flex flex-row gap-2">
            <PopupAdminForm setPopups={setPopups}>
              <Button>Create New Popup</Button>
            </PopupAdminForm>
          </div>
          <AllPopups popups={popups} setPopups={setPopups} />
        </main>
      </div>
    </div>
  );
}
