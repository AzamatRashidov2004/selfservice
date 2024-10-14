import React, { useState } from "react";

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

  const handleSubmit = () => {
    handleCreate(folderName);
    setFolderName("");
    handleClose();
  };

  return (
    <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex={-1}>
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-content shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Create New Folder</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={handleClose}
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
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
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
      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
    </div>
  );
};

export default CreateFolder;
