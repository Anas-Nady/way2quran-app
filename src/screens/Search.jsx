import { useState, useCallback } from "react";
import { ScrollView } from "react-native";
import { searchItems } from "../services/api";
import SearchInput from "../components/Search/SearchInput";
import SearchResult from "../components/Search/SearchResult";
import { debounce } from "lodash";
import { useTranslate } from "../helpers/i18nHelper";
import GoBackButton from "../components/ui/GoBackButton";

export default function Search() {
  const translate = useTranslate("SearchScreen");
  const [results, setResults] = useState({
    reciters: [],
    recitations: [],
    surahs: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async (searchValue) => {
    if (!searchValue || searchValue.trim() === "") {
      setResults({ reciters: [], recitations: [], surahs: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchItems(searchValue);

      if (response.ok) {
        const data = await response.json();
        setResults({
          reciters: data.reciters || [],
          recitations: data.recitations || [],
          surahs: data.surahs || [],
        });
      } else {
        setError(translate("fetchError"));
      }
    } catch (err) {
      setError(err?.message || translate("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchResults = useCallback(
    debounce((searchValue) => fetchResults(searchValue), 300),
    []
  );

  const handleTextDebounce = (text) => {
    debouncedFetchResults(text);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 w-full bg-gray-800"
    >
      <GoBackButton />
      <SearchInput handleTextDebounce={handleTextDebounce} />
      <SearchResult results={results} loading={loading} error={error} />
    </ScrollView>
  );
}
