import { useState, useEffect, useCallback } from "react";
import fetchGraphQL from "@/hooks/fetchGraphQL";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FiSend } from "react-icons/fi";
import { SendMessage, LlamaCalls } from "@/graphql/graphqlCalls";
import { LuBrainCircuit } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  const [isEditable, setIsEditable] = useState(true);
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
      setIsReplying(false);
      navigate(0);
    },
    onError: (error) => {
      setIsSending(false);
      console.error("Error sending message:", error);
    },
  });

  const {
    data: AiResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["GetAIAnswer", ThreadData[0].content],
    queryFn: () => fetchGraphQL(LlamaCalls, { message: ThreadData[0].content }),
    enabled: false,
  });

  const handleReplyClick = useCallback(() => {
    setIsReplying(true);
  }, []);

  const handleSendClick = useCallback(() => {
    setIsSending(true);
    mutation.mutate(replyText);
  }, [replyText, mutation]);

  const handleCancelClick = useCallback(() => {
    setIsReplying(false);
    setReplyText("");
  }, []);

  const handleAIAttempt = useCallback(() => {
    setReplyText("Loading AI response...");
    setIsEditable(false);
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isLoading && !isError && AiResponse) {
      const aiMessage = AiResponse?.GetAIAnswer || "AI response received.";
      setReplyText(aiMessage);
      setIsEditable(true);
    }

    if (isError) {
      setReplyText("Error in fetching AI response");
      setIsEditable(true);
    }
  }, [AiResponse, isLoading, isError]);

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
              onChange={(e) => {
                if (isEditable) {
                  setReplyText(e.target.value);
                }
              }}
              className="m-2 max-w-[95%] overflow-auto"
              disabled={isLoading || !isEditable}
            />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleSendClick}
                disabled={isSending || !isEditable}
                className="flex-1 flex"
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <>
                    Send <FiSend className="ml-2" />
                  </>
                )}
              </Button>
              <Button
                className="flex-1 flex "
                variant="outline"
                onClick={handleCancelClick}
                disabled={isSending||isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex"
                onClick={handleAIAttempt}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <LuBrainCircuit className="mr-2" /> AI Attempt
                  </>
                )}
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