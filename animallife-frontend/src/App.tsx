import { Routes, Route, BrowserRouter } from "react-router";
import List from "./pages/List";
import Login from "./pages/Login";
import Monitoramento from "./pages/Monitoramento";
import RecuperaSenha from "./pages/Recuperasenha";
import NovaSenha from "./pages/Novasenha";
import LoadingScreen from "./pages/Loadinscreen";
import Monitoramento2 from "./pages/Monitoramento2";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/List" element={<List />} />
        <Route path="/Monitoramento" element={<Monitoramento />}/>
        <Route path="/Monitoramento2" element={<Monitoramento2 />}/>
        <Route path="/RecuperaSenha" element={<RecuperaSenha />}/>
        <Route path="/Novasenha" element={<NovaSenha />}/> 
        <Route path="/LoadingScreen" element={<LoadingScreen />}/> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
