import React from "react";
import {
  createPopupEvent,
  createNotificationEvent,
} from "../../utility/Modal_Util";
import getFileExstension from "../../utility/File_Exstension";
import { Settings } from "../../utility/Bot_Util";
import {
  deleteAnalyticalProject,
  getSingleAnalyticalConfig,
} from "../../api/analyst";
import {
  deletePdfProject,
  getSinglPdfConfig,
} from "../../api/universal";

interface Project {
  name: string;
  lastUpdate: string;
  filename: string;
  projectId: string;
}

interface ProjectRowProps {
  project: Project;
  index: number;
  setSelectedProject: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedProjectConfig: React.Dispatch<
    React.SetStateAction<Settings | null>
  >;
  setCustomizeStep: React.Dispatch<React.SetStateAction<number>>;
  scrollIntoEditSection: () => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, index, setSelectedProject, setSelectedProjectConfig, setCustomizeStep, scrollIntoEditSection }) => {

    // API delete project here
    const deleteProject = (response: boolean) => {
    if (!response) return;
    if (!deleteAnalyticalProject(project.projectId)) {
      deletePdfProject(project.projectId);
    }
    createNotificationEvent(
      "File Deleted",
      "Succesfully deleted the file",
      "success"
    );
  };

  const handleDeleteClick = () => {
    createPopupEvent(
      "Delete project",
      `Are you sure you want to delete the project with id ${project.projectId}`,
      {
        success: { text: "Delete", type: "danger" },
        cancel: { text: "Cancel", type: "secondary" },
      },
      (response: boolean) => {
        deleteProject(response);
      }
    );
  };

  const launchProject = () => {
    const fileExtension = getFileExstension(project.filename);
    let url: string;

    if (fileExtension === "xlsx" || fileExtension === "csv") {
      url = `https://bot-flowstorm.web.app/selfservice/analytical?configID=${project.projectId}`;
    } else {
      url = `https://bot-flowstorm.web.app/selfservice?configID=${project.projectId}`;
    }

    window.open(url, "_blank");
  };


  async function handleEditClick() {
    setSelectedProject(project.projectId);
    setCustomizeStep(0);

    // API get project config here, set it below and please clean the defaultSettings code
    let config = await getSingleAnalyticalConfig(project.projectId);
    if (config === null) {
      config = await getSinglPdfConfig(project.projectId);
    } else {
      setSelectedProjectConfig(config.answer);
    }
    scrollIntoEditSection();
  }

  return (
   <tr>
      <td className={`project-name text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.name}</td>
      <td className={`project-last-update text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.lastUpdate}</td>
      <td className={`project-filename text-start hover-underline ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.filename}</td>
      <td className={`project-id text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.projectId}</td>
      <td className={`project-actions text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>
        <button className="btn btn-outline-danger btn-sm me-2" data-bs-toggle="tooltip" onClick={handleDeleteClick} title="Delete">
          <i className="fas fa-trash-alt"></i>
        </button>
        <button className="btn btn-outline-warning btn-sm me-2" data-bs-toggle="tooltip" onClick={handleEditClick} title="Edit">
          <i className="fas fa-edit"></i>
        </button>
        <button className="btn btn-outline-info btn-sm" data-bs-toggle="tooltip" onClick={launchProject} title="Launch">
          <i className="fas fa-rocket"></i>
        </button>
      </td>
    </tr>
  );
};

export default ProjectRow;
