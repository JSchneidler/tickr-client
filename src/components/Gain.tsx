import { Text } from "@mantine/core";
import Decimal from "decimal.js";

interface GainProps {
  change?: string;
  changePercent?: string;
}

function Gain({ change, changePercent }: GainProps) {
  if (!change || !changePercent) return;

  const changeDecimal = new Decimal(changePercent);
  const prefix = changeDecimal.gte(0) ? "+" : undefined;

  let color = undefined;
  if (changeDecimal.gt(0)) color = "green";
  else if (changeDecimal.lt(0)) color = "red";

  return (
    <Text c={color}>
      {prefix}
      {change} ({changePercent}%)
    </Text>
  );
}

export default Gain;
