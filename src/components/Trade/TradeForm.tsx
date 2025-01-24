import { Button, Group, SegmentedControl, NumberInput } from "@mantine/core";
import { useField } from "@mantine/form";

import { useCreateOrderMutation } from "../../store/api";
import { OrderDirection, OrderType } from "../../store/api/schema";

interface OrdersProps {
  coinId?: number;
}

function TradeForm({ coinId }: OrdersProps) {
  const [createOrder] = useCreateOrderMutation();

  const field = useField({
    initialValue: null,
  });

  function buy() {
    createOrder({
      coinId,
      shares: field.getValue(),
      type: OrderType.MARKET,
      direction: OrderDirection.BUY,
    });
  }

  function sell() {
    createOrder({
      coinId,
      shares: field.getValue(),
      type: OrderType.MARKET,
      direction: OrderDirection.SELL,
    });
  }

  // const [cost, setCost] = useState<number>();

  // useEffect(() => {
  //   if (shares) {
  //     console.log(shares);
  //     const amount = new Decimal(shares);
  //     setCost(amount.mul(coin?.currentPrice).toNumber());
  //   } else setCost(undefined);
  // }, [shares, coin]);

  // const dispatch = useAppDispatch();
  // const coin = useAppSelector(selectCoin);
  // const status = useAppSelector(selectStatus);

  // const validCost = cost && cost > 0;
  // return (
  //   <div>
  //     {status === "loading" && <Loader />}
  //     {status === "idle" && coin && (
  //
  //     )}
  //   </div>
  // );

  return (
    <>
      <SegmentedControl data={["Market", "Limit", "Stop", "Trailing Stop"]} />
      <NumberInput placeholder="Shares" min={0} {...field.getInputProps()} />
      <Group>
        <Button.Group>
          {/* <Button color="green" disabled={!validCost} onClick={() => buy()}> */}
          <Button color="green" onClick={() => buy()}>
            Buy
          </Button>
          {/* <Button color="red" disabled={!validCost} onClick={() => sell()}> */}
          <Button color="red" onClick={() => sell()}>
            Sell
          </Button>
        </Button.Group>
        {/* {validCost && Dollars(cost.toFixed(2))} */}
      </Group>
    </>
  );
}

export default TradeForm;
