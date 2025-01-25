import { useState } from "react";
import {
  Group,
  Image,
  ScrollArea,
  SegmentedControl,
  Stack,
  Title,
} from "@mantine/core";

import { useGetCoinQuery, useGetCoinsQuery } from "../../store/api";
import Dollars from "../Dollars";
import Gain from "../Gain";
import { selectById } from "../../store/livePrices";
import { useAppSelector } from "../../store/hooks";

export type OnCoinSelect = (coinId: string) => void;

interface CoinProps {
  coinId: number;
}

function Coin({ coinId }: CoinProps) {
  const { data: coin } = useGetCoinQuery(coinId);
  const livePrice = useAppSelector((state) => selectById(state, coinId));

  if (!coin) return;

  return (
    <Stack>
      <Group justify="center" wrap="nowrap">
        <Image src={coin.imageUrl} h={25} />
        <Title order={4}>{coin.displayName}</Title>
      </Group>
      <Title order={5}>
        <Dollars
          value={
            livePrice && livePrice.price ? livePrice.price : coin.currentPrice
          }
        />
        <Gain change={coin.change} changePercent={coin.changePercent} />
      </Title>
    </Stack>
  );
}

interface CoinSelectorProps {
  onCoinSelect: OnCoinSelect;
}

function CoinSelector({ onCoinSelect }: CoinSelectorProps) {
  const { data: coins = [] } = useGetCoinsQuery();
  const [value, setValue] = useState<string>();

  const data = coins.map((coin) => ({
    label: <Coin coinId={coin.id} />,
    value: coin.id.toString(),
  }));

  const onChange = (value: string) => {
    setValue(value);
    onCoinSelect(value);
  };

  return (
    <ScrollArea>
      <SegmentedControl
        data={data}
        value={value}
        onChange={onChange}
        fullWidth
      />
    </ScrollArea>
  );
}

export default CoinSelector;
