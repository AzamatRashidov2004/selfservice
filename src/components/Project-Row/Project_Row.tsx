import React from "react";
import {
  createPopupEvent,
  createNotificationEvent,
} from "../../utility/Modal_Util";
import getFileExstension from "../../utility/File_Exstension";
import { SettingsType } from "../../utility/types.ts";
import { deleteAnalyticalProject } from "../../api/analyst/deleteAnalyst.ts";
import { deletePdf } from "../../api/kronos/deleteKronos.ts";
import { handleGetSingleConfig } from "../../utility/Api_Utils";
import { ProjectType } from "../../utility/types";

interface ProjectRowProps {
  project: ProjectType;
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

const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  index,
  setSelectedProject,
  setSelectedProjectConfig,
  setCustomizeStep,
  scrollIntoEditSection,
  setIsAnalytical,
  setProjects,
  setSelectedProjectID,
  setSelectedIndex,
}) => {
  const deleteProject = async (response: boolean) => {
    if (!response) return;

    let result;
    const fileExtension = getFileExstension(project.filename);
    if (fileExtension !== "pdf") {
      // Analytical delete
      result = await deleteAnalyticalProject(project.docId);
    } else if (project.projectId) {
      // Pdf delete
      result = await deletePdf(project.projectId);
    }

    if (!result) {
      console.error("Something went wrong while deleting project");

      createNotificationEvent(
        "Something Went Wrong",
        "While trying to delete the file, something went wrong. Please try again later",
        "danger"
      );
    }

    createNotificationEvent(
      "File Deleted",
      "Succesfully deleted the file",
      "success"
    );

    // Remove this project from the list
    setProjects((prevProjects) => prevProjects.filter((_, i) => i !== index));
    return result;
  };

  const handleDeleteClick = () => {
    createPopupEvent(
      "Delete project",
      `Are you sure you want to delete the project with id ${project.docId}`,
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
      url = `https://bot-flowstorm.web.app/selfservice/analytical?configID=${project.docId}`;
    } else {
      url = `https://bot-flowstorm.web.app/selfservice?configID=${project.docId}`;
    }

    window.open(url, "_blank");
  };

  async function handleEditClick() {
    setSelectedProject(project.docId);
    setCustomizeStep(0);
    setIsAnalytical(!(getFileExstension(project.filename) === "pdf"));
    if (project.projectId) setSelectedProjectID(project.projectId);
    // API get project config here, set it below and please clean the defaultSettings code
    const config = await handleGetSingleConfig(project);
    if (config) {
      setSelectedProjectConfig(config);
      scrollIntoEditSection();
    }
    setSelectedIndex(index);
  }

  return (
    <tr>
      <td
        className={`project-name text-start ${
          index % 2 === 0 ? "gray-bg" : ""
        }`}
      >
        {project.name}
      </td>
      <td
        className={`project-last-update text-start ${
          index % 2 === 0 ? "gray-bg" : ""
        }`}
      >
        {project.lastUpdate}
      </td>
      <td
        className={`project-filename text-start hover-underline ${
          index % 2 === 0 ? "gray-bg" : ""
        }`}
      >
        {project.filename}
      </td>
      <td
        className={`project-id text-start ${index % 2 === 0 ? "gray-bg" : ""}`}
      >
        {project.docId}
      </td>
      <td
        className={`project-actions text-start text-nowrap ${
          index % 2 === 0 ? "gray-bg" : ""
        }`}
      >
        <button
          className="btn btn-outline-danger btn-sm me-2"
          data-bs-toggle="tooltip"
          onClick={handleDeleteClick}
          title="Delete"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
        <button
          className="btn btn-outline-warning btn-sm me-2"
          data-bs-toggle="tooltip"
          onClick={handleEditClick}
          title="Edit"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          className="btn btn-outline-info btn-sm"
          data-bs-toggle="tooltip"
          onClick={launchProject}
          title="Launch"
        >
          <i className="fas fa-rocket"></i>
        </button>
      </td>
    </tr>
  );
};

export default ProjectRow;
