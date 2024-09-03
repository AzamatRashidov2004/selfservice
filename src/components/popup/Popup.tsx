import React from 'react';
import './Popup.css';

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
  const cancelButton = buttons.cancel;
  const successButton = buttons.success;

  // Return null if popup is not visible
  if (!isVisible) return null;

  return (
    <div className={`popup-overlay ${isVisible ? "show" : "hidden"}`}>
      <div className="popup-container">
        <h2 className="popup-title">{title}</h2>
        <p className="popup-text">{text}</p>
        <div className="popup-buttons">
          <button
            className={`btn btn-${successButton.type} close-button`}
            onClick={() => onClose(true)}>
            {successButton.text}
          </button>
          <button
            className={`btn btn-${cancelButton.type} close-button`}
            onClick={() => onClose(false)}>
            {cancelButton.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
