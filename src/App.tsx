import "./App.css";
import "daisyui/dist/full.css";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Task from "./pages/Task";
import Setting from "./pages/Setting";
import About from "./pages/About";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/task/:id" element={<Task />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
