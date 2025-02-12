"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, AlertCircle, Info } from "lucide-react";
import { User } from "next-auth";
import {
  GetAllPopupsResponse,
  GetAllPopupsSuccess,
  isGetAllPopupsSuccess,
  isSearchPopupsInfoSuccess,
  isTrackPopupClickSuccess,
  isTrackPopupViewSuccess,
  SearchPopupsInfoResponse,
  SearchPopupsInfoSuccess,
} from "@/types/popups";
import { PopupType } from "@prisma/client";
import Image from "next/image";
import { trackPopupClick, trackPopupView } from "@/actions/popups/create";
import { toast } from "@/hooks/use-toast";

const PopupSystem = ({
  user,
  initialData,
}: {
  initialData?: GetAllPopupsResponse;
  user: User | undefined;
}) => {
  const [popups, setPopups] = useState<GetAllPopupsSuccess["popups"]>(
    initialData && isGetAllPopupsSuccess(initialData) ? initialData.popups : []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  const currentPopup = popups[currentIndex];

  useEffect(() => {
    if (currentPopup?.autoClose) {
      const timer = setTimeout(() => {
        handleNext();
      }, currentPopup.autoClose);
      return () => clearTimeout(timer);
    }
  }, [currentPopup]);

  const closeAllPopups = () => {
    setCurrentIndex(-1);
  };

  const handleNext = () => {
    if (currentIndex < popups.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      closeAllPopups();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };
  const [viewedPopups, setViewedPopups] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Mark popup as viewed when it becomes the current popup
    if (currentPopup && !viewedPopups.has(currentPopup.id)) {
      handleUserViewPopup(currentPopup.id);
    }
  }, [currentPopup]);
  
  const handleUserViewPopup = async (popupId: string) => {
    if (popupId) {
      const response = await trackPopupView(popupId);
      if (!isTrackPopupViewSuccess(response)) {
        toast({
          title: "Failed to mark popup as viewed.",
          description: response.error,
          variant: "destructive",
        });
      } else {
        console.log("Popup viewed successfully.");
        setViewedPopups((prev) => new Set(prev).add(popupId)); // Add to viewed popups
      }
    }
  };
  
  

  const handleClickPopup = async (popupId: string) => {
    if (popupId) {
      const response = await trackPopupClick(popupId);
      if (!isTrackPopupClickSuccess(response)) {
        console.log("Popup clicked successfully.");
        toast({
          title: "Failed to mark popup as clicked.",
          description: response.error,
          variant: "destructive",
        });
      } else {
        console.log("Popup clicked successfully.");
      }
    }
  };

  const renderPopupContent = () => {
    if (!currentPopup) return null;

    const commonCloseButton = (
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-100 transition-colors"
        onClick={closeAllPopups}
      >
        <X className="h-4 w-4" />
      </Button>
    );

    const commonNavigation = (
      <DialogFooter className="mt-6">
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            className="text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            {currentIndex < popups.length - 1 ? (
              <>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              "Finish"
            )}
          </Button>
        </div>
      </DialogFooter>
    );

    switch (currentPopup.type) {
      case PopupType.banner:
        return (
          <div
            onClick={() => handleClickPopup(currentPopup.id)}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            {commonCloseButton}
            <div className="flex flex-col">
              {currentPopup.popupContentFile?.link && (
                <div className="w-full h-48 relative">
                  <Image
                    src={currentPopup.popupContentFile.link}
                    alt={currentPopup.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {currentPopup.title}
                </h3>
                <p className="text-gray-300">{currentPopup.message}</p>
              </div>
            </div>
            {commonNavigation}
          </div>
        );

      case PopupType.alert:
        return (
          <div
            onClick={() => handleClickPopup(currentPopup.id)}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            {commonCloseButton}
            <div className="flex items-start bg-red-900 bg-opacity-20">
              <AlertCircle className="mr-4 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-red-300 mb-2">
                  {currentPopup.title}
                </h3>
                <p className="text-red-100">{currentPopup.message}</p>
              </div>
            </div>
            {commonNavigation}
          </div>
        );

      case PopupType.popup:
      default:
        return (
          <div onClick={() => handleClickPopup(currentPopup.id)}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-100">
                {currentPopup.title}
              </DialogTitle>
              {currentPopup.popupContentFile?.link && (
                <div className="w-full h-48 relative">
                  <Image
                    src={currentPopup.popupContentFile.link}
                    alt={currentPopup.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <DialogDescription className="text-gray-300 mt-2">
                {currentPopup.message}
              </DialogDescription>
              {commonCloseButton}
            </DialogHeader>
            {commonNavigation}
          </div>
        );
    }
  };

  if (!user) return null;
  if (!currentPopup || currentIndex === -1) return null;

  return (
    <Dialog open={true} onOpenChange={closeAllPopups}>
      <DialogContent
        className="sm:max-w-[425px] bg-gray-900 text-gray-100 border-gray-700"
        ref={popupRef}
      >
        {renderPopupContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PopupSystem;
