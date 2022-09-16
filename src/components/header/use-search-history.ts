import { SearchEntryType } from '@/types/db';
import { useLocalStorage } from 'usehooks-ts';

const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useLocalStorage(
    'searchHistory',
    [] as SearchEntryType[]
  );

  const addSearchHistoryEntry = (entry: SearchEntryType) => {
    setSearchHistory([
      entry,
      ...searchHistory.filter((e) => e.id !== entry.id),
    ]);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  return {
    searchHistory,
    addSearchHistoryEntry,
    clearSearchHistory,
  };
};

export default useSearchHistory;
