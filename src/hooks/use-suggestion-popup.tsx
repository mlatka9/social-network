import { useState, useRef, useEffect } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface UseSuggestionListProps<T> {
  data?: T[];
  onSelect: (selectedItem: T) => void;
}

function useSuggestionList<T>({
  data = [],
  onSelect,
}: UseSuggestionListProps<T>) {
  //   const router = useRouter();
  const [selectedItemIndex, setSelectedItem] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    setSelectedItem(undefined);
  }, [data.length]);

  const [isSuggestionShow, setIsSuggestionShow] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  //   useEffect(() => {
  //     setIsSuggestionShow(false);
  //   }, [router.asPath]);

  const handleClickOutside = () => {
    setSelectedItem(undefined);
    setIsSuggestionShow(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const setNextItem = () => {
    if (!data?.length) return;
    if (selectedItemIndex === undefined) {
      setSelectedItem(0);
    } else if (selectedItemIndex + 1 === data.length) {
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
    if (e.key === "ArrowDown") {
      setNextItem();
    }
    if (e.key === "ArrowUp") {
      setPrevItem();
    }
    if (e.key === "Enter") {
      if (data && selectedItemIndex !== undefined) {
        const selectedItem = data[selectedItemIndex];
        if (selectedItem) {
          onSelect(selectedItem);
          //   setIsSuggestionShow(false); //idk
        }
      }
    }
    if (e.key === "Escape") {
      setIsSuggestionShow(false);
    }
    if (e.key === "Tab") {
      setIsSuggestionShow(false);
    }
  };

  const onInputFocus = () => {
    setIsSuggestionShow(true);
  };

  const suggestionData = isSuggestionShow ? (data.length ? data : []) : [];

  console.log(selectedItemIndex);

  return {
    selectedItemIndex,
    suggestionData,
    wrapperProps: {
      ref,
      onKeyDown: handleKeyDown,
    },
    inputProps: { onFocus: onInputFocus },
  };
}

export default useSuggestionList;
