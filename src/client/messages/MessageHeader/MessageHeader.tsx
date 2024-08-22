import { useState } from "react";

import { FaSpinner } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeaderDataProps } from "@/types/app.d";

import AuthorPicker from "./AuthorPicker";


function MessageHeader({ HeaderData }: { HeaderData: HeaderDataProps }) {
  const [isRotating, setIsRotating] = useState(false);
  const {
    refetch,
    isRefetching,
    setSearchText,
    setAuthorDropdown,
    AuthorDropdown,
  } = HeaderData;



  const handleClick = async () => {
    setIsRotating(true);
    await refetch();
    setIsRotating(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl">Discord Messages</h1>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">15 sec Refresh</span>
          <Button
            className="px-2 py-1 text-sm"
            disabled={isRefetching}
            onClick={handleClick}
          >
            {isRefetching ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <IoIosRefresh
                className={`transform ${isRotating ? "animate-spin" : ""} mr-2`}
              />
            )}
            Refresh
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Input className="flex-grow" onChange={handleInputChange} />
        <div className="flex-grow sm:w-full md:w-[25vh] ">
          <AuthorPicker AuthorPickerData={{ 
            AuthorDropdown,
            setAuthorDropdown
            }} />
        </div>
      </div>
    </div>
  );
}

export default MessageHeader;