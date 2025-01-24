import React, { useEffect, useState } from "react";
import StatCard from "./sub-components/StatCard";
import "./Project-Analytics.css";
import CustomDataGrid from "./sub-components/DataGrid";
import { DropDownButton } from "./sub-components/DropDownButton";
import { ProjectStatsResponse, ProjectSessionResponse, fetchProjectSessions, fetchProjectStats  } from "../../api/maestro/getMaestro";

type ProjectDetails = {
  projectName: string;
  projectId: string;
  projectDescription: string;
  setOpenDetails: () => void;
  selectedProjectId: string | null;
};

const ProjectAnalytics: React.FC<ProjectDetails> = ({
  projectName, 
  setOpenDetails,
  selectedProjectId
}) => {
  const [projectStats, setProjectState] = useState<null | ProjectStatsResponse>(null);
  const [sessionInfo, setSessionInfo] = useState<null | ProjectSessionResponse>(null);

  useEffect(() => {
    async function fetchData(){
      if (!selectedProjectId) return;

      fetchProjectSessions(selectedProjectId, "day").then((response) => {
        // Assuming response.session is an array
        const filteredSessions = response.sessions.filter(session => session.query_count !== 0);
        console.log("1 response", filteredSessions);
        setSessionInfo({status: response.status, sessions: filteredSessions});
      });

      fetchProjectStats(selectedProjectId, "day").then((response) => {
        console.log("2 repsonse", response);
        setProjectState(response);
      })
    }

    fetchData();
  }, [selectedProjectId])

  console.log(projectStats, sessionInfo);
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
