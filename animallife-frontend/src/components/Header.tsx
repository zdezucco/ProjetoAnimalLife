import { useState } from "react";
import { Bell, X } from "lucide-react";
import Editicon from "../assets/edit-icon.svg";
import Return from "../assets/return.svg";
import FavIcon from "../assets/fav-icon.svg";
import animalImage from "../assets/animal.svg";
import "../styles/header.css";
import { useNavigate } from "react-router";


const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const Retornar = () => {
    navigate("/List");
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const notifications = [
    { id: 1, text: "Monitoramento de Indira atualizado." },
    { id: 2, text: "Novo registro adicionado para Pantera." },
  ];

  return (
    <>
      <div className="header-container">
        <img
          src={Return}
          alt="Botão de voltar"
          className="icon-return"
          onClick={Retornar}
        />

        <div className="header-right">
          <div
            className="notification"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="bell-icon" />
            {/* 🔔 Contador dinâmico */}
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>
          <img src={FavIcon} alt="Ícone de Favorito" className="icon-star" />
        </div>
      </div>

      <div className="animal-photo-section">
        <div className="photo-wrapper">
          <img src={animalImage} alt="Animal" className="animal-photo" />
          <img src={Editicon} alt="Editar" className="edit-icon" />
        </div>
        <p className="animal-id">{}</p>
      </div>

      {/* POP-UP DE NOTIFICAÇÕES */}
      {showNotifications && (
        <div className="notification-popup-overlay" onClick={toggleNotifications}>
          <div
            className="notification-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h3>Notificações</h3>
              <X className="close-icon" onClick={toggleNotifications} />
            </div>
            <div className="popup-content">
              {notifications.length === 0 ? (
                <p>Sem notificações no momento.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="notification-item">
                    {n.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
