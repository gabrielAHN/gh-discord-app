import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableDataProps, Message } from "@/types/app.d";

export function MessageTable({ TableData }: TableDataProps) {
  const { data, isLoading, error } = TableData;
  const navigate = useNavigate();

  const handleRowClick = (message: Message) => {
    navigate(`/messages/${message.messageId}`);
  };

  const handleClick = async () => {
    navigate(window.location.pathname, { replace: true });
  };

  if (error) {
    return (
      <div className="flex flex-col m-4 items-center justify-center h-full p-4 bg-red-100 rounded-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Something went wrong
        </h1>
        <p className="text-lg text-red-500">{error.message}</p>
        <Button
          onClick={handleClick}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton className=" mt-5 h-[55vh] w-full rounded-xl" />;
  }

  return (
    <ScrollArea className="mt-5 h-screen w-full rounded-md border p-4">
      <Table className="w-full h-full">
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Channel Name</TableHead>
            <TableHead>Thread</TableHead>
            <TableHead>Content</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data ? (
            <TableRow>
              <TableCell>No data</TableCell>
            </TableRow>
          ) : data.getAllCategoryMessages.length === 0 ? (
            <TableRow>
              <TableCell>No data</TableCell>
            </TableRow>
          ) : (
            data.getAllCategoryMessages.map((message: message.str) => (
              <TableRow
                key={message.messageId}
                onClick={() => handleRowClick(message)}
              >
                <TableCell>{message.author}</TableCell>
                <TableCell>
                  {new Date(message.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{message.channelName}</TableCell>
                <TableCell>{message.threadId ? "✅" : ""}</TableCell>
                <TableCell className="max-w-[25vh] overflow-hidden text-ellipsis whitespace-wrap">
                  {message.content}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
export default MessageTable;
