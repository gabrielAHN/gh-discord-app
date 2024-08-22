import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFetcher, useNavigate, Form } from "react-router-dom";
import { FiSend } from "react-icons/fi";

export const divStyles = "rounded-md border px-4 py-3 font-mono text-sm";

function MessageReply({ MessageReply }: any) {
  const [ThreadName, setThreadName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const isFormValid = ThreadName && replyContent;

  if (fetcher.state === "idle" && fetcher.data) {
    setThreadName("");
    setReplyContent("");
    navigate(".", { replace: true });
  }


  return (
    <Form
      method="post"
      className="m-4 space-y-2"
    >
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
        onChange={(e) => setReplyContent(e.target.value)}
        className="w-full p-2 overflow-auto"
        name="replyContent"
      />
      <Button
        variant="outline"
        className="w-full flex items-center justify-center"
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
    </Form>
  );
}

export default MessageReply;