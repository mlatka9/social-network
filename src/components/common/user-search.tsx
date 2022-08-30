import React, { useEffect, useState } from "react";
import { trpc } from "src/utils/trpc";
import { useSearchUserQuery } from "src/hooks/query";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";
import SearchCard from "@/components/common/search-card";
import useSuggestionList from "src/hooks/use-suggestion-popup";
import SearchIcon from "@/components/common/icons/search";
import type { SearchEntryType } from "@/types/index";
import { SearchType } from "src/server/router/types";

const UserSearch = () => {
  const router = useRouter();
  const utils = trpc.useContext();

  const [searchPhrase, setSearchPhrase] = useState("");
  const debouncedSearchPhrase = useDebounce(searchPhrase, 300);

  const { data, isSuccess } = useSearchUserQuery(debouncedSearchPhrase);

  useEffect(() => {
    setSearchPhrase("");
  }, [router.asPath]);

  const onSelect = (searchEntry: SearchEntryType) => {
    const userId = searchEntry.id;
    if (searchEntry.type === SearchType.COMMUNITY) {
      router.push(`/community/${userId}`);
    }
    if (searchEntry.type === SearchType.USER) {
      router.push(`/user/${userId}`);
    }
  };

  const { suggestionData, selectedItemIndex, wrapperProps, inputProps } =
    useSuggestionList({
      data,
      onSelect,
    });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(e.target.value);
    if (e.target.value) {
      utils.invalidateQueries(["user.getBySearchPhrase", { searchPhrase }]);
    }
  };

  return (
    <div className="relative z-[200]" {...wrapperProps}>
      <div className="relative">
        <div className="absolute top-[15px] left-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          {...inputProps}
          value={searchPhrase}
          onChange={handleOnChange}
          className="pl-10 p-3 bg-primary-100 dark:bg-primary-dark-200 rounded-full focus:outline-blue-500 outline-2"
        />
      </div>

      <div className="absolute top-[calc(100%_+_10px)] bg-white  dark:bg-primary-dark-100 w-full rounded-lg shadow-lg overflow-hidden">
        {suggestionData.map((searchEntry, index) => (
          <SearchCard
            searchEntry={searchEntry}
            key={searchEntry.id}
            isSelected={selectedItemIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
