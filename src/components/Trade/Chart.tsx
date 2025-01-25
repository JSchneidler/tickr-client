import { useEffect, useState } from "react";
import { LineChart } from "@mantine/charts";
import Decimal from "decimal.js";
import moment from "moment";

import { useGetCoinHistoricalDataQuery } from "../../store/api";
import { useAppSelector } from "../../store/hooks";
import { selectById } from "../../store/livePrices";

interface ChartProps {
  coinId?: number;
}

interface ChartData {
  date: string;
  Price: number;
}

function Chart({ coinId }: ChartProps) {
  const { data: historicalData } = useGetCoinHistoricalDataQuery(coinId!, {
    skip: !coinId,
  });
  const livePrice = useAppSelector((state) => selectById(state, coinId));
  const [livePrices, setLivePrices] = useState<ChartData[]>([]);

  useEffect(() => {
    setLivePrices((livePrices) => [
      ...livePrices,
      {
        date: moment().format("LT"),
        Price: Decimal(livePrice.price).toNumber(),
      },
    ]);
  }, [livePrice]);

  if (!historicalData) return;

  let high: Decimal;
  let low: Decimal;
  const chartData = historicalData.prices
    .map((time) => {
      if (!high || high.lt(time[1]))
        high = new Decimal(time[1]).toSignificantDigits(8);
      if (!low || low.gt(time[1]))
        low = new Decimal(time[1]).toSignificantDigits(8);

      const t = moment(time[0]);
      return {
        date: t.format("LT"),
        Price: time[1],
      };
    })
    .concat(livePrices);

  return (
    <LineChart
      data={chartData}
      dataKey="date"
      series={[{ name: "Price" }]}
      h="300"
      withDots={false}
      yAxisProps={{ domain: [low.toNumber(), high.toNumber()] }}
    />
  );
}

export default Chart;
