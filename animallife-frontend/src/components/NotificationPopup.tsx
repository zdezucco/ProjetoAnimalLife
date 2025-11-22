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
        return "var(--red-temp, #FFBCBC)"; 
      case "ATENÇÃO":
        return "var(--orange-temp, #FEDAB9)";
      default:
        return "var(--gray-temp, #D9D9D9)";
    }
  };

  const finalNotifications = notifications;

  const renderSimpleMarkdown = (text: string) => {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    html = html.replace(/\n/g, '<br/>');

    return html;
  };

// CORREÇÃO: Função auxiliar para remover ACENTOS de forma robusta
  const getCssLevel = (level: "URGENTE" | "ATENÇÃO") => {
    const lower = level.toLowerCase();
    return lower.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
  };

  return (
    <div className="notification-popup-overlay" onClick={onClose}>
      <div
        className="notification-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
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
                className={`notification-item ${getCssLevel(n.level)}`} 
                onClick={() => onNotificationClick && onNotificationClick(n)}
              >
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