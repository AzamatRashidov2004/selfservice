import React, { useState, useRef, useEffect } from "react";

interface UploadFileModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpload: (files: File[]) => void;
}

const UploadFile: React.FC<UploadFileModalProps> = ({
  show,
  handleClose,
  handleUpload,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // Handle file selection via input
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

  // Handle file drop
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

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle form submission
  const handleSubmit = () => {
    handleUpload(selectedFiles);
    setSelectedFiles([]);
    handleCloseModal();
  };

  // Handle modal close and clear selected files
  const handleCloseModal = () => {
    setSelectedFiles([]);
    handleClose();
  };

  // Handle keydown events for Escape and Enter
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCloseModal();
      } else if (e.key === "Enter") {
        if (selectedFiles.length > 0) {
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
  }, [show, selectedFiles]);

  // Prevent background scrolling when modal is open
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
              <h5 className="modal-title">Upload Files</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={handleCloseModal}
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
                  onClick={() => {
                    const fileInput = document.getElementById(
                      "fileInput"
                    ) as HTMLInputElement;
                    fileInput.click();
                  }}
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
                onClick={handleCloseModal}
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
        {/* Backdrop */}
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
        ></div>
      </div>
    </>
  );
};

export default UploadFile;
