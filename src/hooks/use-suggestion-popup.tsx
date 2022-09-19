import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

const NO_SELECTION_INDEX = -1;

interface UseSuggestionListProps<T> {
  data?: T[];
  onSelect: (selectedItem: T) => void;
}

const useSuggestionList = <T,>({
  data = [],
  onSelect,
}: UseSuggestionListProps<T>) => {
  const router = useRouter();
  const [selectedItemIndex, setSelectedItem] =
    useState<number>(NO_SELECTION_INDEX);

  const [isSuggestionShow, setIsSuggestionShow] = useState(false);
  const containerRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedItem(NO_SELECTION_INDEX);
  }, [data.length]);

  useEffect(() => {
    setIsSuggestionShow(false);
    inputRef.current?.blur();
  }, [router.asPath]);

  const handleClickOutside = () => {
    setSelectedItem(NO_SELECTION_INDEX);
    setIsSuggestionShow(false);
  };

  useOnClickOutside(containerRef, handleClickOutside);

  const setNextItem = () => {
    if (!data?.length) return;
    if (selectedItemIndex + 1 === data.length) {
      setSelectedItem(0);
    } else {
      setSelectedItem(selectedItemIndex + 1);
    }
  };

  const setPrevItem = () => {
    if (!data.length) return;
    if (selectedItemIndex === undefined) {
      setSelectedItem(data.length - 1);
    } else if (selectedItemIndex === 0) {
      setSelectedItem(data.length - 1);
    } else {
      setSelectedItem(selectedItemIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown') {
      setNextItem();
    }
    if (e.key === 'ArrowUp') {
      setPrevItem();
    }
    if (e.key === 'Enter') {
      if (data && selectedItemIndex !== undefined) {
        const selectedItem = data[selectedItemIndex];
        if (selectedItem) {
          onSelect(selectedItem);
        }
      }
    }
    if (e.key === 'Escape') {
      setIsSuggestionShow(false);
    }
    if (e.key === 'Tab') {
      setIsSuggestionShow(false);
    }
  };

  const onInputFocus = () => {
    setIsSuggestionShow(true);
  };

  const suggestionData = isSuggestionShow ? data : [];

  return {
    selectedItemIndex,
    suggestionData,
    wrapperProps: {
      ref: containerRef,
      onKeyDown: handleKeyDown,
    },
    inputProps: { onFocus: onInputFocus, ref: inputRef },
  };
};

export default useSuggestionList;
