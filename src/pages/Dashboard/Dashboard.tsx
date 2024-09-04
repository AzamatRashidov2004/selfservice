import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import ProjectRow from '../../components/Project-Row/Project_Row'; // Import the new component

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
      },
      {
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },
      {
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },
      {
        name: 'ESET Demo',
        lastUpdate: '11-06-2024',
        filename: 'ESET_PROJECT_ELITE_brochure.pdf',
        projectId: '02dd0b421950790bd3ef61c92457eb61',
      },
      // Add more project objects as needed
    ]);
  }, []);

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
            <ProjectRow key={index} project={project} index={index} />
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Dashboard;
