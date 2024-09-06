import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import ProjectRow from '../../components/Project-Row/Project_Row'; // Import the new component
import CustomizeBot from '../../components/Customize-Bot-Section/Customize_Bot';
import { Settings } from '../../utility/Bot_Util';
import ProjectDetails from '../../components/Project-Details-Section/Project_Details';
import getDate from "../../utility/Date_Util.ts";
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
  const [selectedProjectID, setSelectedProjectID] = useState<string | null>(null);
  const [selectedProjectConfig, setSelectedProjectConfig] = useState<Settings | null>(null)
  
  // States for Project Details
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [introMessage, setIntroMessage] = useState('');
  const [introImage, setIntroImage] = useState('');

  const [customizeStep, setCustomizeStep] = useState<number>(0);

  useEffect(() => {
    if (!selectedProjectConfig) return;

    const attributes = selectedProjectConfig.attributes;
    setProjectName(attributes.project_name);
    setDescription(attributes.description);
    setIntroImage(attributes.intro_image);
    setIntroMessage(attributes.intro_message);
    setLanguage(attributes.setLanguage);

  }, [selectedProjectConfig])

  useEffect(() => {
    // API list all projects here
    // After getting all projects call setProjects pls
    setProjects([
      {
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },
      {
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },
      {
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },
      {
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },
      // Add more project objects as needed
    ]);
  }, []);

  const handleProjectDetailsNext = () => {
    console.log(selectedProjectConfig, description, projectName)
    if (!description || !projectName || !selectedProjectConfig) return
    console.log("here")
    const attributes = {
      ...selectedProjectConfig.attributes,
      description: description,
      project_name: projectName,
      language: language,
      intro_image: introImage,
      intro_message: introMessage,
      last_update: getDate(),
    }

    setSelectedProjectConfig({
      ...selectedProjectConfig,
      ...{attributes}
    })
    
    setCustomizeStep(customizeStep + 1);
  }
  useEffect(() => {
    console.log(customizeStep)
  }, [customizeStep])

  const updateSettings = (settings: Settings) => {
    if (!selectedProjectConfig) return
    const attributes = {
      ...selectedProjectConfig.attributes
    }

    settings.attributes = attributes;
    
    // API update the config here

    setCustomizeStep(0);
    setSelectedProjectID(null)
  }

  return (
    <main className="container-fluid main-container">
      <div className="bg-primary p-4 rounded mb-4 text-center">
        <h1 className="text-light">Available Projects</h1>
        <p className="text-light">Choose a project to edit or delete</p>
      </div>
      <table className="table w-100">
        <thead>
          <tr>
            <th className="text-start">Project Name</th>
            <th className="text-start">Last Update</th>
            <th className="text-start">Filename</th>
            <th className="text-start">Project ID</th>
            <th className="text-start">Actions</th>
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
            />
          ))}
        </tbody>
      </table>
      {selectedProjectID && selectedProjectConfig ? 
        <>
          <div className="bg-primary p-4 rounded mb-4 text-center">
            <h1 className="text-light">Customize Project</h1>
            <p className="text-light">Customize the project with the following id: {selectedProjectID}</p>
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
