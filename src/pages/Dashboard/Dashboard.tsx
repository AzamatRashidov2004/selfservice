import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Dashboard.css";
import ProjectRow from "../../components/Project-Row/Project_Row"; // Import the new component
import CustomizeBot from "../../components/Customize-Bot-Section/Customize_Bot";
import { SettingsType } from "../../utility/types.ts";
import ProjectDetails from "../../components/Project-Details-Section/Project_Details";
import getDate from "../../utility/Date_Util.ts";
import { fetchProjectsData, handleUpdateConfig } from "../../utility/Api_Utils.ts";
import { ProjectType } from "../../utility/types.ts";
import { createNotificationEvent } from "../../utility/Modal_Util.ts";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedProjectID, setSelectedProjectID] = useState<string | null>(null);
  const [selectedProjectConfig, setSelectedProjectConfig] = useState<SettingsType | null>(null);
  const [isAnalytical, setIsAnalytical] = useState<boolean>(false);

  // States for Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [introMessage, setIntroMessage] = useState("");
  const [introImage, setIntroImage] = useState("");

  const [customizeStep, setCustomizeStep] = useState<number>(0);

  const customizeSectionRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // With changes to selected project, set states
    if (!selectedProjectConfig) return;
    const attributes = selectedProjectConfig.attributes;
    setProjectName(attributes.project_name);
    setDescription(attributes.description);
    setIntroImage(attributes.intro_image);
    setIntroMessage(attributes.intro_message);
    setLanguage(attributes.language);
  }, [selectedProjectConfig]);

  // Initial projects fetch
  useEffect(() => {
    const fetchData = async () => {
      await fetchProjectsData(setProjects);
    };
  
    fetchData();
  }, []); 

  const scrollIntoEditSection = useCallback(() => {
    const topMargin = 80;
    if (
      !selectedProjectID ||
      !selectedProjectConfig ||
      !customizeSectionRef.current
    )
      return;

    const elementPosition =
      customizeSectionRef.current.getBoundingClientRect().top +
      window.pageYOffset;
    const offsetPosition = elementPosition - topMargin; // Adjust the offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }, [selectedProjectID, selectedProjectConfig]);

  useEffect(() => {
    scrollIntoEditSection();
  }, [scrollIntoEditSection]);

  useEffect(() => {
    scrollIntoEditSection();
  }, [selectedProjectID, scrollIntoEditSection]);

  const handleProjectDetailsNext = () => {
    if (!description || !projectName || !selectedProjectConfig) return;
    const attributes = {
      ...selectedProjectConfig.attributes,
      description: description,
      project_name: projectName,
      language: language,
      intro_image: introImage,
      intro_message: introMessage,
      last_update: getDate(),
    };
    setSelectedProjectConfig({
      ...selectedProjectConfig,
      ...{ attributes },
    });

    setCustomizeStep(customizeStep + 1);
  };

  const updateSettings = async (settings: SettingsType) => {
    if (!selectedProjectConfig) return;
    const attributes = {
      ...selectedProjectConfig.attributes,
    };

    settings.attributes = attributes;

    // API update the config here
    const result = await handleUpdateConfig(isAnalytical, settings, settings.attributes.doc_id);
    if (!result){
      console.error("Something went wrong while updating project");
      createNotificationEvent(
        "Something Went Wrong",
        "While trying to update the project, something went wrong. Please try again later...",
        "danger"
      );
    }

    createNotificationEvent(
      "Project Updated",
      "Succesfully updated the project configurations",
      "success"
    );
    setCustomizeStep(0);
    setSelectedProjectID(null);
  };

  return (
    <main className="container-fluid main-container">
      <div className="bg-primary p-4 rounded mb-4 text-center">
        <h1 className="text-light">Available Projects</h1>
        <p className="text-light">Choose a project to edit or delete</p>
      </div>
      <table className="table w-100">
        <thead>
          <tr>
            <th className="project-name text-start">Project Name</th>
            <th className="project-last-update text-start">Last Update</th>
            <th className="project-filename text-start">Filename</th>
            <th className="project-id text-start">Project ID</th>
            <th className="project-actions text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects &&
            projects.map((project, index) => (
              <ProjectRow
                key={index}
                project={project}
                index={index}
                setSelectedProject={setSelectedProjectID}
                setSelectedProjectConfig={setSelectedProjectConfig}
                setCustomizeStep={setCustomizeStep}
                scrollIntoEditSection={scrollIntoEditSection}
                setIsAnalytical={setIsAnalytical}
                setProjects={setProjects}
              />
            ))}
        </tbody>
      </table>
      {selectedProjectID && selectedProjectConfig ? (
        <>
          <div
            ref={customizeSectionRef}
            className="bg-primary p-4 rounded mb-4 text-center"
          >
            <h1 className="text-light">Customize Project</h1>
            <p className="text-light">
              Customize the project with the following id:{" "}
              <em>{selectedProjectID}</em>
            </p>
          </div>

          {customizeStep === 0 ? (
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
              handleNextButtonClick={handleProjectDetailsNext}
            />
          ) : null}

          {customizeStep === 1 ? (
            <CustomizeBot
              saveSettings={updateSettings}
              selectedProjectConfig={selectedProjectConfig}
            />
          ) : null}
        </>
      ) : null}
    </main>
  );
};

export default Dashboard;
