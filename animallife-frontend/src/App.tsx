import { Routes, Route } from "react-router";
import Color from "./pages/Color";
import List from "./pages/List";
import Monitoramento from "./pages/Monitoramento";


function App() {
  return (
    <Routes>
      <Route path="/Color" element={<Color />} />
      <Route path="/List" element={<List />} />
      <Route path="/Monitoramento" element={<Monitoramento />}/>
    </Routes>
  );
}

export default App;
