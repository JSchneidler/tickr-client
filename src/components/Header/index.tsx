import { useState } from "react";
import {
  Image,
  Group,
  Text,
  Button,
  Modal,
  NumberFormatter,
  PasswordInput,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { TbSunHigh, TbMoon } from "react-icons/tb";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectColorScheme, setColorScheme } from "../../store/themeSlice";

import TickrLogo from "../../assets/tickr-logo.svg";
import {
  useLogoutMutation,
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
} from "../../store/api";

function Header() {
  const dispatch = useAppDispatch();
  const colorScheme = useAppSelector(selectColorScheme);

  const { data: user } = useMeQuery();
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();

  const [opened, setOpened] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };
  if (isRegistration) initialValues.name = "";
  const form = useForm({
    mode: "uncontrolled",
    initialValues,
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  // function onFormSubmit() {
  //   return form.onSubmit((values) => {
  //     dispatch(isRegistration ? register({ ...values }) : login({ ...values }));
  //     setOpened(false);
  //   });
  // }

  function onRegisterClick() {
    setIsRegistration(true);
    setOpened(true);
  }

  function onLoginClick() {
    setIsRegistration(false);
    setOpened(true);
  }

  return (
    <>
      <Modal
        opened={opened}
        title={isRegistration ? "Register" : "Login"}
        centered
        onClose={() => setOpened(false)}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            // TODO: Move to function, don't close unless success
            if (isRegistration) register({ ...values });
            else login({ ...values });
            setOpened(false);
            form.reset();
          })}
        >
          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          {isRegistration && (
            <TextInput
              required
              label="Name"
              placeholder="Doug Smith"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
          )}
          <PasswordInput
            required
            label="Password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>
      <Group justify="space-between" align="center" h="100%" px={5}>
        <Image src={TickrLogo} w={50} id="logo" />
        <Group>
          {user && (
            <>
              <Text>
                {user.name}:{" "}
                <NumberFormatter
                  prefix="$"
                  value={user.balance}
                  thousandSeparator
                />{" "}
                (+1.24%)
              </Text>
              <Button onClick={() => logout()}>Logout</Button>
            </>
          )}
          {!user && (
            <>
              <Button onClick={onRegisterClick}>Register</Button>
              <Button onClick={onLoginClick} ml={5}>
                Login
              </Button>
            </>
          )}
          <ActionIcon
            onClick={() =>
              dispatch(
                setColorScheme(colorScheme === "dark" ? "light" : "dark"),
              )
            }
          >
            {colorScheme === "dark" && <TbSunHigh />}
            {colorScheme === "light" && <TbMoon />}
          </ActionIcon>
        </Group>
      </Group>
    </>
  );
}

export default Header;
