import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { SegmentedControl, SegmentedControlItem } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import Decimal from "decimal.js";
import moment from "moment";

import { useGetCoinHistoricalDataQuery } from "../../store/api";
import { useLivePrice } from "../../hooks/useLivePrice";

interface ChartProps {
  coinId: number;
}

interface ChartData {
  date: string;
  Price: number;
}

const CHART_TIMESPANS: Record<
  string,
  { format: string; option: SegmentedControlItem }
> = {
  LIVE: { format: "LTS", option: { label: "Live", value: "LIVE" } },
  "1": { format: "LT", option: { label: "1d", value: "1" } },
  "7": { format: "l", option: { label: "7d", value: "7" } },
  "30": { format: "l", option: { label: "1m", value: "30" } },
  "90": { format: "l", option: { label: "3m", value: "90" } },
  "180": { format: "l", option: { label: "6m", value: "180" } },
  "365": { format: "l", option: { label: "1y", value: "365" } },
};

function Chart({ coinId }: ChartProps) {
  const { price } = useLivePrice(coinId);
  const [livePrices, setLivePrices] = useState<ChartData[]>([]);
  const [timespan, setTimespan] = useState("1");

  const { data: historicalData, isFetching } = useGetCoinHistoricalDataQuery(
    { coinId: coinId!, daysAgo: +timespan },
    {
      skip: !coinId || timespan === CHART_TIMESPANS.LIVE.option.value,
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
          date: moment().format(CHART_TIMESPANS[timespan].format),
          Price: new Decimal(price).toNumber(),
        },
      ]);
  }, [price, timespan]);

  const chartData = useMemo(() => {
    let high: Decimal | null = null;
    let low: Decimal | null = null;
    const data = historicalData
      ? historicalData.prices.map((time) => {
          if (!high || high.lt(time[1]))
            high = new Decimal(time[1]).toSignificantDigits(8);
          if (!low || low.gt(time[1]))
            low = new Decimal(time[1]).toSignificantDigits(8);

          const t = moment(time[0]);
          return {
            date: t.format(CHART_TIMESPANS[timespan].format), // TODO: Does this sort correctly?
            Price: time[1],
          };
        })
      : null;

    return {
      data,
      high,
      low,
    };
  }, [historicalData, timespan]);

  return (
    <div>
      <LineChart
        fillOpacity={isFetching ? 0.5 : 1}
        data={
          timespan === CHART_TIMESPANS.LIVE.option.value
            ? livePrices
            : chartData.data
        }
        dataKey="date"
        series={[{ name: "Price" }]}
        h="300"
        withDots={false}
        // xAxisProps={} TODO: In live, can we set domain so points fill in from left to right?
        yAxisProps={
          chartData.data
            ? {
                domain: [chartData.low.toNumber(), chartData.high.toNumber()],
              }
            : {}
        }
      />
      <SegmentedControl
        data={["LIVE", "1", "7", "30", "90", "180", "365"].map(
          (timespan) => CHART_TIMESPANS[timespan].option,
        )}
        value={timespan}
        onChange={setTimespan}
        fullWidth
      />
    </div>
  );
}

export default Chart;
