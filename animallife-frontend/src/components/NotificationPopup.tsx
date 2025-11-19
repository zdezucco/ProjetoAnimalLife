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

                  <p className="notification-message">{n.message}</p>

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
