
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import ProjectRow from "../../components/Project-Row/Project_Row"; // Import the new component
import CustomizeBot from "../../components/Customize-Bot-Section/Customize_Bot";
import { Settings } from "../../utility/Bot_Util";
import ProjectDetails from "../../components/Project-Details-Section/Project_Details";
import getDate from "../../utility/Date_Util.ts";
import {
  getAllAnalyticalConfigs,
  getAllAnalyticalTables,
} from "../../api/analyst.ts";
import { isProduction, showAllPdfManuals } from "../../api/universal.ts";
// import { Settings } from '../../utility/Bot_Util';

interface Project {
  name: string;
  lastUpdate: string;
  filename: string;
  projectId: string;
}

const Dashboard: React.FC = () => {
  // Example data; replace with actual data fetching logic
  const [projects, setProjects] = useState<Project[]>();
  const [selectedProjectID, setSelectedProjectID] = useState<string | null>(
    null
  );
  const [selectedProjectConfig, setSelectedProjectConfig] =
    useState<Settings | null>(null);

  // States for Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [introMessage, setIntroMessage] = useState("");
  const [introImage, setIntroImage] = useState("");

  const [customizeStep, setCustomizeStep] = useState<number>(0);


  async function fetchData() {
    const configs = await showAllPdfManuals();
    if (isProduction && configs.answer) {
      for (const config of configs.answer) {
        // Process each config here
        if (Object.keys(config.answer).length !== 0) {
          const project_name = config[1];
          const doc_id = config[0];
          const last_update = "Uknown";
          const doc_name = config[1] + ".pdf";
          setProjects((prevProjects) => [
            ...(prevProjects || []), // Spread existing projects
            {
              name: project_name, // Correct property name
              lastUpdate: last_update, // Correct property name
              filename: doc_name, // Correct property name
              projectId: doc_id, // Correct property name
            },
          ]);
        }
      }
    } else if (!isProduction && configs.data) {
      for (const config of configs.data) {
        // Process each config here
        if (Object.keys(config.data).length !== 0) {
          const { _id, name, created_at } = config;
          setProjects((prevProjects) => [
            ...(prevProjects || []), // Spread existing projects
            {
              name: name, // Correct property name
              lastUpdate: created_at, // Correct property name
              filename: name + ".pdf", // Correct property name
              projectId: _id, // Correct property name
            },
          ]);
        }
      }
    } else {
      console.error("Failed to retrieve data.");
    }
  }

  async function fetchAnalyticalData() {
    const analyst_all_ids = await getAllAnalyticalTables(); //  getAllTables() returns a Promise
    if (!analyst_all_ids) {
      console.error("Failed to retrieve tables.");
      return;
    }
    const analyst_configs = await getAllAnalyticalConfigs(analyst_all_ids); // getAllConfigs() also returns a Promise
    if (!analyst_configs) {
      console.error("Failed to retrieve analytical configs.");
      return;
    }
    for (const config of analyst_configs) {
      // Process each config here
      if (config.answer && Object.keys(config.answer).length !== 0) {
        const { project_name, doc_id, doc_name, last_update } =
          config.answer.attributes;
        setProjects((prevProjects) => [
          ...(prevProjects || []), // Spread existing projects
          {
            name: project_name, // Correct property name
            lastUpdate: last_update, // Correct property name
            filename: doc_name, // Correct property name
            projectId: doc_id, // Correct property name
          },
        ]);
      }
    }
  }

  const customizeSectionRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!selectedProjectConfig) return;

    const attributes = selectedProjectConfig.attributes;
    setProjectName(attributes.project_name);
    setDescription(attributes.description);
    setIntroImage(attributes.intro_image);
    setIntroMessage(attributes.intro_message);
    setLanguage(attributes.setLanguage);
  }, [selectedProjectConfig]);

  useEffect(() => {
    // API list all projects here
    // After getting all projects call setProjects pls
    fetchData();
    fetchAnalyticalData();
    setProjects([
      {
        name: "ESET Demo",
        lastUpdate: "11-06-2024",
        filename: "ESET_PROJECT_ELITE_brochure.pdf",
        projectId: "02dd0b421950790bd3ef61c92457eb61",
      },
      {
        name: "ESET Demo",
        lastUpdate: "11-06-2024",
        filename: "ESET_PROJECT_ELITE_brochure.pdf",
        projectId: "02dd0b421950790bd3ef61c92457eb61",
      },
      {
        name: "ESET Demo",
        lastUpdate: "11-06-2024",
        filename: "ESET_PROJECT_ELITE_brochure.pdf",
        projectId: "02dd0b421950790bd3ef61c92457eb61",
      },
      {
        name: "ESET Demo",
        lastUpdate: "11-06-2024",
        filename: "ESET_PROJECT_ELITE_brochure.pdf",
        projectId: "02dd0b421950790bd3ef61c92457eb61",
      },
      // Add more project objects as needed
    ]);
  }, []);

  const scrollIntoEditSection = useCallback(() => {
    const topMargin = 80;
    if (!selectedProjectID || !selectedProjectConfig || !customizeSectionRef.current) return
    
    const elementPosition = customizeSectionRef.current.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - topMargin; // Adjust the offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

  }, [selectedProjectID, selectedProjectConfig]);
  
  useEffect(() => {
    scrollIntoEditSection();
  }, [scrollIntoEditSection]);

  useEffect(() => {
      scrollIntoEditSection();
  }, [selectedProjectID, scrollIntoEditSection]);

  const handleProjectDetailsNext = () => {
    if (!description || !projectName || !selectedProjectConfig) return
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
  }

  const updateSettings = (settings: Settings) => {
    if (!selectedProjectConfig) return;
    const attributes = {
      ...selectedProjectConfig.attributes,
    };

    settings.attributes = attributes;

    // API update the config here

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
          {projects && projects.map((project, index) => (
            <ProjectRow 
            key={index} 
            project={project} 
            index={index} 
            setSelectedProject={setSelectedProjectID} 
            setSelectedProjectConfig={setSelectedProjectConfig}
            setCustomizeStep={setCustomizeStep}
            scrollIntoEditSection={scrollIntoEditSection}
            />
          ))}
        </tbody>
      </table>
      {selectedProjectID && selectedProjectConfig ? 
        <>
          <div ref={customizeSectionRef} className="bg-primary p-4 rounded mb-4 text-center">
            <h1 className="text-light">Customize Project</h1>
            <p className="text-light">Customize the project with the following id: <em>{selectedProjectID}</em></p>
          </div>

          {customizeStep === 0 ?
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
            : null}

          {customizeStep === 1 ?
            <CustomizeBot saveSettings={updateSettings} selectedProjectConfig={selectedProjectConfig}/>
            : null}
        </>
    : null}

    </main>
  );
};

export default Dashboard;
