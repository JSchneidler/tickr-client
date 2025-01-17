import SearchSymbols from "./SearchSymbols";

function StockSearch() {
  return <SearchSymbols onSymbolSelect={(id) => console.log(id)} />;
}

export default StockSearch;
