import { AppShell, Burger, Button, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// import { Routes, Route } from "react-router";

// import Ticker from "./Ticker";
// import Construction from "./Construction";

import "./App.css";

function App() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Button onClick={toggle}>Collapse</Button>
        Main
      </AppShell.Main>
    </AppShell>
  );
}

// function App() {
//   return (
//     <div className="flex h-screen flex-col">
//       {/* <Ticker /> */}
//       <Routes>
//         <Route path="/" element={<Construction />} />
//         <Route path="/trade" element={<h1 className="text-8xl">Trade</h1>} />
//         <Route
//           path="/portfolio"
//           element={<h1 className="text-8xl">Portfolio</h1>}
//         />
//         <Route
//           path="/account"
//           element={<h1 className="text-8xl">Account</h1>}
//         />
//         <Route
//           path="/settings"
//           element={<h1 className="text-8xl">Settings</h1>}
//         />
//       </Routes>
//     </div>
//   );
// }

export default App;
