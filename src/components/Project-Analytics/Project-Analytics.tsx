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
import { Box, SxProps, ToggleButton, ToggleButtonGroup } from "@mui/material";

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

  const toggleGroupStyles: SxProps = {
    // Outer container’s background & border radius for a pill shape.
    borderRadius: "24px",
    p: "2px",
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: "10px",

    // Remove the default borders between grouped toggles.
    "& .MuiToggleButtonGroup-grouped": {
      border: 0,
      borderRadius: "24px",
      textTransform: "none",
      color: "#555", // Unselected text color
      "&.Mui-selected": {
        // Selected state styles
        color: "#fff",
        backgroundColor: "#1a73e8",
        "&:hover": {
          backgroundColor: "#1669c1",
        },
      },
      "&:hover": {
        // Hover for unselected
        backgroundColor: "#e0e0e0",
      },
      // Remove extra border between buttons
      "&:not(:first-of-type)": {
        borderLeft: 0,
        marginLeft: "4px",
      },
    },
  };

  const handleIntervalChange = (
    _event: React.MouseEvent<HTMLElement>,
    newInterval: string | null
  ) => {
    if (newInterval !== null && setSelectedTimeInterval) {
      setSelectedTimeInterval(newInterval);
    }
  };

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
            {/* Header: Time Interval Buttons */}
            <Box sx={{ zIndex: "10001" }}>
              <ToggleButtonGroup
                value={selectedTimeInterval}
                exclusive
                onChange={handleIntervalChange}
                sx={toggleGroupStyles}
              >
                <ToggleButton
                  value="hour"
                  sx={{ textTransform: "none", borderRadius: 0, px: 2 }}
                >
                  1h
                </ToggleButton>
                <ToggleButton
                  value="day"
                  sx={{ textTransform: "none", borderRadius: 0, px: 2 }}
                >
                  1d
                </ToggleButton>
                <ToggleButton
                  value="week"
                  sx={{ textTransform: "none", borderRadius: 0, px: 2 }}
                >
                  1w
                </ToggleButton>
                <ToggleButton
                  value="month"
                  sx={{ textTransform: "none", borderRadius: 0, px: 2 }}
                >
                  1m
                </ToggleButton>
                <ToggleButton
                  value="all"
                  sx={{ textTransform: "none", borderRadius: 0, px: 2 }}
                >
                  1y
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <div className="total-graph-parent">
              <StatTotalCard
                graphFeedbackInfo={graphFeedbackInfo}
                selectedTimeInterval={selectedTimeInterval}
                loading={feedbackGraphLoading}
              />
              <StatCard projectStats={projectStats} />
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
