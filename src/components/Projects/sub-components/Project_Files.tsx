import React, { useRef, useState } from "react";
import {
  createPopupEvent,
  createNotificationEvent,
} from "../../../utility/Modal_Util";
import { kronosKnowledgeBaseType, KronosProjectType, projectFetchReturn } from "../../../utility/types.ts";
import { pdfIcon, excelIcon, unknownIcon, csvIcon, txtIcon, plusIcon, htmlIcon, jsonIcon } from "../../../utility/icons.ts";
import "../../Project-Row/Project_Row.css";  // Your existing styles
import { uploadMultiplePdfs } from "../../../api/kronos/postKronos.ts";
import { deletePdf } from "../../../api/kronos/deleteKronos.ts";
import { getPdfFile } from "../../../api/kronos/getKronos.ts";

interface ProjectFilesProps {
  projectId: string,
  project: KronosProjectType;
  projectIndex: number;
  projectData: kronosKnowledgeBaseType[];
  setProjects: React.Dispatch<React.SetStateAction<projectFetchReturn[]>>;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({
  projectId,
  projectIndex,
  projectData,
  setProjects,
}) => {
  const addFileRef = useRef<HTMLTableRowElement | null>(null);
  const newFileInputRef = useRef<HTMLTableRowElement | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);

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

  
  // Sorting function based on the custom order
  const sortBySourceType = (a: kronosKnowledgeBaseType, b: kronosKnowledgeBaseType) => {
    // Custom order for source types
    const customOrder = ['pdf', 'svg', 'xlsx', 'xls', 'json', 'csv', 'xml', 'txt', 'doc', 'docx', 'ppt', 'pptx', 'rtf', 'html', 'md', 'yaml', 'yml', 'odt', 'ods'];
    return customOrder.indexOf(a.source_type) - customOrder.indexOf(b.source_type);
  };

  projectData = projectData.sort(sortBySourceType); // Sort the project files to have the same types next to one another

  const handleUploadFiles = async () => {
    if (!files) return;

    const response = await uploadMultiplePdfs(files, projectId);

    if (!response) {
      return createNotificationEvent("Failed To Upload", "Something went wrong while uploading files...", "danger");
    }
    // setProjects([...projectData, ]) // TODO add the newly uploaded file.
    return createNotificationEvent("File Upload Succesfull", "Succesfully uploaded the files", "success");
  }

  const handleDeleteClick = (knowledgeBase: kronosKnowledgeBaseType) => {
    createPopupEvent(
      "Delete project",
      `Are you sure you want to delete the pdf file with name ${knowledgeBase.source_file}?`,
      {
        success: { text: "Delete", type: "danger" },
        cancel: { text: "Cancel", type: "secondary" },
      },
      (response: boolean) => handleDeletePdf(response, knowledgeBase)
    );
  }

  const handleDeletePdf = async (response: boolean, knowledgeBase: kronosKnowledgeBaseType) => {
    if (!response) return;

    const result = await deletePdf(projectId, knowledgeBase._id);

    if (!result){
        return createNotificationEvent("Something Went Wrong",
          "While trying to delete the file, something went wrong. Please try again later",
          "danger"
        );
    } 

    // Remove the pdf file from UI
    
    setProjects((allProjects) => {
      const currentProject = allProjects[projectIndex];
    
      const updatedProjectData = currentProject.projectData.filter(
        (data) => data._id !== knowledgeBase._id
      );
    
      const updatedProject = {
        ...currentProject,
        projectData: updatedProjectData,
      };
    
      const updatedAllProjects = [...allProjects];
      updatedAllProjects[projectIndex] = updatedProject;
    
      return updatedAllProjects;
    });

    return  createNotificationEvent("Successfully deleted file",
      "File was deleted succesfully",
      "success"
    );
  }

  const projectDataWithResoursec = [
    ...projectData, 
    {source_type: "json", source_file: "fsm.json", _id: null}, 
    {source_type: "html", source_file: "index.html", _id: null}
  ]; // Adding the fsm and html resources as visuals

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files); // Set the selected files
  };

  const handleFilenameClick = async (knowledgeBase: kronosKnowledgeBaseType) => {
    if (!knowledgeBase._id) return;

    await getPdfFile(projectId, knowledgeBase._id, knowledgeBase.source_file);
  }

  return (
    <div className="project-table-wrapper bg-secondary">
      <table className="table w-100 bg-secondary file-table">
        <thead>
          <tr className="thead-content">
            <th className="thead-content project-filename text-start">Filename</th>
            <th className="thead-content project-actions text-end"></th>
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
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  id="inputGroupFileAddon"
                  onClick={handleUploadFiles}
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
            projectDataWithResoursec.map((knowledgeBase, index) => {
              const { src: iconSrc, alt: iconAlt } = getIconByExtension(knowledgeBase.source_type);

              return (
                <tr key={index}>
                  <td
                    onClick={() => {if (knowledgeBase._id) handleFilenameClick(knowledgeBase)}}
                    className={`collapsable-text project-name text-start filename-wrapper ${
                      index % 2 === 0 ? "gray-bg" : ""
                    }`}
                  >
                    <img src={iconSrc} alt={iconAlt} className="project-row-img" />
                    <span className="hover-underline project-row-span">
                      {knowledgeBase.source_file}
                    </span>
                  </td>
                  <td
                    className={`collapsable-text project-id text-end ${
                      index % 2 === 0 ? "gray-bg" : ""
                    }`}
                  >
                    {knowledgeBase._id && 
                      <button
                        className="btn btn-outline-danger btn-sm me-2"
                        data-bs-toggle="tooltip"
                        onClick={() => handleDeleteClick(knowledgeBase)}
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    }
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
