import React, { useState } from "react";
import StatCard from "./sub-components/StatCard";
import "./Project-Analytics.css";
import CustomDataGrid from "./sub-components/DataGrid";

type ProjectDetails = {
  projectName: string;
  projectId: string;
  projectDescription: string;
  setOpenDetails: () => void;
};

const DropDownButton = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Last Day");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    console.log(`Selected: ${option}`); // Add your logic here
  };

  return (
    <div className="dropdown">
      {/* Dropdown button */}
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedOption}
      </button>

      {/* Dropdown menu */}
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("Last Day")}
          >
            Last Day
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("Last Week")}
          >
            Last Week
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect("Last Month")}
          >
            Last Month
          </button>
        </li>
      </ul>
    </div>
  );
};

const ProjectAnalytics: React.FC<ProjectDetails> = ({
  projectName,
  projectDescription,
  projectId,
  setOpenDetails,
}) => {
  console.log(projectDescription, projectId);

  return (
    <div className="analytics-dashboard-wrapper">
      <div className="analytics-dashboard-nav">
        <h3>{projectName}</h3>
        <button className="btn btn-outline-primary" onClick={setOpenDetails}>
          File Browser
        </button>
      </div>
      <div className="analytics-dashboard-content">
        <DropDownButton />
        <div className="analytics-dashboard-row">
          <div className="stat-chart-wrapper">
            <StatCard
              title="Sessions"
              value="200"
              interval="Last 30 days"
              trend="neutral"
              data={[
                200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320,
                360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
                460, 30, 880, 920,
              ]}
            />
          </div>
          <div className="stat-chart-wrapper">
            <StatCard
              title="People"
              value="200"
              interval="Last 30 days"
              trend="up"
              data={[
                200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 940, 320,
                360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
                460, 600, 880, 920,
              ]}
            />
          </div>
          <div className="stat-chart-wrapper">
            <StatCard
              title="Hawkeye"
              value="200"
              interval="Last 30 days"
              trend="down"
              data={[
                200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 140, 320,
                360, 340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480,
                460, 600, 880, 920,
              ]}
            />
          </div>
        </div>
        <div className="analytics-dashboard-row">
          <CustomDataGrid />
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
