import React, { useEffect } from 'react';
import '../Modals.css';

interface NotificationProps {
  title: string;
  text: string;
  type: 'info' | 'danger' | 'success' | 'primary' | 'secondary';
  isVisible: boolean;
  onClose: () => void;
  notification_time?: number;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  text,
  type,
  isVisible,
  onClose,
  notification_time = 2000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, notification_time); // Dismiss after notification_time
      return () => clearTimeout(timer); // Cleanup the timer on unmount
    }
  }, [isVisible, onClose, notification_time]);

  const parseText = (text: string) => {
    const lines = text.split('\n'); // Split text into lines by \n
    return lines.map((line, lineIndex) => (
      <p key={lineIndex}>
        {line.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIndex}>{part.slice(2, -2)}</strong> // Remove ** and render as bold
            );
          }
          return <span key={partIndex}>{part}</span>;
        })}
      </p>
    ));
  };

  return (
    <div className={`notification-container bg-${type} ${isVisible ? 'show' : ''}`}>
      <h2 className="notification-title">{title}</h2>
      <div className="notification-text">{parseText(text)}</div>
    </div>
  );
};

export default Notification;
