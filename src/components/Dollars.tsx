import { NumberFormatter } from "@mantine/core";
import Decimal from "decimal.js";

interface DollarsProps {
  value?: string;
}

function Dollars({ value }: DollarsProps) {
  return (
    value && (
      <NumberFormatter
        prefix="$"
        value={new Decimal(value).toDecimalPlaces(2).toString()}
        thousandSeparator
      />
    )
  );
}

export default Dollars;
