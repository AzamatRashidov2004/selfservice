import React, { useEffect, useState } from "react";
import Stepper from "../../components/Stepper/Stepper";
import FileUploadSection from "../../components/File-Upload-Section/File_Upload"; // Adjust the import path as necessary
import ProjectDetails from "../../components/Project-Details-Section/Project_Details";
import { createNotificationEvent } from "../../utility/Modal_Util";
import CustomizeBot from "../../components/Customize-Bot-Section/Customize_Bot";
import { SettingsType } from "../../utility/types.ts";
import getDate from "../../utility/Date_Util";
import "./New_Project.css";
import {
  createInitialAnalyticalProject,
  createInitialKronosProject,
} from "../../utility/Api_Utils";

const New_Project: React.FC = () => {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isAnalytical, setIsAnalytical] = useState<boolean>(false);
  const [notationFile, setNotationFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // States for Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [introMessage, setIntroMessage] = useState("");
  const [introImage, setIntroImage] = useState("");

  // API upload file here
  const fileUploadNextButtonClick = async () => {
    if (!files) return;
    if (step !== 0) return;
    if (files && isAnalytical && !notationFile) return;

    setStep(step + 1);
  };

  const projectDetailsNextButtonClick = () => {
    if (projectName && description) {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    console.log("FILES; ", files);
  }, [files]);

  const saveSettings = async (settings: SettingsType) => {
    settings.attributes = {
      description,
      intro_image: introImage,
      language: language,
      intro_message: introMessage,
      last_update: getDate(),
      project_name: projectName,
    };

    let response;
    if (!files) return;
    if (isAnalytical && !notationFile) return;
    // API save the config here
    if (isAnalytical && notationFile) {
      // Handle analytical files
      response = await createInitialAnalyticalProject(
        settings,
        files,
        notationFile,
        setLoading
      );
    } else {
      response = await createInitialKronosProject(
        settings,
        projectName,
        description,
        files,
        setLoading
      );
    }

    if (!response) {
      createNotificationEvent(
        "Something Went Wrong",
        "While setting up your project, something went wrong. Please try again later...",
        "danger",
        4000
      );
      return null;
    }

    createNotificationEvent(
      "Project Created",
      "Project successfully created with your configurations",
      "success"
    );
  };

  return (
    <main className="container-fluid main-container">
      <div className="p-4 rounded mb-4 bg-primary">
        <h1 className="text-center">New Project</h1>
        <Stepper activeStep={step} />
      </div>

      {step === 0 ? (
        <FileUploadSection
          step={step}
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
          language={language}
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
