import { Routes, Route, BrowserRouter } from "react-router";
import List from "./pages/List";
import Login from "./pages/Login";
import Monitoramento from "./pages/Monitoramento";
import RecuperaSenha from "./pages/Recuperasenha";
import NovaSenha from "./pages/Novasenha";
import LoadingScreen from "./pages/Loadinscreen";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/List" element={<List />} />
        <Route path="/Monitoramento" element={<Monitoramento />}/>
        <Route path="/Login" element={<Login />}/>
        <Route path="/RecuperaSenha" element={<RecuperaSenha />}/>
        <Route path="/Novasenha" element={<NovaSenha />}/> 
        <Route path="/LoadingScreen" element={<LoadingScreen />}/> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
