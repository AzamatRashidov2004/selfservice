import React, { useState, useRef, useEffect } from "react";
import "./Projects.css";
import ProjectRow from "./sub-components/Projects_Row";
import { kronosKnowledgeBaseType, KronosProjectType, SettingsType, ProjectType } from "../../utility/types";
import { plusIcon } from "../../utility/icons";

interface ProjectsProps {
  project: KronosProjectType;
  projectData: kronosKnowledgeBaseType[]
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
 }) => {
  // State to manage the accordion item's open/close status
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Toggle function to open or close the accordion
  const toggleAccordion = () => {
    setIsOpen(prevState => !prevState);
  };

  // Sync the height of the content with the animation
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      } else {
        contentRef.current.style.maxHeight = '0px';
      }
    }
  }, [isOpen]);

  return (
    <div className="accordion-item">
      <h2 className="bg-primary accordion-header" id={`heading${index}`}>
        <button
          onClick={toggleAccordion}
          className={`accordion-button ${isOpen ? "" : "collapsed"}`}
          type="button"
          aria-expanded={isOpen}
          aria-controls={`collapse${index}`}
        >
          {project.name}
        </button>
      </h2>
      <div
        id={`collapse${index}`}
        className={`accordion-collapse ${isOpen ? "expanded" : ""}`}
        aria-labelledby={`heading${index}`}
        ref={contentRef} // Reference to access the DOM element
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
