import React, { useEffect, useState } from "react";
import "./Project-Analytics.css";
import ProjectDataGrid from "./sub-components/ProjectDataGrid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import StatTotalCard from "./sub-components/StatTotalCard";

import {
  ProjectSessionResponse,
  fetchProjectSessions,
  fetchProjectSessionsErrors,
  ProjectSessionErrorsResponse,
  fetchTotalUsers,
  TotalProjectUsers,
} from "../../api/maestro/getMaestro";
import Loader from "../Loader/Loader";
import { maestroApiUrl } from "../../api/apiEnv";

type ProjectDetails = {
  setOpenDetails: () => void;
  selectedProjectData: { projectId: string; title: string } | null;
};

const ProjectAnalytics: React.FC<ProjectDetails> = ({
  setOpenDetails,
  selectedProjectData,
}) => {
  const [selectedTimeInterval, setSelectedTimeInterval] =
    useState<string>("day");

  const [sessionInfo, setSessionInfo] = useState<null | ProjectSessionResponse>(
    null
  );

  const [totalProjectUsers, setTotalProjectUsers] =
    useState<TotalProjectUsers | null>(null);

  const [allTimeProjectUsers, setAllTimeProjectUsers] =
    useState<TotalProjectUsers | null>(null);

  const [totalGraphData, setTotalGraphData] = useState<ProjectSessionResponse | null>(null);

  const [sessionInfoErrors, setSessionInfoErrors] =
    useState<null | ProjectSessionErrorsResponse>(null);

  const [graphFeedbackInfo, setGraphFeedbackInfo] =
    useState<null | ProjectSessionResponse>(null);

  const [feedbackGraphLoading, setFeedbackGraphLoading] =
    useState<boolean>(true);


  useEffect(() => {
    async function fetchData() {
      if (!selectedProjectData) return;

      setFeedbackGraphLoading(true);

      // Number of users all time ( a year )
      fetchTotalUsers(selectedProjectData.projectId, "all")
        .then((response) => {
          setAllTimeProjectUsers(response);
        })
        .catch((error) => {
          console.error("Error fetching total users:", error);
        });

      // Number of users on the time range
      fetchTotalUsers(selectedProjectData.projectId, selectedTimeInterval)
        .then((response) => {
          setTotalProjectUsers(response);
        })
        .catch((error) => {
          console.error("Error fetching total users:", error);
        });
      fetchProjectSessionsErrors(selectedProjectData.projectId).then(
        (response) => {
          setSessionInfoErrors(response);
        }
      );
      
      // For all time data 
      fetchProjectSessions(
        selectedProjectData.projectId,
        "all"
      ).then((response) => {
        // Assuming response.session is an array
        const filteredSessions = response.sessions.filter(
          (session) => session.query_count !== 0
        );
        setTotalGraphData({
          status: response.status,
          sessions: filteredSessions,
        });
        setFeedbackGraphLoading(false);
      });

      // Data for the time interval
      fetchProjectSessions(
        selectedProjectData.projectId,
        selectedTimeInterval
      ).then((response) => {
        // Assuming response.session is an array
        const filteredSessions = response.sessions.filter(
          (session) => session.query_count !== 0
        );
        setSessionInfo({
          status: response.status,
          sessions: filteredSessions,
        });
        console.log({
          status: response.status,
          sessions: filteredSessions,
        });
        setGraphFeedbackInfo({
          status: response.status,
          sessions: filteredSessions,
        });
        setFeedbackGraphLoading(false);
      });
    }

    fetchData();
  }, [selectedProjectData, selectedTimeInterval]);

  function launchProject(){
    if (selectedProjectData){
      // todo
      window.open('http://localhost:8020' + `/app?project_id=${selectedProjectData.projectId}`);
    }
  }

  return (
    <div className="analytics-dashboard-wrapper">
      <div className="analytics-dashboard-nav">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 className="project-dashboard-title" onClick={launchProject}>{selectedProjectData ? selectedProjectData.title : ""}</h3>
          <span className="analytics-id-wrapper">
            id: {selectedProjectData ? selectedProjectData.projectId : ""}
          </span>
        </div>
        <button className="btn btn-outline-primary" onClick={setOpenDetails}>
          <ArrowBackIcon />
        </button>
      </div>
      <div className="analytics-dashboard-content">
        {sessionInfo == null ? (
          <div className="loader-container-analytics">
          <Loader />
          </div>
        ) : (
          <>
            <div className="total-graph-parent">
              <StatTotalCard
                graphFeedbackInfo={graphFeedbackInfo}
                selectedTimeInterval={selectedTimeInterval}
                loading={feedbackGraphLoading}
                setSelectedTimeInterval={setSelectedTimeInterval}
                totalProjectUsers={totalProjectUsers}
                allTimeProjectUsers={allTimeProjectUsers}
                totalGraphData={totalGraphData}
              />
            </div>
            {sessionInfo ? (
              <div className="analytics-dashboard-row">
                <ProjectDataGrid
                  sessionData={sessionInfo}
                  sessionDataErrors={sessionInfoErrors}
                />
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectAnalytics;
