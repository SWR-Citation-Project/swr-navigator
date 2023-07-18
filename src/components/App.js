import React from "react";
import { 
  Routes, 
  Route 
} from "react-router-dom";
import Home from "./Home";
import Header from "./Header";
import Network from "./Network";
// import LoadHubs from "./LoadHubs";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/network" element={<Network />} />
        {/* <Route path="/clusters" element={<Clusters />} /> */}
        {/* <Route path="/hubs" element={<LoadHubs />} /> */}
      </Routes>
    </>
  );
}
