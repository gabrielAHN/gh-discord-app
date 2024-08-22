import { useState } from "react";
import fetchGraphQL from "@/hooks/fetchGraphQL";
import { SendMessage } from "@/graphql/graphqlCalls";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const divStyles = "rounded-md border px-4 py-3 font-mono text-sm mb-2";

function ThreadSection({
  ThreadData,
  ThreadId,
}: {
  ThreadData: any;
  ThreadId: string;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (replyContent: string) => {
      const variables = {
        channelId: ThreadId,
        content: replyContent,
      };
      return await fetchGraphQL(SendMessage, variables);
    },
    onSuccess: () => {
      setReplyText("");
      setIsSending(false);
      navigate(0);
    },
    onError: (error) => {
      setIsSending(false);
      console.error("Error sending message:", error);
    },
  });

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleSendClick = () => {
    setIsSending(true);
    mutation.mutate(replyText);
  };

  const handleCancelClick = () => {
    setIsReplying(false);
    setReplyText("");
  };

  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Threads</AccordionTrigger>
      <AccordionContent>
        {!isReplying && (
          <Button variant="outline" className="mb-4" onClick={handleReplyClick}>
            Reply on Thread
          </Button>
        )}
        {isReplying && (
          <div className="mb-4">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="m-2 max-w-[95%] overflow-auto"
            />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleSendClick}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancelClick}
                disabled={isSending}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <div className="overflow-y-auto max-h-60">
          {Object.entries(ThreadData).map(([key, value]) => (
            <div
              key={key}
              className={`${divStyles} hover:border-cyan-400 cursor-pointer`}
            >
              <p>Author: {value.author}</p>
              <p>Date: {value.timestamp}</p>
              <p>Message:</p>
              <div className={divStyles}>{value.content}</div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default ThreadSection;
