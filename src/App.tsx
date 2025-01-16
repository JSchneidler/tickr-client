import { useEffect } from "react";
import { AppShell } from "@mantine/core";
import { Routes, Route } from "react-router";

import Header from "./components/Header";

import { useAppDispatch } from "./store/hooks";
import { check } from "./store/authSlice";

import "./App.css";

const HEADER_HEIGHT = 60;

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(check());
  }, [dispatch]);

  return (
    <AppShell
      bg="darkgray"
      h="100%"
      header={{ height: HEADER_HEIGHT }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main h="100%">
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/trade" element={<h1>Trade</h1>} />
          <Route path="/portfolio" element={<h1>Portfolio</h1>} />
          <Route path="/account" element={<h1>Account</h1>} />
          <Route path="/settings" element={<h1>Settings</h1>} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
