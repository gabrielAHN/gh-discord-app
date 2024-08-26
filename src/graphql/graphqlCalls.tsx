export const LlamaCalls = `
query GetAIAnswer($message: String!){
  GetAIAnswer(message:$message)
}
`;

export const getAllCategoryMessages = `
query getAllCategoryMessages($filters: MessageFilterInput) {
  getAllCategoryMessages(filters: $filters) {
    author
    channelName
    messageId
    timestamp
    messageType
    channelId
    threadId
    content
  }
}
`;

export const GetAuthorsOfChannel = `
query GetAuthorsOfChannel($categoryId: String!) {
  GetAuthorsOfChannel(categoryId: $categoryId)
}
`;

export const getMessageInfo = `
query getMessageInfo($MessageId: String!, $CategoryId: String!) {
  getMessageInfo(MessageId: $MessageId, CategoryId: $CategoryId) {
    author
    threadId
    channelId
    messageId
    content
    timestamp
  }
}
`;

export const SendMessage = `
mutation SendMessage($channelId: String!, $content: String!) {
  SendMessage(channelId: $channelId, content: $content)
}
`;

export const CreateThread = `
  mutation CreateThread(
    $messageId: String!, $threadMessage: String!, 
    $threadName: String!, $channelId: String!
    ) {
    CreateThread(
      messageId: $messageId
      threadMessage: $threadMessage
      threadName: $threadName
      channelId: $channelId
    )
  }
`;