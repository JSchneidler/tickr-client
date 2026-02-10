import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { SegmentedControl, SegmentedControlItem } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import Decimal from "decimal.js";
import dayjs from "dayjs";

import { useGetCoinHistoricalDataQuery } from "../../store/api";
import { useLivePrice } from "../../hooks/useLivePrice";

interface ChartProps {
  coinId: number;
}

interface ChartData {
  date: string;
  Price: number;
}

enum Timespan {
  LIVE = "LIVE",
  DAYS_1 = "1",
  DAYS_7 = "7",
  DAYS_30 = "30",
  DAYS_90 = "90",
  DAYS_180 = "180",
  DAYS_365 = "365",
}

const CHART_CONFIGS: Record<
  Timespan,
  { format: string; option: SegmentedControlItem }
> = {
  [Timespan.LIVE]: { format: "LTS", option: { label: "Live", value: "LIVE" } },
  [Timespan.DAYS_1]: { format: "LT", option: { label: "1d", value: "1" } },
  [Timespan.DAYS_7]: { format: "l", option: { label: "7d", value: "7" } },
  [Timespan.DAYS_30]: { format: "l", option: { label: "1m", value: "30" } },
  [Timespan.DAYS_90]: { format: "l", option: { label: "3m", value: "90" } },
  [Timespan.DAYS_180]: { format: "l", option: { label: "6m", value: "180" } },
  [Timespan.DAYS_365]: { format: "l", option: { label: "1y", value: "365" } },
};

function Chart({ coinId }: ChartProps) {
  const { price } = useLivePrice(coinId);
  const [livePrices, setLivePrices] = useState<ChartData[]>([]);
  const [timespan, setTimespan] = useState(Timespan.DAYS_1);

  const { data: historicalData, isFetching } = useGetCoinHistoricalDataQuery(
    { coinId, daysAgo: +timespan },
    {
      skip: !coinId || timespan === Timespan.LIVE,
    },
  );

  useLayoutEffect(() => {
    // TODO: Why does this kind of work at preventing flashing of other coin data on charts and should I do this?
    setLivePrices([]);
  }, [coinId]);

  useEffect(() => {
    if (price)
      setLivePrices((livePrices) => [
        ...livePrices,
        {
          date: dayjs().format(CHART_CONFIGS[timespan].format),
          Price: new Decimal(price).toNumber(),
        },
      ]);
  }, [price, timespan]);

  const chartData = useMemo(() => {
    let high: Decimal | undefined;
    let low: Decimal | undefined;
    const data = historicalData
      ? historicalData.prices.map((time) => {
          if (!high || high.lt(time[1]))
            high = new Decimal(time[1]).toSignificantDigits(8);
          if (!low || low.gt(time[1]))
            low = new Decimal(time[1]).toSignificantDigits(8);

          const t = dayjs(time[0]);
          return {
            date: t.format(CHART_CONFIGS[timespan].format), // TODO: Does this sort correctly?
            Price: time[1],
          };
        })
      : [];

    return {
      data,
      high,
      low,
    };
  }, [historicalData, timespan]);

  const domain = ["auto", "auto"];

  return (
    <div>
      <LineChart
        fillOpacity={isFetching ? 0.5 : 1}
        data={timespan === Timespan.LIVE ? livePrices : chartData.data}
        dataKey="date"
        series={[{ name: "Price" }]}
        h="300"
        withDots={false}
        // xAxisProps={} TODO: In live, can we set domain so points fill in from left to right?
        yAxisProps={{
          domain:
            timespan === Timespan.LIVE
              ? domain
              : [
                  chartData.low ? chartData.low.toNumber() : "auto",
                  chartData.high ? chartData.high.toNumber() : "auto",
                ],
        }}
      />
      <SegmentedControl
        data={Object.values(Timespan).map(
          (timespan) => CHART_CONFIGS[timespan].option,
        )}
        value={timespan}
        onChange={(value) => {
          setTimespan(value as Timespan);
        }}
        fullWidth
      />
    </div>
  );
}

export default Chart;
