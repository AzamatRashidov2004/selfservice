import { maestroApiUrl } from "../apiEnv";

const BASE_URL = maestroApiUrl;
//const BASE_URL = "http://localhost:8020";

// Types for the return values

export interface TotalProjectUsers {
  data: number;
}


export interface TotalProjectUsers {
  data: number;
}

export interface SessionEvent {
  timestamp: string;
  query?: string;
  answer?: string;
  feedback?: number;
}

export interface SessionEventErrors {
  timestamp: string;
  type: string;
  level: string;
  stack: string;
  message: string;
}

export interface SessionEventErrors {
  timestamp: string;
  type: string;
  level: string;
  stack: string;
  message: string;
}

export interface SessionEventsResponse {
  data: SessionEvent[];
}

export interface SessionEventsResponseErrors {
  data: SessionEventErrors[];
}

export interface SessionEventsResponseErrors {
  data: SessionEventErrors[];
}

export interface ProjectStatsSession {
  session_id: string;
  start_timestamp: string;
  query_count: number;
  feedback_count: number;
  positive_feedback: number;
  negative_feedback: number;
  feedback_percentage: number;
}

export interface ProjectStatsSessionErrors {
  session_id: string;
  occurrences: number;
}

export interface ProjectStatsSessionErrors {
  session_id: string;
  occurrences: number;
}

export interface ProjectSessionResponse {
  status: string;
  sessions: ProjectStatsSession[];
}

export interface ProjectSessionErrorsResponse {
  data: ProjectStatsSessionErrors[];
}

export interface ProjectSessionErrorsResponse {
  data: ProjectStatsSessionErrors[];
}

export interface ProjectStatsResponse {
  status: string;
  stats: {
    total_queries: number;
    total_positive_feedback: number;
    total_negative_feedback: number;
    total_sessions: number;
  };
}

// Fetch session events
export async function fetchSessionEvents(
  sessionId: string
): Promise<SessionEventsResponse> {
  const url = `${BASE_URL}/session-events?session_id=${encodeURIComponent(
    sessionId
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch session events: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching session events:", error);
    throw error;
  }
}

// Fetch session events errors
export async function fetchSessionEventsErrors(
  sessionId: string
): Promise<SessionEventsResponseErrors> {
  const url = `${BASE_URL}/session-events-errors?session_id=${encodeURIComponent(
    sessionId
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch session events errors: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching session events errors:", error);
    throw error;
  }
}

// Fetch project stats
export async function fetchProjectSessions(
  projectId: string,
  timeRange: string = "day"
): Promise<ProjectSessionResponse> {
  const url = `${BASE_URL}/project-stats?project_id=${encodeURIComponent(
    projectId
  )}&time_range=${encodeURIComponent(timeRange)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch project stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching project stats:", error);
    throw error;
  }
}

// Fetch project stats errors
export async function fetchProjectSessionsErrors(
  projectId: string
): Promise<ProjectSessionErrorsResponse> {
  const url = `${BASE_URL}/project-stats-errors?project_id=${encodeURIComponent(
    projectId
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch project stats errors: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching project stats errors:", error);
    throw error;
  }
}

// Fetch project stats errors
export async function fetchTotalUsers(
  projectId: string,
  timeRange: string = "day",
): Promise<TotalProjectUsers> {
  const url = `${BASE_URL}/project-total-users?project_id=${encodeURIComponent(
    projectId
  )}&time_range=${encodeURIComponent(timeRange)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch project stats errors: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching project stats errors:", error);
    throw error;
  }
}

// Fetch project stats summary
export async function fetchProjectStats(
  projectId: string,
  timeRange: string = "day"
): Promise<ProjectStatsResponse> {
  const url = `${BASE_URL}/project-stats-summary?project_id=${encodeURIComponent(
    projectId
  )}&time_range=${encodeURIComponent(timeRange)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch project stats summary: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching project stats summary:", error);
    throw error;
  }
}

// Fetch project stats summary for specific time range
export async function fetchProjectStatsTimeRange(
  projectId: string,
  timeRange: string = "day"
): Promise<ProjectStatsResponse> {
  const url = `${BASE_URL}/project-stats-timerange-summary?project_id=${encodeURIComponent(
    projectId
  )}&time_range=${encodeURIComponent(timeRange)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch project stats summary: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching project stats summary:", error);
    throw error;
  }
}
