import { Routes, Route, BrowserRouter } from "react-router";
import Color from "./pages/Color";
import List from "./pages/List";
import Monitoramento from "./pages/Monitoramento";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Color" element={<Color />} />
        <Route path="/List" element={<List />} />
        <Route path="/Monitoramento" element={<Monitoramento />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
