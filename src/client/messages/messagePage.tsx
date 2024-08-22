import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { MessageTable } from "./messageTable";

import { LatestChannelMessagesResponse, Filters } from "@/types/app.d";

import fetchGraphQL from "@/hooks/fetchGraphQL";
import { getAllCategoryMessages } from "@/graphql/graphqlCalls";
import MessageHeader from "./MessageHeader/MessageHeader";

export const DISCORD_CATEGORY = import.meta.env.VITE_DISCORD_CATEGORY;

function MessagePage() {
  const [SearchText, setSearchText] = useState<string | undefined>("");
  const [AuthorDropdown, setAuthorDropdown] = useState<string | undefined>();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["LatestChannelMessages", SearchText, AuthorDropdown],
    queryFn: async (): Promise<LatestChannelMessagesResponse> => {
      const filters: Filters = {};

      if (SearchText.length > 0) {
        filters.content = SearchText;
      }

      if (AuthorDropdown) {
        filters.authors = [AuthorDropdown];
      }

      filters.categoryChannel = DISCORD_CATEGORY;
      filters.messageTypes = ["message"];
      const variables =
        Object.keys(filters).length > 0 ? { filters } : undefined;

      return fetchGraphQL(getAllCategoryMessages, variables);
    },
    staleTime: 15000,
    refetchInterval: 15000,
    retry: false,
  });

  return (
    <div>
      <MessageHeader
        HeaderData={{
          refetch,
          isRefetching,
          setSearchText,
          AuthorDropdown,
          setAuthorDropdown,
        }}
      />
      <MessageTable TableData={{ data, isLoading, error, refetch }} />
      <Outlet />
    </div>
  );
}

export default MessagePage;
