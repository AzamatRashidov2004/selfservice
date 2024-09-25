import React, { useRef, useEffect } from "react";
import "./Projects.css";
import ProjectFiles from "./sub-components/Project_Files";
import { kronosKnowledgeBaseType, KronosProjectType, projectFetchReturn } from "../../utility/types";
import { formatKronosDate } from "../../utility/Date_Util";
import { createNotificationEvent, createPopupEvent } from "../../utility/Modal_Util";
import { deletePdfProject } from "../../api/kronos/deleteKronos";


interface ProjectsProps {
  project: KronosProjectType;
  projectData: kronosKnowledgeBaseType[];
  index: number;
  setProjects: React.Dispatch<React.SetStateAction<projectFetchReturn[]>>;
  openProjectIndex: number | null;
  setOpenProjectIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const Project: React.FC<ProjectsProps> = ({ 
  index, 
  project, 
  projectData,
  setProjects,
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

  const handleDeleteProjectClick = (project: kronosKnowledgeBaseType, index: number) => {
    createPopupEvent(
      "Delete project",
      `Are you sure you want to delete the pdf file with name ${project.source_file}?`,
      {
        success: { text: "Delete", type: "danger" },
        cancel: { text: "Cancel", type: "secondary" },
      },
      (response: boolean) => handleDeleteProject(response, index)
    );
  };

  const handleDeleteProject = async (response: boolean, index: number) => {
    if (!response) return;

    const result = await deletePdfProject(project._id);
    

    if (!result) {
      console.error("Something went wrong while deleting project");
      createNotificationEvent(
        "Something Went Wrong",
        "While trying to delete the file, something went wrong. Please try again later",
        "danger"
      );
    } else {
      createNotificationEvent("File Deleted", "Succesfully deleted the file", "success");
      setProjects((prevProjects) => prevProjects.filter((_, i) => i !== index));
    }

    return result;
  };

  return (
    <div className="accordion-item">
      <div className={`accordion-header-container bg-primary ${openProjectIndex === index ? "expanded" : ""}`}  id={`heading${index}`}>
        <button
          onClick={toggleAccordion}
          className={`accordion-button ${index % 2 === 0 ? "odd" : ""} ${openProjectIndex === index ? "" : "collapsed"}`}
          type="button"
          aria-expanded={openProjectIndex === index}
          aria-controls={`collapse${index}`}
        >
          <div className="accordion-project-name">{project.name}</div>
          <div className="accordion-project-update">{formatKronosDate(new Date(project.created_at))}</div>
          <div className="accordion-project-id">{project._id}</div>
          <div className="accordion-project-action">&nbsp;</div>
        </button>
        
      </div>
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
          <ProjectFiles
            projectId={project._id}
            projectData={projectData}
            setProjects={setProjects}
          />
        </div>
      </div>
    </div>
  );
};

export default Project;
