import React from 'react';
import { createPopupEvent } from '../../utility/Modal_Util';

interface Project {
  name: string;
  lastUpdate: string;
  filename: string;
  projectId: string;
}

interface ProjectRowProps {
  project: Project;
  index: number;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, index }) => {

    const deleteProject = () => {
        // API delete project here
        console.log("DELETE PROJECT");
    }

    const handleDeleteClick = () => {
        createPopupEvent(
            "Delete project",
            `Are you sure you want to delete the project with id ${project.projectId}`,
            {success: {text: "Delete", type: "danger"}, cancel: {text: "Cancel", type: "secondary"}},
            deleteProject
        )
    }

  return (
    <tr>
      <td className={`text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.name}</td>
      <td className={`text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.lastUpdate}</td>
      <td className={`text-start hover-underline ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.filename}</td>
      <td className={`text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.projectId}</td>
      <td className={`text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>
        <button className="btn btn-outline-danger btn-sm me-2" data-bs-toggle="tooltip" onClick={handleDeleteClick} title="Delete">
          <i className="fas fa-trash-alt"></i>
        </button>
        <button className="btn btn-outline-warning btn-sm me-2" data-bs-toggle="tooltip" title="Edit">
          <i className="fas fa-edit"></i>
        </button>
        <button className="btn btn-outline-info btn-sm" data-bs-toggle="tooltip" title="Launch">
          <i className="fas fa-rocket"></i>
        </button>
      </td>
    </tr>
  );
};

export default ProjectRow;
