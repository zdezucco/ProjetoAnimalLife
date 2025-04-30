import { Routes, Route, BrowserRouter } from "react-router";
import Color from "./pages/Color";
import List from "./pages/List";
import Login from "./pages/Login";
import Monitoramento from "./pages/Monitoramento";
import RecuperaSenha from "./pages/Recuperasenha";
import NovaSenha from "./pages/Novasenha";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Color" element={<Color />} />
        <Route path="/List" element={<List />} />
        <Route path="/Monitoramento" element={<Monitoramento />}/>
        <Route path="/Login" element={<Login />}/>
        <Route path="/RecuperaSenha" element={<RecuperaSenha />}/>
        <Route path="/Novasenha" element={<NovaSenha />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
