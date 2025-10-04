import React from "react";
import "../styles/notification.css";

export type NotificationItem = {
  id: number;
  level: "URGENTE" | "ATENÇÃO";
  message: string;
  image: string;
  collar: string;
};

type NotificationPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Notificações</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="popup-content">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-card ${n.level === "URGENTE" ? "urgent" : "warning"}`}
            >
              <img src={n.image} alt="animal" className="animal-img" />
              <div className="notification-text">
                <h3>{n.level}!</h3>
                <p>{n.message}</p>
                <span className="collar">Coleira {n.collar}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
