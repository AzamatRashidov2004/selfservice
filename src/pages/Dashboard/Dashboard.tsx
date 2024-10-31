import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Dashboard.css";
import ProjectRow from "../../components/Project-Row/Project_Row"; // Import the new component
import CustomizeBot from "../../components/Customize-Bot-Section/Customize_Bot";
import {
  fetchProjectsDataReturn,
  projectFetchReturn,
  ProjectType,
  SettingsType,
} from "../../utility/types.ts";
import ProjectDetails from "../../components/Project-Details-Section/Project_Details";
import getDate from "../../utility/Date_Util.ts";
import {
  fetchProjectsData,
  handleUpdateConfig,
} from "../../utility/Api_Utils.ts";
import { createNotificationEvent } from "../../utility/Modal_Util.ts";
import Project from "../../components/Projects/Projects.tsx";
import Loader from "../../components/Loader/Loader.tsx";
import { useAuth } from "../../context/authContext.tsx";
import { useNavigate } from "react-router-dom";
import FileTree from "../../components/File-Tree/FileTree.jsx";
import FileBrowser from "../../components/File-Browser/FileBrowser.jsx";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import "react-resizable/css/styles.css";
import { useFiles } from "../../context/fileContext.tsx";
import { PDFContextType } from "../../utility/types.ts";

export const PDFContext = React.createContext<PDFContextType | undefined>(
  undefined
);

