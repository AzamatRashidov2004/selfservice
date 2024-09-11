import React, { useState } from "react";
import Stepper from "../../components/Stepper/Stepper";
import FileUploadSection from "../../components/File-Upload-Section/File_Upload"; // Adjust the import path as necessary
import ProjectDetails from "../../components/Project-Details-Section/Project_Details";
import { createNotificationEvent } from "../../utility/Modal_Util";
import CustomizeBot from "../../components/Customize-Bot-Section/Customize_Bot";
import { SettingsType } from "../../utility/types.ts";
import getDate from "../../utility/Date_Util";
import "./New_Project.css";
import { handleUpdateConfig, uploadProjectFile } from "../../utility/Api_Utils";

const New_Project: React.FC = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [doc_name, setDocName] = useState<string>("");
  const [docID, setDocID] = useState<string>("");
  const [kronosProjectID, setKronosProjectID] = useState<string | null>("");
  const [isAnalytical, setIsAnalytical] = useState<boolean>(false);
  const [notationFile, setNotationFile] = useState<File | null>(null);

  // States for Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [introMessage, setIntroMessage] = useState("");
  const [introImage, setIntroImage] = useState("");

  // API upload file here
  const fileUploadNextButtonClick = async () => {
    if (!file) return;
    if (step !== 0) return;
    if (file && isAnalytical && !notationFile) return;

    const ids = await uploadProjectFile(file, isAnalytical, notationFile);
    if (!ids || !ids.docID){
      createNotificationEvent(
        "Something Went Wrong",
        "While uploading the file something went wrong. Please try again later...",
        "danger",
        4000
      );
      return;
    }

    setDocID(ids.docID);
    setKronosProjectID(ids.projectID);
    setDocName(file.name);
    console.log("IDS", ids.docID, ids.projectID);

    createNotificationEvent(
      "Upload Succesful",
      "File succesfully uploaded to the server",
      "success"
    );
    setStep(step + 1);
  };

  const projectDetailsNextButtonClick = () => {
    if (projectName && description) {
      setStep(step + 1);
    }
  };

  const saveSettings = async (settings: SettingsType) => {
    settings.attributes = {
      description,
      doc_id: docID,
      doc_name,
      intro_image: introImage,
      language: language,
      intro_message: introMessage,
      last_update: getDate(),
      project_name: projectName,
      pdf_id: docID,
    };

    // API save the config here
    const response = await handleUpdateConfig(isAnalytical, settings, docID, kronosProjectID);

    if (!response){
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
          setFile={setFile}
          setNotationFile={setNotationFile}
          setIsAnalytical={setIsAnalytical}
          file={file}
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

      {step === 2 ? <CustomizeBot saveSettings={saveSettings} /> : null}
    </main>
  );
};

export default New_Project;
