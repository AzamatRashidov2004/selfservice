import React, { useRef } from "react";
import {
  createPopupEvent,
  createNotificationEvent,
} from "../../../utility/Modal_Util";
import { kronosKnowledgeBaseType, projectFetchReturn } from "../../../utility/types.ts";
import { deletePdf } from "../../../api/kronos/deleteKronos.ts";
import { pdfIcon, excelIcon, unknownIcon, csvIcon, txtIcon, plusIcon, htmlIcon, jsonIcon } from "../../../utility/icons.ts";
import "../../Project-Row/Project_Row.css";  // Your existing styles

interface ProjectFilesProps {
  projectData: kronosKnowledgeBaseType[];
  setProjects: React.Dispatch<React.SetStateAction<projectFetchReturn[]>>;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({
  projectData,
  setProjects
}) => {
  const addFileRef = useRef<HTMLTableRowElement | null>(null);
  const newFileInputRef = useRef<HTMLTableRowElement | null>(null);

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
      case "html":
        return htmlIcon;
      case "json":
          return jsonIcon;
      default:
        return unknownIcon;
    }
  };

  const deleteProject = async (response: boolean, project: kronosKnowledgeBaseType, index: number) => {
    if (!response) return;

    const result = await deletePdf(project.project_id, project._id);
    

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
        <tr
          ref={addFileRef}
          className="add-file-wrapper"
          onClick={() => {
            if (newFileInputRef.current && addFileRef.current) {
              newFileInputRef.current.classList.remove("hidden");
              addFileRef.current.classList.add("hidden");
            }
          }}
        >
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
          <tr 
          ref={newFileInputRef} 
          className="hidden">
            <td>
              <div className="input-group">
                <input
                  type="file"
                  className="form-control"
                  id="inputGroupFile"
                  multiple
                  aria-label="Upload"
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  id="inputGroupFileAddon"
                >
                  Upload
                </button>
              </div>
            </td>
            <td>
              <div className="files-cancel-button-wrapper">
                <button 
                className="btn btn-danger text-center"
                onClick={() => {
                  if (addFileRef.current && newFileInputRef.current) {
                    addFileRef.current.classList.remove("hidden");
                    newFileInputRef.current.classList.add("hidden");
                  }
                }}>Cancel</button>
              </div>
            </td>
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
