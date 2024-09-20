import React from "react";
import {
  createPopupEvent,
  createNotificationEvent,
} from "../../../utility/Modal_Util";
import getFileExstension from "../../../utility/File_Exstension";
import { kronosKnowledgeBaseType, SettingsType } from "../../../utility/types.ts";
import { deleteAnalyticalProject } from "../../../api/analyst/deleteAnalyst.ts";
import { deletePdf } from "../../../api/kronos/deleteKronos.ts";
import { handleGetSingleConfig } from "../../../utility/Api_Utils";
import { ProjectType } from "../../../utility/types";
import { pdfIcon, excelIcon, unknownIcon, csvIcon, txtIcon } from "../../../utility/icons.ts";
import "../../Project-Row/Project_Row.css";

interface ProjectRowProps {
  project: kronosKnowledgeBaseType;
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
    const getIconByExtension = (extension: string) => {
        switch (extension.toLowerCase()) {
          case 'pdf':
            return pdfIcon;
          case 'xlsx':
          case 'xls':
            return excelIcon;
          case 'csv':
            return csvIcon;
          case 'txt':
            return txtIcon;
          default:
            return unknownIcon;
        }
      };

  const deleteProject = async (response: boolean) => {
    if (!response) return;

    let result;
    const fileExtension = getFileExstension(project.source_file);
    if (fileExtension !== "pdf") {
      // Analytical delete
      result = await deleteAnalyticalProject(project._id);
    } else if (project.project_id) {
      // Pdf delete
      result = await deletePdf(project.project_id);
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
      `Are you sure you want to delete the project with id ${project._id}`,
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
    const fileExtension = getFileExstension(project.source_file);
    let url: string;

    if (fileExtension === "xlsx" || fileExtension === "csv") {
      url = `https://bot-flowstorm.web.app/selfservice/analytical?configID=${project._id}`;
    } else {
      url = `https://bot-flowstorm.web.app/selfservice?configID=${project._id}`;
    }

    window.open(url, "_blank");
  };

  async function handleEditClick() {
    setSelectedProject(project._id);
    setCustomizeStep(0);
    setIsAnalytical(!(getFileExstension(project.source_file) === "pdf"));
    
    if (project.project_id) setSelectedProjectID(project.project_id);

    const config = await handleGetSingleConfig({name: project.name, lastUpdate: project.created_at, filename: project.source_file, docId: project._id, projectId: project.project_id});
    if (config) {
      setSelectedProjectConfig(config);
      scrollIntoEditSection();
      setSelectedIndex(index);
    }
  }
  const { src: iconSrc, alt: iconAlt } = getIconByExtension(project.source_type);
  
  return (
    <tr>
      <td
        className={`collapsable-text project-name text-start filename-wrapper ${
          index % 2 === 0 ? "gray-bg" : ""
        }`}
      >
        <img src={iconSrc} alt={iconAlt} className="project-row-img" />
        <span className="hover-underline project-row-span">
          {project.source_file}
        </span>
      </td>
      <td
        className={`collapsable-text project-id text-end ${
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
