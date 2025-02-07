import React, { useEffect, useState } from "react";
import StatCard from "./sub-components/StatCard";
import "./Project-Analytics.css";
import ProjectDataGrid from "./sub-components/ProjectDataGrid";

import StatTotalCard from "./sub-components/StatTotalCard";

import {
  ProjectStatsResponse,
  ProjectSessionResponse,
  fetchProjectSessions,
  fetchProjectStats,
  fetchProjectStatsTimeRange,
} from "../../api/maestro/getMaestro";
import Loader from "../Loader/Loader";
import { TimeControlButtons } from "./sub-components/TimeControlButtons";

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

  const [projectStats, setProjectState] = useState<null | ProjectStatsResponse>(
    null
  );
  const [sessionInfo, setSessionInfo] = useState<null | ProjectSessionResponse>(
    null
  );

  const [graphFeedbackInfo, setGraphFeedbackInfo] =
    useState<null | ProjectStatsResponse>(null);

  const [feedbackGraphLoading, setFeedbackGraphLoading] =
    useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      if (!selectedProjectData) return;

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
      });

      setFeedbackGraphLoading(true);
      if (selectedTimeInterval == "hour") {
        fetchProjectStatsTimeRange(selectedProjectData.projectId, "day").then(
          (response) => {
            setGraphFeedbackInfo(response);
            if (response != null) {
              setFeedbackGraphLoading(false);
            }
          }
        );
        fetchProjectStats(selectedProjectData.projectId, "day").then(
          (response) => {
            setProjectState(response);
          }
        );
      } else {
        fetchProjectStatsTimeRange(
          selectedProjectData.projectId,
          selectedTimeInterval
        ).then((response) => {
          setGraphFeedbackInfo(response);
          if (response != null) {
            setFeedbackGraphLoading(false);
          }
        });
        fetchProjectStats(
          selectedProjectData.projectId,
          selectedTimeInterval
        ).then((response) => {
          setProjectState(response);
        });
      }
    }

    fetchData();
  }, [selectedProjectData, selectedTimeInterval]);

  return (
    <div className="analytics-dashboard-wrapper">
      <div className="analytics-dashboard-nav">
        <div>
          <h3>{selectedProjectData ? selectedProjectData.title : ""}</h3>
          <span className="analytics-id-wrapper">
            id: {selectedProjectData ? selectedProjectData.projectId : ""}
          </span>
        </div>
        <button className="btn btn-outline-primary" onClick={setOpenDetails}>
          File Browser
        </button>
      </div>
      <div className="analytics-dashboard-content">
        {projectStats == null && sessionInfo == null ? (
          <Loader />
        ) : (
          <>
            <div className="total-graph-parent">
              <StatTotalCard
                graphFeedbackInfo={graphFeedbackInfo}
                selectedTimeInterval={selectedTimeInterval}
                loading={feedbackGraphLoading}
                setSelectedTimeInterval={setSelectedTimeInterval}
              />
              {/*<StatCard projectStats={projectStats} />*/}
            </div>
            {sessionInfo ? (
              <div className="analytics-dashboard-row">
                <ProjectDataGrid sessionData={sessionInfo} />
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
