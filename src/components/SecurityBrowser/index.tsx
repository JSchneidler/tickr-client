import {
  Title,
  Loader,
  Container,
  Text,
  Divider,
  Stack,
  Group,
  NumberFormatter,
  Button,
  NumberInput,
  SegmentedControl,
} from "@mantine/core";
import { useField } from "@mantine/form";
import Decimal from "decimal.js";

import SearchSymbols from "./SearchSymbols";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { buySecurity, selectSecurity, selectStatus } from "./slice";
import { useEffect, useState } from "react";

interface InfoProps {
  label: string;
  element: JSX.Element;
}

const Dollars = (value: string) => (
  <NumberFormatter
    prefix="$"
    value={new Decimal(value).toDecimalPlaces(2).toString()}
    thousandSeparator
  />
);

function Info({ label, element }: InfoProps) {
  return (
    <Group justify="space-between">
      <Text>{label}</Text>
      <Text fw="bold">{element}</Text>
    </Group>
  );
}

function SecurityBrowser() {
  const dispatch = useAppDispatch();
  const security = useAppSelector(selectSecurity);
  const status = useAppSelector(selectStatus);

  const [shares, setShares] = useState<number>();
  const [cost, setCost] = useState<number>();

  const field = useField({
    initialValue: null,
  });

  useEffect(() => {
    if (shares) {
      console.log(shares);
      const amount = new Decimal(shares);
      setCost(amount.mul(security?.currentPrice).toNumber());
    } else setCost(undefined);
  }, [shares, security]);

  function buy() {
    dispatch(buySecurity({ shares, symbolId: security.id }));
  }

  function sell() {}

  const validCost = cost && cost > 0;

  return (
    <div>
      <SearchSymbols />
      {status === "loading" && <Loader />}
      {status === "idle" && security && (
        <Container pt={50}>
          <Title order={2}>
            {security.companyName} ({security.displayName})
          </Title>
          <Title>{Dollars(security.currentPrice)}</Title>
          <Divider m={10} />
          <Group justify="space-between" align="flex-start" grow>
            <Stack>
              <Info
                label="Previous Close"
                element={Dollars(security.previousClose)}
              />
              <Info label="Open" element={Dollars(security.previousClose)} />
              <Info
                label="Range"
                element={
                  <>
                    {Dollars(security.dayLow)} - {Dollars(security.dayHigh)}
                  </>
                }
              />
            </Stack>
            <Text>{security.companyDescription}</Text>
          </Group>
          <Divider m={10} />
          <SegmentedControl
            data={["Market", "Limit", "Stop", "Trailing Stop"]}
          />
          <NumberInput
            placeholder="Shares"
            min={0}
            {...field.getInputProps()}
            onChange={setShares}
          />
          <Group>
            <Button.Group>
              <Button color="green" disabled={!validCost} onClick={() => buy()}>
                Buy
              </Button>
              <Button color="red" disabled={!validCost} onClick={() => sell()}>
                Sell
              </Button>
            </Button.Group>
            {validCost && Dollars(cost.toFixed(2))}
          </Group>
          <Divider m={10} />
        </Container>
      )}
    </div>
  );
}

export default SecurityBrowser;
