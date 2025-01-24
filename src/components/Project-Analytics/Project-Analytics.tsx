import React, { useEffect, useState } from "react";
import StatCard from "./sub-components/StatCard";
import "./Project-Analytics.css";
import SessionsDataGrid from "./sub-components/DataGrid";

import StatTotalCard from "./sub-components/StatTotalCard";

import {
  ProjectStatsResponse,
  ProjectSessionResponse,
  fetchProjectSessions,
  fetchProjectStats,
} from "../../api/maestro/getMaestro";
import Loader from "../Loader/Loader";

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
  selectedProjectId,
}) => {
  const [projectStats, setProjectState] = useState<null | ProjectStatsResponse>(
    null
  );
  const [sessionInfo, setSessionInfo] = useState<null | ProjectSessionResponse>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      if (!selectedProjectId) return;

      fetchProjectSessions(selectedProjectId, "day").then((response) => {
        // Assuming response.session is an array
        const filteredSessions = response.sessions.filter(
          (session) => session.query_count !== 0
        );
        console.log("1 response", filteredSessions);
        setSessionInfo({ status: response.status, sessions: filteredSessions });
      });

      fetchProjectStats(selectedProjectId, "day").then((response) => {
        console.log("2 repsonse", response);
        setProjectState(response);
      });
    }

    fetchData();
  }, [selectedProjectId]);

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
        <div className="analytics-dashboard-row total-graph-parent">
          {projectStats == null ? (
            <Loader />
          ) : (
            <>
              <div className="stat-chart-wrapper total-graph-child">
                <StatCard projectStats={projectStats} />
              </div>
              <div className="stat-chart-wrapper total-graph-child">
                <StatTotalCard projectStats={projectStats} />
              </div>
            </>
          )}
        </div>
        {
          sessionInfo ? 
          <div className="analytics-dashboard-row">
          <SessionsDataGrid sessionData={sessionInfo}/>
        </div> : <></>
        }
      </div>
    </div>
  );
};

export default ProjectAnalytics;
