import React from 'react';
import "./File_Upload.css";
import getFileExstension from "../../utility/File_Exstension";

interface FileUploadSectionProps {
  step: number;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setNotationFile: React.Dispatch<React.SetStateAction<File | null>>;
  setIsAnalytical: React.Dispatch<React.SetStateAction<boolean>>;
  file: File | null;
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
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      const fileExtension = getFileExstension(selectedFile.name);

      // Check if the file is .xlsx or .csv AKA analytical app
      if (fileExtension === 'xlsx' || fileExtension === 'csv') {
        setIsAnalytical(true);
      }

      setFile(selectedFile);
    }
  };

  const handleNotationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      setNotationFile(selectedFile);
    }
  };

  return (
    <section className="file-upload-wrapper mt-4">
      <h2 className="file-upload-title">Upload File</h2>
      <div className=" file-upload-section mb-3">
        <label htmlFor="formFile" className="form-label">
          Please choose the file for processing. <b>You cannot change the file</b> once it is uploaded.
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          accept=".pdf, .xlsx, .csv"
          onChange={handleFileChange}
        />
      </div>

      {isAnalytical && (
        <div className="notation-upload">
          <h2 className="file-upload-title">Upload Notation File</h2>
          <div className="file-upload-section mb-3">
            <label htmlFor="notationFile" className="form-label">
            Please upload the anotation file.
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