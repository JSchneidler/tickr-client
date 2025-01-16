import { useState } from "react";
import {
  Image,
  Group,
  Text,
  Button,
  Modal,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import {
  register,
  login,
  logout,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import TickrLogo from "../assets/tickr-logo.svg";

function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [opened, setOpened] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };
  // if (isRegistration) initialValues.name = "";
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
            // TODO: Move to function
            dispatch(
              isRegistration ? register({ ...values }) : login({ ...values }),
            );
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
        <Image src={TickrLogo} w={50} />
        {!isLoading && isAuthenticated && user && (
          <Group>
            <Text>
              {user.name}: ${user.balance} (+1.24%)
            </Text>
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          </Group>
        )}
        {!isLoading && !isAuthenticated && (
          <div>
            <Button onClick={onRegisterClick}>Register</Button>
            <Button onClick={onLoginClick} ml={5}>
              Login
            </Button>
          </div>
        )}
      </Group>
    </>
  );
}

export default Header;
