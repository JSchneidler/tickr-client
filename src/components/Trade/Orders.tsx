import { Table } from "@mantine/core";

import { useGetMyOrdersQuery } from "../../store/api";

interface OrdersProps {
  coinId?: number;
}

function Orders({ coinId }: OrdersProps) {
  const { orders } = useGetMyOrdersQuery(true, {
    selectFromResult: ({ data }) => ({
      orders: data?.filter((order) => order.coinId === coinId),
    }),
  });

  if (orders?.length === 0) return;

  const rows = orders.map((order) => (
    <Table.Tr key={order.id}>
      <Table.Td>{order.direction}</Table.Td>
      <Table.Td>{order.type}</Table.Td>
      <Table.Td>{order.shares}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Direction</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Shares</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

export default Orders;
