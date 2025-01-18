import { useCallback, useEffect, useState } from "react";
import Select from "react-select";

import { Security, fetchSecurity } from "./slice";
import { useAppDispatch } from "../../store/hooks";

function SearchSymbols() {
  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState("");
  const [securities, setSecurities] = useState<Security[]>([]);
  const [loading, setLoading] = useState(false);

  const searchSymbols = async (text: string) => {
    const response = await fetch(
      `http://localhost:3000/api/symbol/search/${text}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return (await response.json()) as Security[];
  };

  const debouncedSearch = useCallback(
    (() => {
      let timeoutdId: number | null = null;

      return (text: string) => {
        if (timeoutdId) clearTimeout(timeoutdId);

        timeoutdId = setTimeout(async () => {
          setLoading(true);
          try {
            const securities = await searchSymbols(text);
            setSecurities(securities);
          } catch (error) {
            console.error("Search failed:", error);
            setSecurities([]);
          } finally {
            setLoading(false);
          }
        }, 1000);
      };
    })(),
    [],
  );

  const onOptionSelect = (option) => {
    const security = securities.find(
      (security) => security.name === option.value,
    );
    setSearchText(`${security.displayName} - ${security.description}`);
    dispatch(fetchSecurity(security.name));
  };

  const getOptions = () =>
    securities.map((security) => {
      return {
        value: security.name,
        label: `${security.displayName} - ${security.description}`,
      };
    });

  useEffect(() => {
    if (searchText) debouncedSearch(searchText);
    else setSecurities([]);
  }, [searchText, debouncedSearch]);

  return (
    <Select
      options={getOptions()}
      isLoading={loading}
      inputValue={searchText}
      blurInputOnSelect
      onChange={onOptionSelect}
      onInputChange={setSearchText}
      filterOption={() => true}
    />
  );
}

export default SearchSymbols;
