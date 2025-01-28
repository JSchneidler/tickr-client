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
import { skipToken } from "@reduxjs/toolkit/query";

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
  const { data: coin } = useGetCoinQuery(coinId ?? skipToken);
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

  const [buyDisabled, sellDisabled] = useMemo(() => {
    if (!cost || !user) return [true, true];

    const qty = new Decimal(quantity.getValue() ?? 0);
    const cst = new Decimal(cost);

    if (qty.eq(0)) return [true, true];

    if (quantityType === QuantityType.SHARES)
      return [
        qty.eq(0) || cst.gt(user.balance),
        !holding || qty.gt(holding.shares),
      ];
    else
      return [
        qty.eq(0) || qty.gt(user.balance),
        !holding || cst.gt(holding.shares),
      ];
  }, [cost, holding, user, quantity, quantityType]);

  function buy() {
    if (coinId)
      void createOrder({
        coinId,
        shares:
          quantityType === QuantityType.SHARES
            ? quantity.getValue()
            : undefined,
        price:
          quantityType === QuantityType.MONEY ? quantity.getValue() : undefined,
        type: OrderType.MARKET,
        direction: OrderDirection.BUY,
      });
  }

  function sell() {
    if (coinId)
      void createOrder({
        coinId,
        shares:
          quantityType === QuantityType.SHARES
            ? quantity.getValue()
            : undefined,
        price:
          quantityType === QuantityType.MONEY ? quantity.getValue() : undefined,
        type: OrderType.MARKET,
        direction: OrderDirection.SELL,
      });
  }

  function calculateCost() {
    if (!coin || !quantity.getValue() || quantity.getValue() === "0")
      setCost(undefined);
    else {
      const value = new Decimal(quantity.getValue()!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      if (quantityType === QuantityType.SHARES)
        setCost(new Decimal(value).mul(coin.currentPrice));
      else setCost(new Decimal(value).div(coin.currentPrice));
    }
  }

  function swapQuantityType() {
    if (quantityType === QuantityType.SHARES)
      setQuantityType(QuantityType.MONEY);
    else setQuantityType(QuantityType.SHARES);
  }

  function sellAllShares() {
    if (holding) {
      setQuantityType(QuantityType.SHARES);
      quantity.setValue(holding.shares);
    }
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

  return (
    <>
      <SegmentedControl
        data={[
          { value: OrderType.MARKET, label: "Market" },
          { value: OrderType.LIMIT, label: "Limit" },
        ]}
        value={orderType}
        onChange={(value) => {
          setOrderType(value as OrderType);
        }}
      />
      <NumberInput
        placeholder={
          quantityType === QuantityType.SHARES ? "Shares" : "Total Cost"
        }
        leftSection={quantitySwapButton}
        rightSection={allSharesButton}
        allowNegative={false}
        onValueChange={() => {
          calculateCost();
        }}
        {...quantity.getInputProps()}
      />
      {orderType === OrderType.LIMIT && (
        <NumberInput placeholder="Limit" allowNegative={false} />
      )}
      <Group>
        <Button.Group w="100%">
          <Button
            disabled={buyDisabled}
            onClick={() => {
              buy();
            }}
            color="green"
            fullWidth
          >
            Buy
          </Button>
          <Button
            disabled={sellDisabled}
            onClick={() => {
              sell();
            }}
            color="red"
            fullWidth
          >
            Sell
          </Button>
        </Button.Group>
        {cost && (
          <Center w="100%">
            {quantityType === QuantityType.SHARES && (
              <Dollars value={cost.toString()} />
            )}
            {quantityType === QuantityType.MONEY && (
              <Text>{cost.toString()} shares</Text>
            )}
          </Center>
        )}
      </Group>
    </>
  );
}

export default TradeForm;
