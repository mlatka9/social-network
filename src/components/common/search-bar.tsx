import React, { useEffect, useState } from 'react';
import { useSearchQuery } from 'src/hooks/query';
import { useRouter } from 'next/router';
import { useDebounce } from 'usehooks-ts';
import useSuggestionList from 'src/hooks/use-suggestion-popup';
import { SearchType } from 'src/server/router/types';
import SearchCard from '@/components/common/search-card';
import SearchIcon from '@/components/common/icons/search';
import type { SearchEntryType } from '@/types/db';

const SearchBar = () => {
  const router = useRouter();

  const [searchPhrase, setSearchPhrase] = useState('');
  const debouncedSearchPhrase = useDebounce(searchPhrase, 300);

  const { data } = useSearchQuery(debouncedSearchPhrase);

  useEffect(() => {
    setSearchPhrase('');
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
  };

  return (
    <div className="relative mx-5 w-[350px]" {...wrapperProps}>
      <div className="relative">
        <div className="absolute top-[10px] md:top-[15px] left-2 md:left-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          {...inputProps}
          value={searchPhrase}
          onChange={handleOnChange}
          className="w-full  pl-8 p-2 md:p-3 md:pl-10 bg-primary-100 dark:bg-primary-dark-200 rounded-full focus:outline-blue-500 outline-2"
        />
      </div>

      <div className="fixed md:absolute left-0 top-14 bg-white  dark:bg-primary-dark-100 md:w-full rounded-lg shadow-lg overflow-hidden w-screen">
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

export default SearchBar;
