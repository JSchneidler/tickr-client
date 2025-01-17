import { useCallback, useEffect, useState } from "react";
import { Autocomplete, AutocompleteProps, Group, Text } from "@mantine/core";

// TODO: Move to schemas or merge with backend schema
interface Symbol {
  id: number;
  name: string;
  displayName: string;
  description: string;
  mic: string;
  figi: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

interface Quote {
  price: number;
  open_price: number;
  change: number;
  change_percent: number;
}

interface Result {
  symbol: Symbol;
  quote: Quote;
}

type SearchResults = Record<string, Result>;

interface SearchSymbolsProps {
  onSymbolSelect: (id: number) => void;
}

function SearchSymbols({ onSymbolSelect }: SearchSymbolsProps) {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<SearchResults>({});
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

    return (await response.json()) as Result[];
  };

  const debouncedSearch = useCallback(
    (() => {
      let timeoutdId: number | null = null;

      return (text: string) => {
        if (timeoutdId) clearTimeout(timeoutdId);

        timeoutdId = setTimeout(async () => {
          setLoading(true);
          try {
            const searchResults = await searchSymbols(text);
            const autocompleteOptions: SearchResults = {};
            for (const symbolName of Object.keys(searchResults)) {
              const { symbol, quote } = searchResults[symbolName];
              autocompleteOptions[symbol.name] = {
                symbol,
                quote,
              };
            }
            setResults(autocompleteOptions);
          } catch (error) {
            console.error("Search failed:", error);
            setResults({});
          } finally {
            setLoading(false);
          }
        }, 1000);
      };
    })(),
    [],
  );

  const onOptionSelect = (value: string) => {
    const symbol = results[value]?.symbol;
    if (symbol) {
      setSearchText(`${symbol?.displayName} - ${symbol?.description}`);
      onSymbolSelect(symbol.id);
    }
  };

  const renderAutocompleteOption: AutocompleteProps["renderOption"] = ({
    option,
  }) => {
    const { symbol, quote } = results[option.value];

    const change = quote?.change;

    let color = "";
    if (change > 0) color = "green";
    else if (change < 0) color = "red";
    return (
      <Group>
        <Text w={100} c={color}>
          {change >= 0 ? "+" : ""}
          {quote?.change_percent || 0}%
        </Text>
        <Text w={100}>{symbol?.displayName}</Text>
        <Text>{symbol?.description}</Text>
      </Group>
    );
  };

  useEffect(() => {
    if (searchText) debouncedSearch(searchText);
    else setResults({});
  }, [searchText, debouncedSearch]);

  return (
    <Autocomplete
      autoComplete="off"
      disabled={loading}
      data={Object.keys(results)}
      value={searchText}
      renderOption={renderAutocompleteOption}
      onChange={setSearchText}
      onOptionSubmit={onOptionSelect}
      filter={({ options }) => options}
    />
  );
}

export default SearchSymbols;
