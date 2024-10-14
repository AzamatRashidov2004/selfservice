import React, { useState, useRef } from "react";

interface UploadFileModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpload: (files: File[]) => void;
}

const UploadFileModal: React.FC<UploadFileModalProps> = ({
  show,
  handleClose,
  handleUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(
        (file) =>
          !selectedFiles.some(
            (f) => f.name === file.name && f.size === file.size
          )
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          !selectedFiles.some(
            (f) => f.name === file.name && f.size === file.size
          )
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    handleUpload(selectedFiles);
    setSelectedFiles([]);
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
            <h5 className="modal-title">Upload Files</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label fw-bold">
                Drag and drop files here or click below to browse
              </label>
              <div
                ref={dropZoneRef}
                className="drop-zone border border-primary rounded p-5 mb-3 text-center bg-light"
                style={{ cursor: "pointer", height: "250px" }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  className="form-control-file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  id="fileInput"
                  multiple
                />
                <label
                  htmlFor="fileInput"
                  style={{
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    color: "#007bff",
                  }}
                >
                  <i className="bi bi-upload"></i> Drop files here or click to
                  select
                </label>
              </div>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  multiple
                />
              </div>
              {selectedFiles.length > 0 && (
                <div className="alert alert-info" role="alert">
                  <ul className="mb-0">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
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
              disabled={selectedFiles.length === 0}
            >
              <i className="bi bi-cloud-upload"></i> Upload
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
    </div>
  );
};

export default UploadFileModal;
