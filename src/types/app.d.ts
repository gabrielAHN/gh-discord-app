export interface HeaderDataProps {
  refetch: () => Promise<void>;
  isRefetching: boolean;
  setSearchText: React.Dispatch<React.SetStateAction<string | undefined>>;
  setAuthorDropdown: React.Dispatch<React.SetStateAction<string | undefined>>;
  AuthorDropdown: string | undefined;
}

export interface Message {
  messageId: string;
  author: string;
  timestamp: string;
  channelName: string;
  threadId?: string;
  content: string;
  channelId: string;
}

export interface TableDataProps {
  TableData: {
    data: LatestChannelMessages[Message] | undefined;
    isLoading: boolean;
    error: Error.Text;
    refetch: () => Promise<void>;
    isRefetching: boolean;
  };
}

export interface LatestChannelMessagesResponse {
  messages: Message[];
}

export interface Filters {
  content?: string;
  authors?: string[];
}

export interface FiltersType {
  threadId: string;
  categoryChannel: string;
}
