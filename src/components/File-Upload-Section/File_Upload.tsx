import React, { useState, useRef, useEffect } from "react";
import { FolderOpen, FileUpload } from "@mui/icons-material";
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
  const [folderFileCount, setFolderFileCount] = useState<number>(0);
  const [fileCount, setFileCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);


  // Handle file/folder selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files);
      setFileCount(files.length);
      setFolderFileCount(0);
      if (uploadMode === "folder") {
        const folderTree = await processFiles(files);
        setFolderStructure(folderTree);
      }
    }
  };

  // Handle folder upload changes
  const handleFolderChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      setFile(files);
      setFolderFileCount(files.length);
      setFileCount(0);
      const folderTree = await processFiles(files);
      setFolderStructure(folderTree);
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
      <h2 className="file-upload-title">Upload</h2>
      <div style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "15px",
      }}>
      <div
          className="file-upload-section"
          style={{
            flex: 1,
            cursor: "pointer",
            border: "2px solid #ccc",
            borderRight: "0px !important",
            padding: "50px",
            textAlign: "center",
          }}
          onClick={() => folderInputRef.current?.click()}
        >
          {folderFileCount === 0 ? (
            <>
            <FolderOpen style={{ fontSize: 40, color: "#3770F0" }} />
            <p style={{color: "#3770F0"}} >Click to upload a folder</p>
            </>
          ) : (
            <p style={{
              marginTop: "20px"
            }}>Folder selected ({folderFileCount} files)</p>
          )}
          <input
            ref={folderInputRef}
            type="file"
            style={{ display: "none" }}
            multiple
            accept=".pdf, .xlsx, .csv"
            onChange={handleFolderChange}
            // These attributes enable folder selection
            {...{ webkitdirectory: "true", directory: "true" }}
          />
      </div>

      {/* File Upload Field */}
      <div
          className="file-upload-section"
          style={{
            flex: 1,
            cursor: "pointer",
            border: "2px solid #ccc",
            borderLeft: "0px",
            padding: "50px",
            textAlign: "center",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {fileCount === 0 ? (
            <>
              <FileUpload style={{ fontSize: 40, color: "#3770F0" }} />
              <p style={{color: "#3770F0"}}>Click to upload files</p>
            </>
          ) : (
            <p style={{
              marginTop: "20px"
            }}>Files selected ({fileCount})</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            multiple
            accept=".pdf, .xlsx, .csv"
            onChange={handleFileChange}
          />
        </div>
      </div>
      
      {folderStructure && (
        <div className="folder-structure alert alert-info" role="alert">
          <h3>Selected</h3>
          <pre>{folderStructure}</pre>
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary"
          type="button"
          disabled={ (fileCount == 0 && folderFileCount == 0) || !file || (isAnalytical && !notationFile) }
          onClick={handleNextButtonClick}
        >
          Next Step
        </button>
      </div>
    </section>
  );
};

export default FileUploadSection;
