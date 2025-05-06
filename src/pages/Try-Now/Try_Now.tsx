import React from 'react';

const Try_Now: React.FC = () => {
  // Function to dispatch the custom event
  const triggerPopupEvent = () => {
    const showPopupEvent = new CustomEvent('showPopup', {
      detail: {
        title: 'Popup Test',
        text: 'This is my popup',
        buttons: {
          success: { text: 'Yes', type: 'success' },
          cancel: { text: 'No', type: 'danger' }
        },
        callback: (success: boolean) => {
          console.log("The event was " + (success ? "successful" : "canceled"));
        }
      }
    });

    window.dispatchEvent(showPopupEvent);
  };

  return (
    <div>
      <h1>Try Now Page</h1>
      <button onClick={triggerPopupEvent}>Trigger Popup Event</button>
    </div>
  );
}

export default Try_Now;