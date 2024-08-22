import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetAuthorsOfChannel } from "@/graphql/graphqlCalls";
import fetchGraphQL from "@/hooks/fetchGraphQL";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export interface AuthorPickerDataProps {
  AuthorDropdown: string | undefined;
  setAuthorDropdown: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const DISCORD_CATEGORY = import.meta.env.VITE_DISCORD_CATEGORY;

function AuthorPicker({
  AuthorPickerData,
}: {
  AuthorPickerData: AuthorPickerDataProps;
}) {
  const { AuthorDropdown, setAuthorDropdown } = AuthorPickerData;
  const {
    data: AuthorsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Authors"],
    queryFn: () => {
      return fetchGraphQL(GetAuthorsOfChannel, {
        categoryId: DISCORD_CATEGORY,
      });
    },
  });

  const handleSelectChange = (value: string) => {
    setAuthorDropdown(value);
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full rounded-xl" />;
  }

  return (
    <Select value={AuthorDropdown} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Authors" />
      </SelectTrigger>
      <SelectContent>
        <Button
          className="w-full px-2 bg-red-500 hover:bg-red-300 text-white"
          size="sm"
          onClick={() => handleSelectChange("")}
        >
          Reset Selection
        </Button>
        {error ? (
          <SelectItem value="error">Error</SelectItem>
        ) : (
          AuthorsData &&
          AuthorsData.GetAuthorsOfChannel.map((row: string) => (
            <SelectItem key={row} value={row}>
              {row}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
export default AuthorPicker;