const Dashboard: React.FC = () => {
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [projects, setProjects] = useState<projectFetchReturn[]>([]);
  const [analyticalProjects, setAnalyticalProjects] = useState<ProjectType[]>(
    []
  );
  const [selectedDocID, setSelectedDocID] = useState<string | null>(null);
  const [selectedProjectID, setSelectedProjectID] = useState<string | null>(
    null
  );

  const { setProjectsContext } = useFiles();

  const kronosProjectsWrapperRef = useRef<HTMLTableRowElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedProjectConfig, setSelectedProjectConfig] =
    useState<SettingsType | null>(null);
  const [isAnalytical, setIsAnalytical] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // States for Project Details
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [introMessage, setIntroMessage] = useState("");
  const [introImage, setIntroImage] = useState("");

  const [openProjectIndex, setOpenProjectIndex] = useState<number | null>(null);

  const [customizeStep, setCustomizeStep] = useState<number>(0);

  const customizeSectionRef = useRef<HTMLHeadingElement>(null);
  const { authenticated, keycloak } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  });

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

  const fetchData = async (token: string | undefined) => {
    setLoading(true);
    await fetchProjectsData((allProjects: fetchProjectsDataReturn | null) => {
      if (!allProjects) {
        setLoading(false);
        return;
      }

      setAnalyticalProjects(allProjects.analytical);
      setProjects(allProjects.project);
    }, token);
    setLoading(false);
  };
  // Initial projects fetch
  useEffect(() => {
    fetchData(keycloak.token);
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
      selectedProjectID,
      keycloak.token
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
    let updatedProjects;
    if (isAnalytical) {
      // updates project name
      updatedProjects = analyticalProjects.map(
        (project: ProjectType, index: number) =>
          index === selectedIndex ? { ...project, name: projectName } : project
      );
      setAnalyticalProjects(updatedProjects);
    } else {
      updatedProjects = projects.map(
        (project: projectFetchReturn, index: number) =>
          index === selectedIndex
            ? {
                project: {
                  ...project.project,
                  name: projectName,
                  description: description,
                },
                projectData: project.projectData,
              }
            : project
      );
      setProjects(updatedProjects);
    }

    createNotificationEvent(
      "Project Updated",
      "Succesfully updated the project configurations",
      "success"
    );
    setCustomizeStep(0);
    setSelectedDocID(null);
  };

  // Synchronize the height of .kronos-projects-wrapper with .accordion using ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!kronosProjectsWrapperRef.current || !accordionRef.current) return;
      const accordionHeight = accordionRef.current.offsetHeight;
      kronosProjectsWrapperRef.current.style.height = `${accordionHeight}px`;
    });

    if (accordionRef.current) {
      observer.observe(accordionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!projects) return;

    if (projects.length % 2 === 0) {
      const root = document.documentElement;
      root.style.setProperty("--even-analytical-project-bg", "#FFFFFF");
      root.style.setProperty("--odd-analytical-project-bg", "#F2F2F2");
    }
    console.log("PROJECTS UPDATED", projects);
    setProjectsContext(projects);
  }, [projects]);

  useEffect(() => {
    const table = document.getElementsByTagName("table");
    const loader = document.getElementsByClassName("loader-container");
    if (loading) {
      table[0].classList.add("hidden");
      loader[0].classList.remove("hidden");
    } else {
      table[0].classList.remove("hidden");
      loader[0].classList.add("hidden");
    }
  });

  //const [width, setWidth] = useState(window.innerWidth * 0.8);
  //const [position, setPosition] = useState(0);

  const [fileBrowserWidth, setFileBrowserWidth] = useState<number>(
    window.innerWidth * 0.6 // Start with 60% of the window width
  );
  const minFileTreeWidth = window.innerWidth * 0.2; // Minimum width of the file-tree-container
  const parentWidth = window.innerWidth;
  console.log("parent width: ", parentWidth);

  const handleResize = (
    event: React.SyntheticEvent,
    data: ResizeCallbackData
  ) => {
    if (data.size.width <= window.innerWidth * 0.6) {
      console.log(
        "data size widht and window inner width 80",
        data.size.width,
        window.innerWidth * 0.8
      );
      setFileBrowserWidth(data.size.width);
    }
  };

  /*const handleResize = (
    event: React.SyntheticEvent,
    data: ResizeCallbackData
  ) => {
    const deltaWidth = width - data.size.width;
    setWidth(data.size.width);
    setPosition(position + deltaWidth);
  };*/

  return (
    <PDFContext.Provider
      value={{ pdfVisible, setPdfVisible, pdfUrl, setPdfUrl }}
    >
      <section className="dashboard-section">
        <main className="container-fluid main-container">
          <div className="bg-primary p-4 rounded mb-4 text-center">
            <h1 className="text-light">Available Projects</h1>
            <p className="text-light">Choose a project to edit or delete</p>
          </div>
          <br />
          <div className="loader-container">
            <Loader />
          </div>
          <div className="file-browser-wrapper">
            <div className="file-tree-container">
              <FileTree />
            </div>
            <div className="file-browser-container">
              <ResizableBox
                width={fileBrowserWidth}
                axis="x"
                minConstraints={[500, 0]}
                maxConstraints={[parentWidth - minFileTreeWidth, Infinity]}
                resizeHandles={["w"]}
                onResize={handleResize}
                style={{ minWidth: "500px" }}
              >
                <FileBrowser />
              </ResizableBox>
            </div>
          </div>
          <table className="table main-table w-100 locked-hidden">
            <thead>
              <tr>
                <th className="project-name text-start">Project Name</th>
                <th className="project-last-update text-start">Last Update</th>
                <th className="project-id text-start">Project ID</th>
                <th className="project-actions text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                ref={kronosProjectsWrapperRef}
                className="kronos-projects-wrapper"
              >
                <div
                  ref={accordionRef}
                  className="accordion"
                  id="projectsAccordion"
                >
                  {projects.map((project, index) => {
                    if (
                      !project.project ||
                      !project.project.name ||
                      !project.projectData
                    )
                      return null;
                    return (
                      <Project
                        key={project.project._id} // Assuming _id is unique
                        projectData={project.projectData}
                        project={project.project}
                        index={index}
                        setProjects={setProjects}
                        openProjectIndex={openProjectIndex}
                        setOpenProjectIndex={setOpenProjectIndex}
                        setSelectedDocID={setSelectedDocID}
                        setSelectedProjectConfig={setSelectedProjectConfig}
                        setIsAnalytical={setIsAnalytical}
                        setSelectedIndex={setSelectedIndex}
                      />
                    );
                  })}
                </div>
              </tr>
              {analyticalProjects &&
                analyticalProjects.map(
                  (project: ProjectType, index: number) => (
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
                      setProjects={setAnalyticalProjects}
                    />
                  )
                )}
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
      </section>
    </PDFContext.Provider>
  );
};

export default Dashboard;
