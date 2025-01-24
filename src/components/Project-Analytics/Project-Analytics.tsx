import React from "react";
import StatCard from "./sub-components/StatCard";
import "./Project-Analytics.css";
import CustomDataGrid from "./sub-components/DataGrid";
import { DropDownButton } from "./sub-components/DropDownButton";
import StatTotalCard from "./sub-components/StatTotalCard";

type ProjectDetails = {
  projectName: string;
  projectId: string;
  projectDescription: string;
  setOpenDetails: () => void;
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
        <div className="analytics-dashboard-row total-graph-parent">
          <div className="stat-chart-wrapper total-graph-child">
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
          <div className="stat-chart-wrapper total-graph-child">
            <StatTotalCard
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
        </div>
        <div className="analytics-dashboard-row">
          <CustomDataGrid />
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
