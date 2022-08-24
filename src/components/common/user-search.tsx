import React, { KeyboardEvent, useEffect, useState, useRef } from "react";
import { trpc } from "src/utils/trpc";
import { useSearchUserQuery } from "src/hooks/query";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";

import SearchCard from "@/components/common/search-card";
import Image from "next/image";
import useSuggestionList from "src/hooks/use-suggestion-popup";
import { User } from "@prisma/client";

const UserSearch = () => {
  const router = useRouter();
  const utils = trpc.useContext();

  const [searchPhrase, setSearchPhrase] = useState("");
  const debouncedSearchPhrase = useDebounce(searchPhrase, 300);

  const { data } = useSearchUserQuery(debouncedSearchPhrase);

  useEffect(() => {
    setSearchPhrase("");
  }, [router.asPath]);

  const onSelect = (user: User) => {
    const userId = user.id;
    if (userId === undefined) return;
    router.push(`/user/${userId}`);
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
        <div className="absolute top-3 left-2 pointer-events-none">
          <Image
            src="/icons/search.png"
            width="20"
            height="20"
            alt=""
            className="absolute top-10 "
          />
        </div>

        <input
          {...inputProps}
          value={searchPhrase}
          onChange={handleOnChange}
          className="pl-10 p-3 bg-slate-100 rounded-full focus:outline-blue-500 outline-2"
        />
      </div>

      <div className="absolute top-[calc(100%_+_10px)] bg-white w-full rounded-lg shadow-lg overflow-hidden">
        {suggestionData.map((user, index) => (
          <SearchCard
            user={user}
            key={user.id}
            isSelected={selectedItemIndex === index}
          />
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
