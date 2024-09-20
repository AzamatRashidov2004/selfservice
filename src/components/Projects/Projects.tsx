import React, { useRef, useEffect } from "react";
import "./Projects.css";
import ProjectRow from "./sub-components/Projects_Row";
import { kronosKnowledgeBaseType, KronosProjectType, SettingsType, ProjectType } from "../../utility/types";
import { plusIcon } from "../../utility/icons";

interface ProjectsProps {
  project: KronosProjectType;
  projectData: kronosKnowledgeBaseType[];
  index: number;
  setSelectedProject: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedProjectConfig: React.Dispatch<
    React.SetStateAction<SettingsType | null>
  >;
  setCustomizeStep: React.Dispatch<React.SetStateAction<number>>;
  setIsAnalytical: React.Dispatch<React.SetStateAction<boolean>>;
  scrollIntoEditSection: () => void;
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  setSelectedProjectID: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  openProjectIndex: number | null;
  setOpenProjectIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const Project: React.FC<ProjectsProps> = ({ 
  index, 
  project, 
  projectData,
  setSelectedProject,
  setSelectedProjectConfig,
  setCustomizeStep,
  scrollIntoEditSection,
  setIsAnalytical,
  setProjects,
  setSelectedProjectID,
  setSelectedIndex,
  openProjectIndex,
  setOpenProjectIndex
 }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Toggle function to handle accordion behavior
  const toggleAccordion = () => {
    if (openProjectIndex === index) {
      // If this project is already open, close it
      setOpenProjectIndex(null);
    } else {
      // If this project is not open, open it and close others
      setOpenProjectIndex(index);
    }
  };

  // Sync the height of the content with the animation
  useEffect(() => {
    if (contentRef.current) {
      if (openProjectIndex === index) {
        contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      } else {
        contentRef.current.style.maxHeight = '0px';
      }
    }
  }, [openProjectIndex, index]);

  return (
    <div className="accordion-item">
      <h2 className="bg-primary accordion-header" id={`heading${index}`}>
        <button
          onClick={toggleAccordion}
          className={`accordion-button ${openProjectIndex === index ? "" : "collapsed"}`}
          type="button"
          aria-expanded={openProjectIndex === index}
          aria-controls={`collapse${index}`}
        >
          {project.name}
        </button>
      </h2>
      <div
        id={`collapse${index}`}
        className={`accordion-collapse ${openProjectIndex === index ? "expanded" : ""}`}
        aria-labelledby={`heading${index}`}
        ref={contentRef}
      >
        <div className="accordion-body">
          <b>ID: </b> {project._id}<br />
          <b>Description: </b> {project.description}<br />
          <b>Files </b> ({projectData.length} {projectData.length <= 1 ? "file" : "files"})<br />
          <div className="project-table-wrapper bg-secondary ">
            <table className="table w-100 bg-secondary">
            <thead>
              <tr className="thead-content">
                <th className="thead-content project-filename text-start">Filename</th>
                <th className="thead-content project-actions text-end">Actions</th>
              </tr>
            </thead>
              <tbody>
                <tr className="add-file-wrapper">
                  <td className="">
                  <img src={plusIcon.src} alt={plusIcon.alt} className="project-row-img add-file-img" />
                  <span className="project-row-span">Add new file</span>
                  </td>
                  <td></td>
                </tr>
                {projectData && projectData.map((project, index) => (
                    <ProjectRow
                      key={index}
                      project={project}
                      index={index}
                      setSelectedIndex={setSelectedIndex}
                      setSelectedProjectID={setSelectedProjectID}
                      setSelectedProject={setSelectedProject}
                      setSelectedProjectConfig={setSelectedProjectConfig}
                      setCustomizeStep={setCustomizeStep}
                      scrollIntoEditSection={scrollIntoEditSection}
                      setIsAnalytical={setIsAnalytical}
                      setProjects={setProjects}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
