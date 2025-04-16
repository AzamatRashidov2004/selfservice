import React, { useState, useEffect, useRef } from "react";

interface CreateFolderModalProps {
  show: boolean;
  handleClose: () => void;
  handleCreate: (folderName: string) => void;
}

const CreateFolder: React.FC<CreateFolderModalProps> = ({
  show,
  handleClose,
  handleCreate,
}) => {
  const [folderName, setFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on the input when the modal is shown
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  // Handle keydown events for Escape and Enter
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCloseModal();
      } else if (e.key === "Enter") {
        if (folderName.trim()) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on unmount or when modal is hidden
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, folderName]);

  // Handle form submission
  const handleSubmit = () => {
    handleCreate(folderName.trim());
    setFolderName("");
    handleClose();
  };

  // Handle modal close and clear the input
  const handleCloseModal = () => {
    setFolderName("");
    handleClose();
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null; // Do not render the modal if it's not shown

  return (
    <>
      <div
        className={`modal fade show`}
        tabIndex={-1}
        style={{ display: "block" }}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ zIndex: 1050 }}
        >
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Create New Folder</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="formFolderName" className="form-label fw-bold">
                  Folder Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formFolderName"
                  placeholder="Enter folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  ref={inputRef}
                  onKeyDown={(e) => {
                    // Prevent form submission on Enter within the input
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (folderName.trim()) {
                        handleSubmit();
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={!folderName.trim()}
              >
                <i className="bi bi-folder-plus"></i> Create
              </button>
            </div>
          </div>
        </div>
        {/* Backdrop */}
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
        ></div>
      </div>
    </>
  );
};

export default CreateFolder;
