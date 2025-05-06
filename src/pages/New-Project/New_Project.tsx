import React, { useEffect, useState } from "react";
import Stepper from "../../components/Stepper/Stepper";
import FileUploadSection from "../../components/File-Upload-Section/File_Upload";
import ProjectDetails from "../../components/Project-Details-Section/Project_Details";
import { createNotificationEvent } from "../../utility/Modal_Util";
import CustomizeBot from "../../components/Customize-Bot-Section/Customize_Bot";
import { ChatBotSceleton } from "../../utility/types.ts";
import "./New_Project.css";
import { createInitialKronosProject } from "../../utility/Api_Utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.tsx";
import { defaultSettings } from "../../utility/Bot_Util.ts";

const New_Project: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [processedFiles, setProcessedFiles] = useState<File[]>([]);
  const [isAnalytical, setIsAnalytical] = useState<boolean>(false);
  const [notationFile, setNotationFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // States for Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState<"cs-CZ" | "en-US">("en-US");
  const [introMessage, setIntroMessage] = useState("");
  const [introImage, setIntroImage] = useState("");

  // Authentication
  const { authenticated, keycloak } = useAuth();

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  // **Process files to remove the root folder (only for folder uploads)**
  const processFiles = (files: FileList) => {
    if (!files.length) return;

    let rootFolder: string | null = null;
    const processed: File[] = [];

    Array.from(files).forEach((file) => {
      if (file.webkitRelativePath) {
        // Identify root folder only for the first file
        if (!rootFolder) {
          rootFolder = file.webkitRelativePath.split("/")[0]; // Extract "MyFolder"
        }

        // Remove the root folder if it exists in the file path
        const newPath = rootFolder ? file.webkitRelativePath.replace(`${rootFolder}/`, "") : file.webkitRelativePath;

        processed.push(
          new File([file], newPath, {
            type: file.type,
            lastModified: file.lastModified,
          })
        );
      } else {
        // If it's a regular file upload (not a folder), just push it as is
        processed.push(file);
      }
    });

    setProcessedFiles(processed);
  };

  // **Convert File[] back into FileList**
  const convertToFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  };

  // Handle file upload and advance step
  const fileUploadNextButtonClick = () => {
    if (!files) return;
    if (step !== 0) return;
    if (files && isAnalytical && !notationFile) return;

    processFiles(files);
    setStep(step + 1);
  };

  // Handle project details step
  const projectDetailsNextButtonClick = () => {
    if (projectName && description) {
      setStep(step + 1);
    }
  };

  // Save project settings and upload files (folder structure without root folder)
  const saveSettings = async (chatbot: ChatBotSceleton) => {
    if (processedFiles.length === 0) return;

    // Convert processedFiles (File[]) to FileList
    const processedFileList = convertToFileList(processedFiles);

    const response = await createInitialKronosProject(
      defaultSettings,
      projectName,
      description,
      language,
      processedFileList,
      keycloak.token,
      setLoading,
      introMessage,
      introImage,
      chatbot,
    );

    if (!response) {
      createNotificationEvent(
        "Something Went Wrong",
        "While setting up your project, something went wrong. Please try again later...",
        "danger",
        4000
      );
      return;
    }

    createNotificationEvent(
      "Project Created",
      "Project successfully created with your configurations",
      "success"
    );
    navigate("/dashboard");
  };

  return (
    <main className="container-fluid main-container">
      <div className="p-4 rounded mb-4 bg-primary">
        <h1 className="text-center">New Project</h1>
        <Stepper activeStep={step} />
      </div>

      {step === 0 ? (
        <FileUploadSection
          setFile={setFiles}
          setNotationFile={setNotationFile}
          setIsAnalytical={setIsAnalytical}
          file={files}
          isAnalytical={isAnalytical}
          notationFile={notationFile}
          handleNextButtonClick={fileUploadNextButtonClick}
        />
      ) : null}

      {step === 1 ? (
        <ProjectDetails
          projectName={projectName}
          setProjectName={setProjectName}
          description={description}
          setDescription={setDescription}
          setLanguage={setLanguage}
          introMessage={introMessage}
          setIntroMessage={setIntroMessage}
          introImage={introImage}
          setIntroImage={setIntroImage}
          handleNextButtonClick={projectDetailsNextButtonClick}
        />
      ) : null}

      {step === 2 ? (
        <CustomizeBot saveSettings={saveSettings} loading={loading} />
      ) : null}
    </main>
  );
};

export default New_Project;
