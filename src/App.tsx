import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { createTheme, MantineProvider, AppShell } from "@mantine/core";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { check } from "./store/userSlice";
import { selectColorScheme, selectPrimaryColor } from "./store/themeSlice";

import Header from "./components/Header";
import SecurityBrowser from "./components/SecurityBrowser";

import "./App.css";

const HEADER_HEIGHT = 60;

function App() {
  const dispatch = useAppDispatch();
  const colorScheme = useAppSelector(selectColorScheme);
  const primaryColor = useAppSelector(selectPrimaryColor);

  useEffect(() => {
    dispatch(check());
  }, [dispatch]);

  const theme = createTheme({
    primaryColor,
    fontFamily: "Verdana, sans-serif",
  });

  return (
    <MantineProvider theme={theme} forceColorScheme={colorScheme}>
      <BrowserRouter>
        <AppShell h="100%" header={{ height: HEADER_HEIGHT }} padding="md">
          <AppShell.Header>
            <Header />
          </AppShell.Header>
          <AppShell.Main h="100%">
            <Routes>
              <Route index path="/" element={<SecurityBrowser />} />
              <Route path="/trade" element={<h1>Trade</h1>} />
              <Route path="/portfolio" element={<h1>Portfolio</h1>} />
              <Route path="/account" element={<h1>Account</h1>} />
              <Route path="/settings" element={<h1>Settings</h1>} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
