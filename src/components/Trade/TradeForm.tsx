import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Group,
  SegmentedControl,
  NumberInput,
  Text,
  ActionIcon,
  Center,
} from "@mantine/core";
import { useField } from "@mantine/form";
import Decimal from "decimal.js";

import {
  useCreateOrderMutation,
  useGetCoinQuery,
  useGetMyHoldingsQuery,
  useMeQuery,
} from "../../store/api";
import { OrderDirection, OrderType } from "../../store/api/schema";
import Dollars from "../Dollars";
import { selectHoldingForCoin } from "../../store/selectors";

enum QuantityType {
  SHARES,
  MONEY,
}

interface OrdersProps {
  coinId?: number;
}

function TradeForm({ coinId }: OrdersProps) {
  const [quantityType, setQuantityType] = useState(QuantityType.SHARES);
  const [orderType, setOrderType] = useState(OrderType.MARKET);
  const [cost, setCost] = useState<Decimal>();

  const { data: user } = useMeQuery();
  const { data: coin } = useGetCoinQuery(coinId, { skip: !coinId });
  const { holding } = useGetMyHoldingsQuery(undefined, {
    selectFromResult: (result) => ({
      holding: selectHoldingForCoin(result, coinId),
    }),
  });
  const [createOrder] = useCreateOrderMutation();

  const quantity = useField<string | undefined>({
    initialValue: undefined,
  });

  useEffect(calculateCost, [coin, quantity, quantityType]);

  function buy() {
    createOrder({
      coinId,
      shares:
        quantityType === QuantityType.SHARES ? quantity.getValue() : undefined,
      price:
        quantityType === QuantityType.MONEY ? quantity.getValue() : undefined,
      type: OrderType.MARKET,
      direction: OrderDirection.BUY,
    });
  }

  function sell() {
    createOrder({
      coinId,
      shares:
        quantityType === QuantityType.SHARES ? quantity.getValue() : undefined,
      price:
        quantityType === QuantityType.MONEY ? quantity.getValue() : undefined,
      type: OrderType.MARKET,
      direction: OrderDirection.SELL,
    });
  }

  function calculateCost() {
    try {
      const value = new Decimal(quantity.getValue());
      if (value) {
        if (quantityType === QuantityType.SHARES)
          setCost(new Decimal(value).mul(coin?.currentPrice));
        else setCost(new Decimal(value).div(coin?.currentPrice));
      }
    } catch {
      setCost(undefined);
    }
  }

  function swapQuantityType() {
    if (quantityType === QuantityType.SHARES)
      setQuantityType(QuantityType.MONEY);
    else setQuantityType(QuantityType.SHARES);
  }

  function sellAllShares() {
    setQuantityType(QuantityType.SHARES);
    quantity.setValue(holding.shares);
  }

  const quantitySwapButton = (
    <ActionIcon onClick={swapQuantityType} variant="subtle">
      {quantityType === QuantityType.SHARES ? "#" : "$"}
    </ActionIcon>
  );

  const allSharesButton = (
    <ActionIcon onClick={sellAllShares} disabled={!holding} variant="default">
      All
    </ActionIcon>
  );

  const [buyDisabled, sellDisabled] = useMemo(() => {
    if (!quantity.getValue() || quantity.getValue() === "0" || !cost || !user)
      return [true, true];

    const qty = new Decimal(quantity.getValue());
    const cst = new Decimal(cost);

    if (qty.eq(0)) return [true, true];

    if (quantityType === QuantityType.SHARES)
      return [
        qty.eq(0) || cst.gt(user?.balance),
        !holding || qty.gt(holding.shares),
      ];
    else if (quantityType === QuantityType.MONEY)
      return [
        qty.eq(0) || qty.gt(user?.balance),
        !holding || cst.gt(holding.shares),
      ];

    return [true, true];
  }, [cost, holding, user, quantity, quantityType]);

  return (
    <>
      <SegmentedControl
        data={[
          { value: OrderType.MARKET, label: "Market" },
          { value: OrderType.LIMIT, label: "Limit" },
          { value: OrderType.STOP, label: "Stop" },
          { value: OrderType.TRAILING_STOP, label: "Trailing Stop" },
        ]}
        value={orderType}
        onChange={setOrderType}
      />
      <NumberInput
        placeholder={
          quantityType === QuantityType.SHARES ? "Shares" : "Total Cost"
        }
        leftSection={quantitySwapButton}
        rightSection={allSharesButton}
        allowNegative={false}
        onValueChange={({ value }) => calculateCost(value)}
        {...quantity.getInputProps()}
      />
      {orderType === OrderType.LIMIT && (
        <NumberInput placeholder="Limit" allowNegative={false} />
      )}
      <Group>
        <Button.Group w="100%">
          <Button
            disabled={buyDisabled}
            onClick={() => buy()}
            color="green"
            fullWidth
          >
            Buy
          </Button>
          <Button
            disabled={sellDisabled}
            onClick={() => sell()}
            color="red"
            fullWidth
          >
            Sell
          </Button>
        </Button.Group>
        {cost && (
          <Center w="100%">
            {quantityType === QuantityType.SHARES && (
              <Dollars value={cost?.toString()} />
            )}
            {quantityType === QuantityType.MONEY && (
              <Text>{cost?.toString()} shares</Text>
            )}
          </Center>
        )}
      </Group>
    </>
  );
}

export default TradeForm;
