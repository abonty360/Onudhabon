import React from "react";
import { BellFill } from "react-bootstrap-icons";
import { Badge } from "react-bootstrap";
import "./NotificationBell.css";

const NotificationBell = ({ unreadCount, onClick }) => {
  return (
    <div className="notification-bell-container" onClick={onClick}>
      <BellFill size={24} className="notification-bell-icon" />
      {unreadCount > 0 && (
        <Badge pill bg="danger" className="notification-badge">
          {unreadCount}
        </Badge>
      )}
    </div>
  );
};

export default NotificationBell;
