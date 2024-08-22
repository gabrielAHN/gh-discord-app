import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Description } from "@radix-ui/react-dialog";
import { useNavigate, useLoaderData, Await } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Message } from "@/types/app";
import PopupMessage from "./PopupMessage";
import useMediaQuery from "react-use-media-query-ts";

function MessageWindow() {
  const [open, setOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const MessageInfoData = useLoaderData() as { MessageData: Promise<Message[]> };
  const navigate = useNavigate();

  const onOpenChange = () => {
    setOpen(!open);
    navigate(`/messages`);
  };

  const CloseButton = () => (
    <DrawerClose asChild>
      <Button variant="outline">Close</Button>
    </DrawerClose>
  );

  const LoadingFallback = () => (
    <Skeleton className="w-full h-10 flex items-center justify-center">
      Loading...
    </Skeleton>
  );

  const ErrorFallback = () => <p>Error loading message!</p>;

  return isDesktop ? (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent aria-describedby="" className="max-h-full w-full">
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
            <Description />
          </DialogHeader>
          <Suspense fallback={<LoadingFallback />}>
            <Await
              resolve={MessageInfoData?.MessageData}
              errorElement={<ErrorFallback />}
            >
              {(messageInfo) => (
                <div className="w-full overflow-auto">
                  <PopupMessage Data={messageInfo} />
                </div>
              )}
            </Await>
          </Suspense>
          <CloseButton />
        </DialogContent>
      </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>Messages</DrawerTitle>
        </DrawerHeader>
        <Suspense fallback={<LoadingFallback />}>
          <Await
            resolve={MessageInfoData?.MessageData}
            errorElement={<ErrorFallback />}
          >
            {(messageInfo) => (
              <>
                <PopupMessage Data={messageInfo} />
                <CloseButton />
              </>
            )}
          </Await>
        </Suspense>
      </DrawerContent>
    </Drawer>
  );
}

export default MessageWindow;