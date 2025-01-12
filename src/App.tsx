import { Routes, Route } from "react-router";

import Ticker from "./Ticker";
import Construction from "./Construction";

import "./App.css";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Ticker />
      <Routes>
        <Route path="/" element={<Construction />} />
        <Route path="/trade" element={<h1 className="text-8xl">Trade</h1>} />
        <Route
          path="/portfolio"
          element={<h1 className="text-8xl">Portfolio</h1>}
        />
        <Route
          path="/account"
          element={<h1 className="text-8xl">Account</h1>}
        />
        <Route
          path="/settings"
          element={<h1 className="text-8xl">Settings</h1>}
        />
      </Routes>
    </div>
  );
}

export default App;
