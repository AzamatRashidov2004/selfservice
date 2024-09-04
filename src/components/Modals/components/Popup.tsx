import React from 'react';
import './Modals.css';

// Define types for button props
interface ButtonProps {
  text: string;
  type: 'info' | 'danger' | 'success' | 'primary' | 'secondary';
}

// Define types for the Popup props
interface PopupProps {
  title: string;
  text: string;
  buttons: {
    success: ButtonProps;
    cancel: ButtonProps;
    // Add other buttons if needed
  };
  onClose: (success: boolean) => void;
  isVisible: boolean;
}

// Define the Popup component
const Popup: React.FC<PopupProps> = ({ title, text, buttons, onClose, isVisible }) => {
  // Destructure buttons
  const { cancel, success } = buttons;

  return (
    <div className={`popup-overlay ${isVisible ? '' : 'no-shadow'}`}>
      <div className={`popup-container ${isVisible ? 'show' : ''}`}>
        <h2 className="popup-title">{title}</h2>
        <p className="popup-text">{text}</p>
        <div className="popup-buttons">
          <button
            className={`btn btn-${cancel.type}`}
            onClick={() => onClose(false)}
          >
            {cancel.text}
          </button>
          <button
            className={`btn btn-${success.type}`}
            onClick={() => onClose(true)}
          >
            {success.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
