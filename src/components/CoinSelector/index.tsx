import { SegmentedControl } from "@mantine/core";

import { useGetCoinsQuery } from "../../store/api";
import { useState } from "react";

export type OnCoinSelect = (coinId: string) => void;

interface CoinSelectorProps {
  onCoinSelect: OnCoinSelect;
}

function CoinSelector({ onCoinSelect }: CoinSelectorProps) {
  const { data: coins = [] } = useGetCoinsQuery();
  const [value, setValue] = useState<string>();

  const data = coins.map((coin) => ({
    label: coin.displayName,
    value: coin.id.toString(),
  }));

  const onChange = (value: string) => {
    setValue(value);
    onCoinSelect(value);
  };

  return <SegmentedControl data={data} value={value} onChange={onChange} />;
}

export default CoinSelector;
