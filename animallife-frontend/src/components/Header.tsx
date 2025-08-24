import {Bell} from "lucide-react";
import Editicon from '../assets/edit-icon.svg';
import Return from '../assets/return.svg';
import FavIcon from '../assets/fav-icon.svg';
import animalImage from '../assets/animal.svg';
import '../styles/header.css';
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();

  const Retornar = () => {
    navigate("/List");
  }
  return (
    <>
    <div className="header-container">
        <img src={Return} alt="Botão de voltar" className="icon-return" onClick={Retornar}/>
    <div className="header-right">
        <div className="notification">
            <Bell className="bell-icon" />
            <span className="notification-count">2</span>
        </div>
            <img src={FavIcon} alt="Ícone de Favorito" className="icon-star" />
        </div>
    </div>
    <div className="animal-photo-section">
      <div className="photo-wrapper"> {/* Wrapper para posicionamento relativo */}
        <img src={animalImage} alt="Animal" className="animal-photo" />
        <img src={Editicon} alt="Editar" className="edit-icon" />
      </div>
      <p className="animal-id">{}</p>
    </div>
    </>
  );
};

export default Header;