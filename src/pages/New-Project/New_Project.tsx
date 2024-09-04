import React, { useState } from 'react';
import Stepper from "../../components/Stepper/Stepper";
import FileUploadSection from '../../components/File-Upload/File_Upload'; // Adjust the import path as necessary
import ProjectDetails from '../../components/Project-Details/Project_Details';
import "./New_Project.css";

const New_Project: React.FC = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalytical, setIsAnalytical] = useState<boolean>(false);
  const [notationFile, setNotationFile] = useState<File | null>(null);
  
  // States for Project Details
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [introMessage, setIntroMessage] = useState('');
  const [introImage, setIntroImage] = useState('');

  const fileUploadNextButtonClick = () => {
    if (!file) return;
    if (step !== 0) return;
    if (file && isAnalytical && !notationFile) return;

    setStep(step + 1);
  };

  const projectDetailsNextButtonClick = () => {
    if (projectName && description && introMessage && introImage) {
      setStep(step + 1);
    }
  };

  return (
    <main className="container-fluid main-container">
      <div className="p-4 rounded mb-4 bg-primary">
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
    </main>
  );
};

export default New_Project;
