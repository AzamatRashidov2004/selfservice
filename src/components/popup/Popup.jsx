import PropTypes from 'prop-types';
import './Popup.css';

// Define the PropTypes for each button
const buttonPropType = PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['info', 'danger', 'success', 'primary', 'secondary']).isRequired,
  });
  
  // Define the PropTypes for the Popup component
  const propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    buttons: PropTypes.shape({
      success: buttonPropType,
      cancel: buttonPropType,
      // Add other buttons as needed
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired
  };

// Define the Popup component
const Popup = ({ title, text, buttons, onClose, isVisible }) => {
    const cancelButton = buttons.cancel;
    const successButton = buttons.success

  return (
    <div className={`popup-overlay show ${isVisible ? "show" : "hidden"}}`}>
      <div className="popup-container">
        <h2 className="popup-title">{title}</h2>
        <p className="popup-text">{text}</p>
        <div className="popup-buttons">
            <button className={`btn btn-${successButton.type} close-button`} onClick={() => {onClose(true)}}>
                {successButton.text}
            </button>
            <button className={`btn btn-${cancelButton.type} close-button`} onClick={() => {onClose(false)}}>
                {cancelButton.text}
            </button>
        </div>
      </div>
    </div>
  );
};

// Assign prop types to the Popup component
Popup.propTypes = propTypes;

export default Popup;
