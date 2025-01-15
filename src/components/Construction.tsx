import { Flex, Image, Title } from "@mantine/core";
import TickrLogo from "../assets/tickr-logo-red.svg";

export default function Construction() {
  return (
    <Flex h="100%" gap="md" justify="center" align="center" direction="column">
      <Image w="25%" src={TickrLogo} />
      <Title>Welcome to Tickr! We are currently under construction.</Title>
    </Flex>
  );
}
