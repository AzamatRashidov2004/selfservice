import React, { useEffect, useState } from 'react';
import './Dashboard.css';

interface Project {
  name: string;
  lastUpdate: string;
  filename: string;
  projectId: string;
}

const Dashboard: React.FC = () => {
  // Example data; replace with actual data fetching logic
  // eslint-disable-next-line
  const [projects, setProjects] = useState<Project[]>();

  useEffect(() => {
    setProjects([
      {
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },{
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },{
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },{
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },
      // Add more project objects as needed
    ])
  }, [])

  return (
    <main className="container-fluid main-container">
      <div className="bg-primary p-4 rounded mb-4">
        <h1 className="text-light">Available Projects</h1>
        <p className="text-light">Choose a project to edit or delete</p>
      </div>
      <table className="table w-100">
        <thead>
          <tr>
            <th className="text-start">Project Name</th>
            <th className="text-start">Last Update</th>
            <th className="text-start">Filename</th>
            <th className="text-start">Project ID</th>
            <th className="text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects && projects.map((project, index) => (
            <tr key={index}>
              <td className={`text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.name}</td>
              <td className={`text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.lastUpdate}</td>
              <td className={`text-start hover-underline ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.filename}</td>
              <td className={`text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>{project.projectId}</td>
              <td className={`text-start ${index % 2 === 0 ? 'gray-bg' : ''}`}>
                <button className="btn btn-outline-danger btn-sm me-2" data-bs-toggle="tooltip" title="Delete">
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
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;