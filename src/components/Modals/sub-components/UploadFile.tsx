import React, { useState, useEffect, useRef } from "react";

interface UploadFileModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpload: (files: File[]) => void;
  mode: "folder" | "file";  // New prop to set initial mode
}

const UploadFile: React.FC<UploadFileModalProps> = ({
  show,
  handleClose,
  handleUpload,
  mode,
}) => {
  const [uploadMode, setUploadMode] = useState<"folder" | "file">(mode); // Initialize from prop

  useEffect(() => {
    setUploadMode(mode); // Update state when prop changes
  }, [mode]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Store input reference

  // Process files and remove the root folder
  const processFiles = (files: FileList) => {
    if (!files.length) return;

    let rootFolder: string | null = null;
    const processed: File[] = [];

    Array.from(files).forEach((file) => {
      if (file.webkitRelativePath) {
        // Extract root folder from the first file
        if (!rootFolder) {
          rootFolder = file.webkitRelativePath.split("/")[0];
        }

        // Remove root folder from path
        const newPath = rootFolder ? file.webkitRelativePath.replace(`${rootFolder}/`, "") : file.webkitRelativePath;

        processed.push(new File([file], newPath, { type: file.type, lastModified: file.lastModified }));
      } else {
        processed.push(file);
      }
    });

    setSelectedFiles(processed);
  };

  // Handle file/folder selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(files);
    }
  };

  // Handle drag & drop files
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle form submission (Send to API)
  const handleSubmit = () => {
    handleUpload(selectedFiles);
    setSelectedFiles([]);
    handleClose();
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedFiles([]);
    handleClose();
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div className={`modal fade show`} tabIndex={-1} style={{ display: "block" }} aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document" style={{ zIndex: 1050 }}>
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Upload Files</h5>
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              {/* Drag and Drop Zone */}
              <div
                className="drop-zone border border-primary rounded p-5 mb-3 text-center bg-light"
                style={{ cursor: "pointer", height: "250px" }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent multiple triggers
                  fileInputRef.current?.click();
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="form-control-file"
                  style={{ display: "none" }}
                  multiple
                  accept=".pdf, .xlsx, .csv"
                  onChange={handleFileChange}
                  {...(uploadMode === "folder"
                    ? ({ webkitdirectory: "true", directory: "true" } as Record<string, string>)
                    : {})}
                />
                <label style={{ cursor: "pointer", fontSize: "1.2rem", color: "#007bff" }}>
                  <i className="bi bi-upload"></i> Drag & drop or click to upload
                </label>
              </div>

              {/* Selected Files List */}
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
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="button" className="btn btn-success" onClick={handleSubmit} disabled={selectedFiles.length === 0}>
                <i className="bi bi-cloud-upload"></i> Upload
              </button>
            </div>
          </div>
        </div>
        {/* Backdrop */}
        <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      </div>
    </>
  );
};

export default UploadFile;
