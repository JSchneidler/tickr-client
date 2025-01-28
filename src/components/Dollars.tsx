import { NumberFormatter, Text } from "@mantine/core";
import Decimal from "decimal.js";

interface DollarsProps {
  value?: string;
}

function Dollars({ value }: DollarsProps) {
  return (
    value && (
      <Text>
        <NumberFormatter
          prefix="$"
          value={new Decimal(value).toDecimalPlaces(2).toString()}
          thousandSeparator
        />
      </Text>
    )
  );
}

export default Dollars;
