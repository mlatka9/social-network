import React, { KeyboardEvent, useEffect, useState, useRef } from "react";
import { trpc } from "src/utils/trpc";
import { useSearchUserQuery } from "src/hooks/query";
import { useRouter } from "next/router";
import { useDebounce } from "usehooks-ts";
import { useOnClickOutside } from "usehooks-ts";
import SearchCard from "@/components/search-card";
import Image from "next/image";

const UserSearch = () => {
  const router = useRouter();
  const utils = trpc.useContext();

  const [isFocused, setIsFocused] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [selectedItem, setSelectedItem] = useState<number | undefined>(
    undefined
  );

  const ref = useRef(null);

  const handleClickOutside = () => {
    setSelectedItem(undefined);
    setIsFocused(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const debouncedSearchPhrase = useDebounce(searchPhrase, 300);
  const { data, isSuccess } = useSearchUserQuery(debouncedSearchPhrase);

  useEffect(() => {
    setIsFocused(false);
    setSearchPhrase("");
  }, [router.asPath]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhrase(e.target.value);
    if (e.target.value) {
      utils.invalidateQueries(["user.getBySearchPhrase", { searchPhrase }]);
    }
  };

  const setNextItem = () => {
    if (!data?.length) return;
    if (selectedItem === undefined) {
      setSelectedItem(0);
    } else if (selectedItem + 1 === data.length) {
      setSelectedItem(0);
    } else {
      setSelectedItem(selectedItem + 1);
    }
  };

  const setPrevItem = () => {
    if (!data?.length) return;
    if (selectedItem === undefined) {
      setSelectedItem(data.length);
    } else if (selectedItem === 0) {
      setSelectedItem(data.length - 1);
    } else {
      setSelectedItem(selectedItem - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setNextItem();
    }
    if (e.key === "ArrowUp") {
      setPrevItem();
    }
    if (e.key === "Enter") {
      if (data && selectedItem !== undefined) {
        const userId = data[selectedItem]?.id;
        if (userId === undefined) return;
        router.push(`/user/${userId}`);
      }
    }
    if (e.key === "Escape") {
      setIsFocused(false);
    }
    if (e.key === "Tab") {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative z-[200]" onKeyDown={handleKeyDown} ref={ref}>
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
          onFocus={() => setIsFocused(true)}
          value={searchPhrase}
          onChange={handleOnChange}
          className="pl-10 p-3 bg-slate-100 rounded-full focus:outline-blue-500 outline-2"
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowUp") {
              e.preventDefault();
            }
          }}
        />
      </div>

      <div className="absolute top-[calc(100%_+_10px)] bg-white w-full rounded-lg shadow-lg overflow-hidden">
        {isFocused &&
          isSuccess &&
          data.map((user, index) => (
            <SearchCard
              user={user}
              key={user.id}
              isSelected={selectedItem === index}
            />
          ))}
      </div>
    </div>
  );
};

export default UserSearch;
