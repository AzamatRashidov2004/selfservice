import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import "./File_Upload.css";
import getFileExstension from "../../utility/File_Exstension";

interface FileUploadSectionProps {
  setFile: React.Dispatch<React.SetStateAction<FileList | null>>;
  setNotationFile: React.Dispatch<React.SetStateAction<File | null>>;
  setIsAnalytical: React.Dispatch<React.SetStateAction<boolean>>;
  file: FileList | null;
  isAnalytical: boolean;
  notationFile: File | null;
  handleNextButtonClick: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  setFile,
  setNotationFile,
  setIsAnalytical,
  file,
  isAnalytical,
  notationFile,
  handleNextButtonClick,
}) => {
  const [folderStructure, setFolderStructure] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"folder" | "file">("folder"); // Default: Folder Upload

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setUploadMode(newValue === 0 ? "folder" : "file");
  };

  // Handle file/folder selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files);

      // If folder upload, process folder structure
      if (uploadMode === "folder") {
        const folderTree = await processFiles(files);
        setFolderStructure(folderTree);
      }
    }
  };

  // Process files recursively and build folder structure
  const processFiles = async (files: FileList) => {
    const folderMap: Record<string, string[]> = {};

    Array.from(files).forEach((file) => {
      const pathParts = file.webkitRelativePath.split("/");
      const folderPath = pathParts.slice(0, -1).join("/"); // Get the folder path

      if (!folderMap[folderPath]) {
        folderMap[folderPath] = [];
      }

      if (file.name.endsWith(".pdf")) {
        folderMap[folderPath].push(file.name);
      }

      // Check if it's an analytical file (Excel or CSV)
      const fileExtension = getFileExstension(file.name);
      if (fileExtension === "xlsx" || fileExtension === "csv") {
        setIsAnalytical(true);
      }
    });

    // Convert to readable tree structure
    return Object.entries(folderMap)
      .map(([folder, pdfs]) => `${folder}/\n  - ${pdfs.join("\n  - ")}`)
      .join("\n\n");
  };

  // Handle annotation file upload (for analytical apps)
  const handleNotationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setNotationFile(selectedFile);
    }
  };

  return (
    <section className="file-upload-wrapper mt-4">
      <h2 className="file-upload-title">Upload File or Folder</h2>

      {/* MUI Tabs for switching between Folder and File Upload */}
      <Tabs className="tabs-new-project" value={uploadMode === "folder" ? 0 : 1} onChange={handleTabChange} aria-label="scrollable force tabs example" centered>
        <Tab label="Folder Upload" />
        <Tab label="File Upload" />
      </Tabs>

      {uploadMode === "folder" ? (
        // FOLDER UPLOAD MODE
        <div className="file-upload-section mb-3">
          <label htmlFor="folderUpload" className="form-label">
            Select a folder containing <b>.pdf, .csv, .xlsx</b> files.
          </label>
          <input
            className="form-control"
            type="file"
            id="folderUpload"
            accept=".pdf, .xlsx, .csv"
            webkitdirectory="true"
            directory="true"
            multiple
            onChange={handleFileChange}
          />
        </div>
      ) : (
        // FILE UPLOAD MODE
        <div className="file-upload-section mb-3">
          <label htmlFor="fileUpload" className="form-label">
            Select individual <b>.pdf, .csv, .xlsx</b> files.
          </label>
          <input
            className="form-control"
            type="file"
            id="fileUpload"
            accept=".pdf, .xlsx, .csv"
            multiple
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Display folder structure if a folder is uploaded */}
      {uploadMode === "folder" && folderStructure && (
        <div className="folder-structure">
          <h3>Folder Structure</h3>
          <pre>{folderStructure}</pre>
        </div>
      )}

      {isAnalytical && (
        <div className="notation-upload">
          <h2 className="file-upload-title">Upload Notation File</h2>
          <div className="file-upload-section mb-3">
            <label htmlFor="notationFile" className="form-label">
              Please upload the annotation file.
            </label>
            <input
              className="form-control"
              type="file"
              id="notationFile"
              accept=".json"
              onChange={handleNotationChange}
            />
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary"
          type="button"
          disabled={!file || (isAnalytical && !notationFile)}
          onClick={handleNextButtonClick}
        >
          Next Step
        </button>
      </div>
    </section>
  );
};

export default FileUploadSection;
