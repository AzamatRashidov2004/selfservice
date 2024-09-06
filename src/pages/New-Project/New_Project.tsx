import React, { useState } from 'react';
import Stepper from "../../components/Stepper/Stepper";
import FileUploadSection from '../../components/File-Upload-Section/File_Upload'; // Adjust the import path as necessary
import ProjectDetails from '../../components/Project-Details-Section/Project_Details';
import { createNotificationEvent } from '../../utility/Modal_Util';
import CustomizeBot from '../../components/Customize-Bot-Section/Customize_Bot';
import { Settings } from '../../utility/Bot_Util';
import getDate from "../../utility/Date_Util";
import "./New_Project.css";

const New_Project: React.FC = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [doc_name, setDocName] = useState<string>("");
  const [docID, setDocID] = useState<string>("");
  const [isAnalytical, setIsAnalytical] = useState<boolean>(false);
  const [notationFile, setNotationFile] = useState<File | null>(null);
  
  // States for Project Details
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [introMessage, setIntroMessage] = useState('');
  const [introImage, setIntroImage] = useState('');

  const fileUploadNextButtonClick = async () => {
    if (!file) return;
    if (step !== 0) return;
    if (file && isAnalytical && !notationFile) return;

    // API upload file here
    setDocID("// API save the doc id here")

    setDocName(file.name);
    createNotificationEvent("Upload Succesful", "File succesfully uploaded to the server", "success")
    setStep(step + 1);
  };

  const projectDetailsNextButtonClick = () => {
    if (projectName && description) {
      setStep(step + 1);
    }
  };

  const saveSettings = (settings: Settings) => {
    settings.attributes = {
      description, 
      doc_id: docID,
      doc_name,
      intro_image: introImage,
      language: language,
      intro_message: introMessage,
      last_update: getDate(),
      project_name: projectName,
      pdf_id: docID
    }

    // API save the config here
    console.log(settings);
    createNotificationEvent("Project Created", "Project successfully created", "success");
    // createNotificationEvent("Request Failed", "Something went wrong, please try again later...", "danger"); //If the call is failed
  }

  return (
    <main className="container-fluid main-container">
      <div className="p-4 rounded mb-4 bg-primary">
        <h1 className='text-center'>New Project</h1>
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

      {step === 2 ? 
      <CustomizeBot saveSettings={saveSettings}/>
        : null}
    </main>
  );
};

export default New_Project;
