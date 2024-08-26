import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FaDiscord } from "react-icons/fa";

import fetchGraphQL from "@/hooks/fetchGraphQL";
import { getAllCategoryMessages } from "@/graphql/graphqlCalls";
import ThreadSection from "./ThreadSection/ThreadSection";
import MessageReply from "./MessageReply";
import { Skeleton } from "@/components/ui/skeleton";

export const DISCORD_SERVER = import.meta.env.VITE_DISCORD_SERVER;
export const DISCORD_CATEGORY = import.meta.env.VITE_DISCORD_CATEGORY;
export const divStyles =
  "rounded-md border px-4 py-1 font-mono text-sm overflow-x-auto break-words";
export const labelMargin = "mb-1";
export const divMargin = "mb-2";

function PopupMessage({ Data }: any) {
  const ThreadId = Data?.getMessageInfo?.threadId;
  const { data: ThreadData, isLoading: ThreadLoading } = useQuery({
    queryKey: ["GetThreadById", ThreadId],
    queryFn: () =>
      fetchGraphQL(getAllCategoryMessages, {
        filters: {
          threadId: ThreadId,
          categoryChannel: DISCORD_CATEGORY,
          messageTypes: ["message", "thread"],
        },
      }),
    enabled: !!ThreadId,
  });

  const DiscordClick = () => {
    const url = `https://discord.com/channels/${DISCORD_SERVER}/${Data.getMessageInfo.channelId}/${Data.getMessageInfo.messageId}`;
    window.open(url, "_blank");
  };

  const DiscordButton = () => {
    return (
      <Button
        variant="outline"
        onClick={DiscordClick}
        className="w-full mt-4 bg-[#5865F2] text-white hover:text-[#5865F9]"
      >
        <FaDiscord className="mr-2" />
        Discord
      </Button>
    );
  };

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="underline">Info</AccordionTrigger>
        <AccordionContent>
          {Data?.getMessageInfo && (
            <div>
              <Label htmlFor="author" className={labelMargin}>
                Date
              </Label>
              <div className={`${divStyles} ${divMargin}`}>
                {Data.getMessageInfo.timestamp}
              </div>

              <Label htmlFor="author" className={labelMargin}>
                Author
              </Label>
              <div className={`${divStyles} ${divMargin}`}>
                {Data.getMessageInfo.author}
              </div>

              <Label htmlFor="channelId" className={labelMargin}>
                Channel Id
              </Label>
              <div className={`${divStyles} ${divMargin}`}>
                {Data.getMessageInfo.channelId}
              </div>

              <Label htmlFor="messageId" className={labelMargin}>
                Message Id
              </Label>
              <div className={`${divStyles} ${divMargin}`}>
                {Data.getMessageInfo.messageId}
              </div>
              {Data.getMessageInfo.threadId && (
                <>
                  <Label htmlFor="threadId" className={labelMargin}>
                    Thread Id
                  </Label>
                  <div className={`${divStyles} ${divMargin}`}>
                    {Data.getMessageInfo.threadId}
                  </div>
                </>
              )}
              <Label htmlFor="content" className={labelMargin}>
                Content
              </Label>
              <div
                className={`${divStyles} max-h-48 h-32 overflow-x-auto break-words`}
              >
                {Data.getMessageInfo.content}
              </div>
            </div>
          )}
          <DiscordButton />
        </AccordionContent>
      </AccordionItem>
      {!ThreadId && (
        <AccordionItem value="item-2">
          <AccordionTrigger className="underline">
            Thread Reply
          </AccordionTrigger>
          <AccordionContent>
              <div
                className={`${divStyles} max-h-48 h-32 overflow-x-auto break-words`}
              >
                {Data.getMessageInfo.content}
              </div>
            <MessageReply MessageReply={Data?.getMessageInfo} />
          </AccordionContent>
        </AccordionItem>
      )}
      {ThreadLoading ? (
        <Skeleton className="w-full h-10 m-3 flex items-center justify-center">
          Loading threads...
        </Skeleton>
      ) : (
        ThreadId &&
        ThreadData?.getAllCategoryMessages &&
        ThreadData.getAllCategoryMessages.length > 0 && (
          <ThreadSection
            ThreadData={ThreadData?.getAllCategoryMessages}
            ThreadId={ThreadId}
          />
        )
      )}
    </Accordion>
  );
}
export default PopupMessage;
