import { LineChart } from "@mantine/charts";

import { useGetCoinHistoricalDataQuery } from "../../store/api";

interface ChartProps {
  coinId?: number;
}

function Chart({ coinId }: ChartProps) {
  const { data: historicalData } = useGetCoinHistoricalDataQuery(coinId!, {
    skip: !coinId,
  });

  if (!historicalData) return;

  let high = 0;
  let low = 0;
  const chartData = historicalData.prices.map((time) => {
    if (time[1] > high) high = time[1];
    if (time[1] > low) low = time[1];

    const date = new Date(time[0]);

    return {
      date: `${date.getHours()}:${date.getMinutes()}`,
      Price: time[1],
    };
  });

  return (
    <LineChart
      data={chartData}
      dataKey="date"
      series={[{ name: "Price" }]}
      h="300"
      withDots={false}
      yAxisProps={{ domain: [low, high] }}
    />
  );
}

export default Chart;
