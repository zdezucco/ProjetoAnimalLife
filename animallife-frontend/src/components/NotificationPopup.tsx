import React from "react";
import CloseBtn from "../assets/close-btn.svg";
import "../styles/notification.css";

export type NotificationItem = {
  id: number | string;
  title: string;
  level: "URGENTE" | "ATENÇÃO";
  message: string;
  image: string;
  collar: string;
};

type NotificationPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
}) => {

  if (!isOpen) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "URGENTE":
        return "var(--red-temp, #FFBCBC)"; // Usando fallback
      case "ATENÇÃO":
        return "var(--orange-temp, #FEDAB9)"; // Usando fallback
      default:
        return "var(--gray-temp, #D9D9D9)";
    }
  };

  const finalNotifications = notifications;

  // FUNÇÃO SIMPLIFICADA para renderizar apenas negrito (sem listas)
  const renderSimpleMarkdown = (text: string) => {
    // 1. Converte negrito **texto** em <strong>texto</strong>
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 2. Converte quebras de linha duplas (\n) em <br> para respeitar a formatação de parágrafo
    html = html.replace(/\n/g, '<br/>');

    return html;
  };

  // Função auxiliar para remover o til (~) de ATENÇÃO e garantir que o CSS funcione
  const getCssLevel = (level: "URGENTE" | "ATENÇÃO") => {
    // Converte para minúsculo e remove o til (ã -> a)
    return level.toLowerCase().replace('ã', 'a');
  }

  return (
    <div className="notification-popup-overlay" onClick={onClose}>
      <div
        className="notification-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          {/* Altera <h3> para <h2> para corresponder ao CSS do header */}
          <h2>Notificações</h2>
          <button className="close-btn" onClick={onClose}>
            <img src={CloseBtn} alt="Fechar" className="close-icon-img" />
          </button>
        </div>

        {finalNotifications.length === 0 ? (
          <p className="no-notifications">Nenhuma notificação no momento.</p>
        ) : (
          <ul className="notification-list">
            {finalNotifications.map((n) => (
              <li
                key={n.id}
                className={`notification-item ${getCssLevel(n.level)}`}  // Adiciona classe 'urgente' ou 'atencao'
                onClick={() => onNotificationClick && onNotificationClick(n)}
              >
                {/* LINHA DE STATUS SUPERIOR (URGENTE! / ATENÇÃO!) */}
                <div className="notification-status-header">
                    <strong
                        className="notification-level-title"
                        style={{ color: getLevelColor(n.level) }}
                    >
                        {n.level}!
                    </strong>
                </div>
                
                <div className="notification-content-body">
                    <img
                        src={n.image}
                        alt="Animal"
                        className="notification-img"
                    />

                    <div className="notification-info">
                        {/* A nova mensagem será a mensagem genérica que precisa de negrito */}
                        <div
                            className="notification-message"
                            dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(n.message) }}
                        />
                    </div>
                </div>

                <div className="notification-footer">
                    <span className="notification-collar">
                        Coleira {n.collar}
                    </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;