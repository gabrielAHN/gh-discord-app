import fetchGraphQL from "@/hooks/fetchGraphQL";
import { CreateThread } from "@/graphql/graphqlCalls";
import { redirect } from "react-router-dom";

export async function MessageReplyAction({ request }) {
  const formData = await request.formData();

  const variables = {
    messageId: formData.get("messageId"),
    channelId: formData.get("channelId"),
    threadName: formData.get("threadName"),
    threadMessage: formData.get("replyContent"),
  };

  const data = await fetchGraphQL(CreateThread, variables);
  if (data.errors) {
    console.error(data.errors);
  } else {
    return redirect(`/messages/${variables.messageId}`);
  }
}
