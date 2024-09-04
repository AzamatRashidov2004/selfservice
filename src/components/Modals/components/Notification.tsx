import React, { useEffect } from 'react';
import './Modals.css';

interface NotificationProps {
  title: string;
  text: string;
  type: 'info' | 'danger' | 'success' | 'primary' | 'secondary';
  isVisible: boolean;
  onClose: () => void;
  notification_time?: number;
}

const Notification: React.FC<NotificationProps> = ({ title, text, type, isVisible, onClose, notification_time=2000 }) => {
    console.log("typetype", type)
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, notification_time); // Dismiss after 2 seconds
      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [isVisible, onClose, notification_time]);

  return (
    <div className={`notification-container bg-${type} ${isVisible ? 'show' : ''}`}>
      <h2 className="notification-title">{title}</h2>
      <p className="notification-text">{text}</p>
    </div>
  );
};

export default Notification;