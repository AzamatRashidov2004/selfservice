import React from "react";
import {
  createPopupEvent,
  createNotificationEvent,
} from "../../../utility/Modal_Util";
import getFileExstension from "../../../utility/File_Exstension";
import { kronosKnowledgeBaseType, SettingsType, ProjectType } from "../../../utility/types.ts";
import { deleteAnalyticalProject } from "../../../api/analyst/deleteAnalyst.ts";
import { deletePdf } from "../../../api/kronos/deleteKronos.ts";
import { handleGetSingleConfig } from "../../../utility/Api_Utils";
import { pdfIcon, excelIcon, unknownIcon, csvIcon, txtIcon, plusIcon } from "../../../utility/icons.ts";
import "../../Project-Row/Project_Row.css";  // Your existing styles

interface ProjectFilesProps {
  projectData: kronosKnowledgeBaseType[];
  setSelectedProject: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedProjectConfig: React.Dispatch<React.SetStateAction<SettingsType | null>>;
  setCustomizeStep: React.Dispatch<React.SetStateAction<number>>;
  scrollIntoEditSection: () => void;
  setIsAnalytical: React.Dispatch<React.SetStateAction<boolean>>;
  setProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  setSelectedProjectID: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({
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
  const getIconByExtension = (extension: string) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return pdfIcon;
      case "xlsx":
      case "xls":
        return excelIcon;
      case "csv":
        return csvIcon;
      case "txt":
        return txtIcon;
      default:
        return unknownIcon;
    }
  };

  const deleteProject = async (response: boolean, project: kronosKnowledgeBaseType, index: number) => {
    if (!response) return;

    let result;
    const fileExtension = getFileExstension(project.source_file);
    if (fileExtension !== "pdf") {
      result = await deleteAnalyticalProject(project._id);
    } else if (project.project_id) {
      result = await deletePdf(project.project_id);
    }

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

  const handleDeleteClick = (project: kronosKnowledgeBaseType, index: number) => {
    createPopupEvent(
      "Delete project",
      `Are you sure you want to delete the project with id ${project._id}?`,
      {
        success: { text: "Delete", type: "danger" },
        cancel: { text: "Cancel", type: "secondary" },
      },
      (response: boolean) => deleteProject(response, project, index)
    );
  };

  const handleEditClick = async (project: kronosKnowledgeBaseType, index: number) => {
    setSelectedProject(project._id);
    setCustomizeStep(0);
    setIsAnalytical(!(getFileExstension(project.source_file) === "pdf"));
    if (project.project_id) setSelectedProjectID(project.project_id);

    const config = await handleGetSingleConfig({
      name: project.name,
      lastUpdate: project.created_at,
      filename: project.source_file,
      docId: project._id,
      projectId: project.project_id,
    });
    if (config) {
      setSelectedProjectConfig(config);
      scrollIntoEditSection();
      setSelectedIndex(index);
    }
  };

  const launchProject = (project: kronosKnowledgeBaseType) => {
    const fileExtension = getFileExstension(project.source_file);
    const url =
      fileExtension === "xlsx" || fileExtension === "csv"
        ? `https://bot-flowstorm.web.app/selfservice/analytical?configID=${project._id}`
        : `https://bot-flowstorm.web.app/selfservice?configID=${project._id}`;

    window.open(url, "_blank");
  };

  return (
    <div className="project-table-wrapper bg-secondary">
      <table className="table w-100 bg-secondary">
        <thead>
          <tr className="thead-content">
            <th className="thead-content project-filename text-start">Filename</th>
            <th className="thead-content project-actions text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="add-file-wrapper">
            <td>
              <img
                src={plusIcon.src}
                alt={plusIcon.alt}
                className="project-row-img add-file-img"
              />
              <span className="project-row-span">Add new file</span>
            </td>
            <td></td>
          </tr>

          {projectData &&
            projectData.map((project, index) => {
              const { src: iconSrc, alt: iconAlt } = getIconByExtension(project.source_type);

              return (
                <tr key={index}>
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
                      onClick={() => handleDeleteClick(project, index)}
                      title="Delete"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm me-2"
                      data-bs-toggle="tooltip"
                      onClick={() => handleEditClick(project, index)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-outline-info btn-sm"
                      data-bs-toggle="tooltip"
                      onClick={() => launchProject(project)}
                      title="Launch"
                    >
                      <i className="fas fa-rocket"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectFiles;
