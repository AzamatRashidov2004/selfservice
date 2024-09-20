import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Dashboard.css";
import ProjectRow from "../../components/Project-Row/Project_Row"; // Import the new component
import CustomizeBot from "../../components/Customize-Bot-Section/Customize_Bot";
import { kronosKnowledgeBaseType, KronosProjectType, SettingsType } from "../../utility/types.ts";
import ProjectDetails from "../../components/Project-Details-Section/Project_Details";
import getDate from "../../utility/Date_Util.ts";
import {
  fetchProjectsData,
  handleUpdateConfig,
} from "../../utility/Api_Utils.ts";
import { ProjectType } from "../../utility/types.ts";
import { createNotificationEvent } from "../../utility/Modal_Util.ts";
import Project from "../../components/Projects/Projects.tsx";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedDocID, setSelectedDocID] = useState<string | null>(null);
  const [selectedProjectID, setSelectedProjectID] = useState<string | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedProjectConfig, setSelectedProjectConfig] =
    useState<SettingsType | null>(null);
  const [isAnalytical, setIsAnalytical] = useState<boolean>(false);

  // States for Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [introMessage, setIntroMessage] = useState("");
  const [introImage, setIntroImage] = useState("");

  const [openProjectIndex, setOpenProjectIndex] = useState<number | null>(null);

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

  const fetchData = async () => {
    await fetchProjectsData(setProjects);
  };
  // Initial projects fetch
  useEffect(() => {
    fetchData();
  }, []);

  const scrollIntoEditSection = useCallback(() => {
    const topMargin = 80;
    if (
      !selectedDocID ||
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
  }, [selectedDocID, selectedProjectConfig]);

  useEffect(() => {
    scrollIntoEditSection();
  }, [scrollIntoEditSection]);

  useEffect(() => {
    scrollIntoEditSection();
  }, [selectedDocID, scrollIntoEditSection]);

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
    if (!selectedProjectConfig || !selectedDocID) return;

    const attributes = {
      ...selectedProjectConfig.attributes,
    };

    settings.attributes = attributes;

    // API update the config here
    const result = await handleUpdateConfig(
      isAnalytical,
      settings,
      selectedDocID,
      selectedProjectID
    );
    if (!result) {
      console.error("Something went wrong while updating project");
      createNotificationEvent(
        "Something Went Wrong",
        "While trying to update the project, something went wrong. Please try again later...",
        "danger"
      );
      return;
    }

    // updates project name
    const updatedProjects = projects.map((project, index) =>
      index === selectedIndex ? { ...project, name: projectName } : project
    );

    setProjects(updatedProjects);

    createNotificationEvent(
      "Project Updated",
      "Succesfully updated the project configurations",
      "success"
    );
    setCustomizeStep(0);
    setSelectedDocID(null);
  };

  const project1: KronosProjectType = {
    name: "Project 1",
    created_at: new Date("12-02-2024"),
    description: "This is the project description for project 1",
    modal_version: 2,
    _id: "0kj3asd84as9dcb91",
  }

  const project2: KronosProjectType = {
    name: "Project 2",
    created_at: new Date("12-02-2024"),
    description: "This is the project description for project 2",
    modal_version: 2,
    _id: "0kj3asd84as9dcb91",
  }

  const project1KnowledgeList: kronosKnowledgeBaseType[] = [
    {
      "_id": "66966a415b8437d77c70fc78",
      "project_id": "669668775b8437d77c70fc77",
      "name": "Porsche Taycan Manual (EN)",
      "description": "English manual for Porsche Taycan.",
      "embedding_model": "openai-3-large",
      "language": "en-US",
      "total_pages": 302,
      "source_file": "1f7a678da3d96872e48954764004e0e0.pdf",
      "source_type": "pdf",
      "chatbot_config": {
        "title": "Custom Bot",
        "sound": true,
        "key": "646b4706a47a67009f647d79",
        "fontSize": "standard",
        "starting_pos": {
          "x": 930,
          "y": 100
        },
        "resizing": true,
        "dragging": true,
        "size": "standard",
        "customComponents": {
          "Bubble": "",
          "Button": "",
          "Bot": "",
          "Suggestions": "",
          "Video": "",
          "TextInput": "",
          "Loading_Bar": "",
          "Image": "",
          "Messages": "",
          "Icon": ""
        },
        "attributes": {
          "description": "English manual for Porsche Taycan.",
          "last_update": "17-09-2024",
          "project_name": "Porsche Taycan Manual (EN)",
          "docId": "66966a415b8437d77c70fc78",
          "projectId": "669668775b8437d77c70fc77"
        },
        "colors": {
          "bot": {
            "background": "#37258D",
            "color": "white"
          },
          "user": {
            "background": "#7881CB",
            "color": "white"
          },
          "suggestions": {
            "background": "#ffffffb",
            "color": "black",
            "hover_color": "#ffffff80"
          },
          "title_color": "white",
          "background_color": "#5341DA",
          "icon_color": "#5A5A5A"
        },
        "search": true,
        "file_selector": false,
        "positioning": "static",
        "pdfScale": 1,
        "inputLineLimit": 5,
        "save_customization": true,
        "toggle": false,
        "suggestion_button_style": "grid",
        "fullscreen_margin": 0,
        "save_callback": () => {}
      },
      "created_at": "2024-08-14T11:49:29.194000",
      "model_version": 2
    },
    {
      "_id": "66966a415b8437d77c70fc78",
      "project_id": "669668775b8437d77c70fc77",
      "name": "Porsche Taycan Manual (EN)",
      "description": "English manual for Porsche Taycan.",
      "embedding_model": "openai-3-large",
      "language": "en-US",
      "total_pages": 302,
      "source_file": "Flat Sheets.csv",
      "source_type": "csv",
      "chatbot_config": {
        "title": "Custom Bot",
        "sound": true,
        "key": "646b4706a47a67009f647d79",
        "fontSize": "standard",
        "starting_pos": {
          "x": 930,
          "y": 100
        },
        "resizing": true,
        "dragging": true,
        "size": "standard",
        "customComponents": {
          "Bubble": "",
          "Button": "",
          "Bot": "",
          "Suggestions": "",
          "Video": "",
          "TextInput": "",
          "Loading_Bar": "",
          "Image": "",
          "Messages": "",
          "Icon": ""
        },
        "attributes": {
          "description": "English manual for Porsche Taycan.",
          "last_update": "17-09-2024",
          "project_name": "Porsche Taycan Manual (EN)",
          "docId": "66966a415b8437d77c70fc78",
          "projectId": "669668775b8437d77c70fc77"
        },
        "colors": {
          "bot": {
            "background": "#37258D",
            "color": "white"
          },
          "user": {
            "background": "#7881CB",
            "color": "white"
          },
          "suggestions": {
            "background": "#ffffffb",
            "color": "black",
            "hover_color": "#ffffff80"
          },
          "title_color": "white",
          "background_color": "#5341DA",
          "icon_color": "#5A5A5A"
        },
        "search": true,
        "file_selector": false,
        "positioning": "static",
        "pdfScale": 1,
        "inputLineLimit": 5,
        "save_customization": true,
        "toggle": false,
        "suggestion_button_style": "grid",
        "fullscreen_margin": 0,
        "save_callback": () => {}
      },
      "created_at": "2024-08-14T11:49:29.194000",
      "model_version": 2
    }
  ]

  return (
    <main className="container-fluid main-container">
      <div className="bg-primary p-4 rounded mb-4 text-center">
        <h1 className="text-light">Available Projects</h1>
        <p className="text-light">Choose a project to edit or delete</p>
      </div>

      <div className="accordion" id="projectsAccordion">
        <Project projectData={project1KnowledgeList} project={project1} index={0}
        setSelectedIndex={setSelectedIndex}
        setSelectedProjectID={setSelectedProjectID}
        setSelectedProject={setSelectedDocID}
        setSelectedProjectConfig={setSelectedProjectConfig}
        setCustomizeStep={setCustomizeStep}
        scrollIntoEditSection={scrollIntoEditSection}
        setIsAnalytical={setIsAnalytical}
        setProjects={setProjects}
        openProjectIndex={openProjectIndex}
        setOpenProjectIndex={setOpenProjectIndex}
        />
        
        <Project projectData={project1KnowledgeList} project={project2} index={1}
        setSelectedIndex={setSelectedIndex}
        setSelectedProjectID={setSelectedProjectID}
        setSelectedProject={setSelectedDocID}
        setSelectedProjectConfig={setSelectedProjectConfig}
        setCustomizeStep={setCustomizeStep}
        scrollIntoEditSection={scrollIntoEditSection}
        setIsAnalytical={setIsAnalytical}
        setProjects={setProjects}
        openProjectIndex={openProjectIndex}
        setOpenProjectIndex={setOpenProjectIndex}
        />

      <Project projectData={project1KnowledgeList} project={project2} index={2}
        setSelectedIndex={setSelectedIndex}
        setSelectedProjectID={setSelectedProjectID}
        setSelectedProject={setSelectedDocID}
        setSelectedProjectConfig={setSelectedProjectConfig}
        setCustomizeStep={setCustomizeStep}
        scrollIntoEditSection={scrollIntoEditSection}
        setIsAnalytical={setIsAnalytical}
        setProjects={setProjects}
        openProjectIndex={openProjectIndex}
        setOpenProjectIndex={setOpenProjectIndex}
        />
        <Project projectData={project1KnowledgeList} project={project2} index={3}
        setSelectedIndex={setSelectedIndex}
        setSelectedProjectID={setSelectedProjectID}
        setSelectedProject={setSelectedDocID}
        setSelectedProjectConfig={setSelectedProjectConfig}
        setCustomizeStep={setCustomizeStep}
        scrollIntoEditSection={scrollIntoEditSection}
        setIsAnalytical={setIsAnalytical}
        setProjects={setProjects}
        openProjectIndex={openProjectIndex}
        setOpenProjectIndex={setOpenProjectIndex}
        />
      </div>
      <table className="table w-100 hidden">
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
                setSelectedIndex={setSelectedIndex}
                setSelectedProjectID={setSelectedProjectID}
                setSelectedProject={setSelectedDocID}
                setSelectedProjectConfig={setSelectedProjectConfig}
                setCustomizeStep={setCustomizeStep}
                scrollIntoEditSection={scrollIntoEditSection}
                setIsAnalytical={setIsAnalytical}
                setProjects={setProjects}
              />
            ))}
        </tbody>
      </table>
      {selectedDocID && selectedProjectConfig ? (
        <>
          <div
            ref={customizeSectionRef}
            className="bg-primary p-4 rounded mb-4 text-center"
          >
            <h1 className="text-light">Customize Project</h1>
            <p className="text-light">
              Customize the project with the following id:{" "}
              <em>{selectedDocID}</em>
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
