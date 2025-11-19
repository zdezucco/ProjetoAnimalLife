import React from "react";
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
        return "var(--red-temp)";
      case "ATENÇÃO":
        return "var(--orange-temp)";
      default:
        return "var(--gray-temp)";
    }
  };

  const finalNotifications = notifications;

  // NotificationPopup.tsx (ou em utils.ts)
  const renderMarkdown = (text: string) => {
    // 1. Converte listas de Markdown para HTML (apenas o necessário)
    let html = text.replace(/-\s(.+)/g, '<li>$1</li>');
    html = `<ul>${html}</ul>`; // Envolve tudo em <ul>

    // 2. Converte quebras de linha duplas (\n\n) em parágrafos ou BRs
    html = html.replace(/\n/g, '<br/>');

    // 3. Converte negrito **texto** em <strong>texto</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Remove <ul> e </ul> de onde não deveria estar
    html = html.replace(/<br\/><ul>/g, '<ul>').replace(/<\/ul><br\/>/g, '</ul>');
    
    return html;
  };

  // ======================================================

  return (
    <div className="notification-popup-overlay" onClick={onClose}>
      <div
        className="notification-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <h3>Notificações</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {finalNotifications.length === 0 ? (
          <p className="no-notifications">Nenhuma notificação no momento.</p>
        ) : (
          <ul className="notification-list">
            {finalNotifications.map((n) => (
              <li
                key={n.id}
                className="notification-item"
                onClick={() => onNotificationClick && onNotificationClick(n)}
              >
                <img
                  src={n.image}
                  alt="Animal"
                  className="notification-img"
                />

                <div className="notification-info">

                  <h4 className="notification-title">{n.title}</h4>

                  <strong
                    className="notification-level"
                    style={{ color: getLevelColor(n.level) }}
                  >
                    {n.level}
                  </strong>

                  <div
                    className="notification-message"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(n.message) }}
                  />

                  <span className="notification-collar">
                    ID: {n.collar}
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
