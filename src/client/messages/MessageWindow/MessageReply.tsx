import { useState, useEffect, useCallback } from "react";
import { FiSend } from "react-icons/fi";
import { LuBrainCircuit } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import fetchGraphQL from "@/hooks/fetchGraphQL";
import { LlamaCalls } from "@/graphql/graphqlCalls";
import { useFetcher, useNavigate, Form } from "react-router-dom";

export const divStyles = "rounded-md border px-4 py-3 font-mono text-sm";

function MessageReply({ MessageReply }: any) {
  const [ThreadName, setThreadName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isEditable, setIsEditable] = useState(true);

  const fetcher = useFetcher();
  const navigate = useNavigate();

  const isFormValid = ThreadName && replyContent;


  const handleReplyChange = useCallback(
    (e) => {
      if (isEditable) {
        setReplyContent(e.target.value);
      }
    },
    [isEditable]
  );

  const { data: AiResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["GetAIAnswer", MessageReply.content],
    queryFn: async () => {
      const response = await fetchGraphQL(LlamaCalls, { message: MessageReply.content });
      return response;
    },
    enabled: false,
  });

  const handleAIAttempt = useCallback(
    (e) => {
      e.preventDefault();
      setReplyContent("Loading AI response...");
      setIsEditable(false);
      refetch();
    },
    [refetch]
  );


  useEffect(() => {
    if (!isLoading && !isError && AiResponse) {
      const aiMessage = AiResponse?.GetAIAnswer || "AI response received.";
      setReplyContent(aiMessage);
      setIsEditable(true);
    }

    if (isError) {
      setReplyContent("Error: Failed to fetch AI response.");
      setIsEditable(true);
    }
  }, [AiResponse, isLoading, isError]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setThreadName("");
      setReplyContent("");
      navigate(".", { replace: true });
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <Form method="post" className="space-y-2 m-2">
      <input type="hidden" name="messageId" value={MessageReply.messageId} />
      <input type="hidden" name="channelId" value={MessageReply.channelId} />
      <Input
        required
        placeholder="Thread Name"
        value={ThreadName}
        onChange={(e) => setThreadName(e.target.value)}
        className="p-2"
        name="threadName"
      />
      <Textarea
        required
        placeholder="Reply to the message"
        value={replyContent}
        onChange={handleReplyChange}
        className="w-full p-2 overflow-auto"
        name="replyContent"
        disabled={isLoading}
      />
      <div className="flex space-x-2">
        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center"
          type="submit"
          disabled={fetcher.state === "submitting" || !isFormValid}
        >
          {fetcher.state === "submitting" ? (
            "Loading..."
          ) : (
            <>
              Send <FiSend className="ml-2" />
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center"
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
    </Form>
  );
}

export default MessageReply;