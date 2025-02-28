import React, { useState, useRef } from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
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
  setIsAnalytical,
  file,
  isAnalytical,
  notationFile,
  handleNextButtonClick,
}) => {
  const [folderStructure, setFolderStructure] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"folder" | "file">("folder"); // Default: Folder Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileCount, setFileCount] = useState<number>(0);

  // Handle file/folder selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files);
      setFileCount(files.length);
      if (uploadMode === "folder") {
        const folderTree = await processFiles(files);
        setFolderStructure(folderTree);
      }
    }
  };

  const processFiles = async (files: FileList) => {
    const folderMap: Record<string, string[]> = {};
    Array.from(files).forEach((file) => {
      const pathParts = file.webkitRelativePath.split("/");
      const folderPath = pathParts.slice(0, -1).join("/");
      if (!folderMap[folderPath]) {
        folderMap[folderPath] = [];
      }
      folderMap[folderPath].push(file.name);
      const fileExtension = getFileExstension(file.name);
      if (fileExtension === "xlsx" || fileExtension === "csv") {
        setIsAnalytical(true);
      }
    });
    return Object.entries(folderMap)
      .map(([folder, files]) => `${folder}/\n  - ${files.join("\n  - ")}`)
      .join("\n\n");
  };

  return (
    <section className="file-upload-wrapper mt-4">
      <h2 className="file-upload-title">Upload {uploadMode === "folder" ? "Folder" : "File"}</h2>
      <FormControl className="file-upload-form">
        <Select value={uploadMode} onChange={(e) => setUploadMode(e.target.value as "folder" | "file")}>
          <MenuItem value="folder">Folder Upload</MenuItem>
          <MenuItem value="file">File Upload</MenuItem>
        </Select>
      </FormControl>
      
      <div className="file-upload-section mb-3" onClick={() => fileInputRef.current?.click()} style={{ cursor: "pointer", border: "2px dashed #ccc", padding: "20px", textAlign: "center" }}>
        {
          fileCount === 0 ?
          <p>Click to upload {uploadMode === "folder" ? "a folder" : "files"}</p>
          :
          <span>Files selected {fileCount}</span>
        }

        <input
          ref={fileInputRef}
          type="file"
          className="form-control-file"
          style={{ display: "none" }}
          multiple
          accept=".pdf, .xlsx, .csv"
          onChange={handleFileChange}
          {...(uploadMode === "folder" ? { webkitdirectory: "true", directory: "true" } : {})}
        />
      </div>

      {folderStructure && (
        <div className="folder-structure alert alert-info" role="alert">
          <h3>{uploadMode === "folder" ? "Folder Structure" : "Selected Files"}</h3>
          <pre>{folderStructure}</pre>
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
