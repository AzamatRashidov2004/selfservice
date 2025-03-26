import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { BarChart } from "@mui/x-charts/BarChart";

import React, { useEffect, useState } from "react";
import {
  ProjectSessionResponse,
  ProjectStatsSession,
  TotalProjectUsers,
} from "../../../api/maestro/getMaestro";
import Loader from "../../Loader/Loader";
import { TimeControlButtons } from "./TimeControlButtons";
import Typography from "@mui/material/Typography";

/**
 * Types
 */
export type StatCardProps = {
  graphFeedbackInfo: ProjectSessionResponse | null;
  selectedTimeInterval: string;
  loading: boolean;
  setSelectedTimeInterval: React.Dispatch<React.SetStateAction<string>>;
  totalProjectUsers: TotalProjectUsers | null;
  allTimeProjectUsers: TotalProjectUsers | null;
  totalGraphData: ProjectSessionResponse | null;
};

/**
 * Aggregated stat format for the chart.
 */
interface Stat {
  total_queries: number;
  total_positive_feedback: number;
  total_negative_feedback: number;
  total_sessions: number;
}


/**
 * Session data with start_timestamp as a Date.
 */
interface SessionStat {
  session_id: string;
  start_timestamp: Date;
  query_count: number;
  feedback_count: number;
  positive_feedback: number;
  negative_feedback: number;
  feedback_percentage: number;
}

interface FeedbackDataSets {
  negative: number[];
  positive: number[];
  no_feedback: number[];  // Add no feedback array
}

/**
 * Static labels for the "hour" interval.
 */
const dayLabels = [
  "00:00",
  "02:00",
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];

/**
 * Generate week labels (7 days). The first label is 6 days ago and the last is today.
 */
function getWeekLabels(): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dayName = date.toLocaleDateString(undefined, { weekday: "short" });
    labels.push(dayName);
  }
  return labels;
}

/**
 * Generate month labels over a 30‑day period split into 4 segments.
 */
function getMonthLabels(): string[] {
  const numSegments = 4;
  const totalDays = 30;
  const daysPerSegment = Math.floor(totalDays / numSegments);
  const labels: string[] = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - totalDays + 1);

  let segmentStart = new Date(startDate);
  for (let i = 0; i < numSegments; i++) {
    let segmentEnd = new Date(segmentStart);
    if (i < numSegments - 1) {
      segmentEnd.setDate(segmentStart.getDate() + daysPerSegment - 1);
    } else {
      segmentEnd = new Date(now);
    }
    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    labels.push(`${formatDate(segmentStart)} - ${formatDate(segmentEnd)}`);
    segmentStart = new Date(segmentEnd);
    segmentStart.setDate(segmentEnd.getDate() + 1);
  }
  return labels;
}

/**
 * Generate year labels (12 months).
 */
function getYearLabels(): string[] {
  const labels: string[] = [];
  const currentDate = new Date();
  // For alignment with aggregation, subtract 11 months from the first day of the current month.
  const currentMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const startDate = new Date(
    currentMonthStart.getFullYear(),
    currentMonthStart.getMonth() - 11,
    1
  );
  for (let i = 0; i < 12; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const monthLabel = d.toLocaleDateString("en-US", { month: "short" });
    labels.push(monthLabel);
  }
  return labels;
}

/**
 * Choose X-axis labels based on the selected time interval.
 */
function getXLabels(interval: string): string[] {
  switch (interval) {
    case "hour":
      return dayLabels;
    case "day":
      return dayLabels;
    case "week":
      return getWeekLabels();
    case "month":
      return getMonthLabels();
    case "all":
      return getYearLabels();
    default:
      return [];
  }
}

/**
 * Create the data arrays for the chart based on the aggregated stats.
 */
// Updated createDataSets using query_count and feedback ratios
function createDataSets(stats: Stat[], labelCount: number): FeedbackDataSets {
  const negativeArr: number[] = [];
  const positiveArr: number[] = [];
  const noFeedbackArr: number[] = [];
  
  for (let i = 0; i < labelCount; i++) {
    const item = stats[i];
    if (!item) {
      negativeArr.push(0);
      positiveArr.push(0);
      noFeedbackArr.push(0);
      continue;
    }

    // Calculate values based on actual counts
    const totalFeedback = item.total_positive_feedback + item.total_negative_feedback;
    const noFeedback = item.total_queries - totalFeedback;

    positiveArr.push(item.total_positive_feedback);
    negativeArr.push(item.total_negative_feedback);
    noFeedbackArr.push(noFeedback);
  }
  
  return { 
    negative: negativeArr, 
    positive: positiveArr, 
    no_feedback: noFeedbackArr 
  };
}



/**
 * Get the overall time range.
 *
 * For "day": Use today's calendar day (from midnight to midnight).
 * For "week": Use the last 7 calendar days (aligned to midnight boundaries).
 * For "hour": (Uses relative time – you may adjust if needed.)
 * For "month": Uses last 30 days (approximation) – you could also use the current month.
 * For "all": Not used in the equal‑division branch.
 */
function getTimeRange(range_str: string): [Date, Date] {
  let startTime: Date;
  let endTime: Date;
  const now = new Date();
  if (range_str === "hour") {
    startTime = new Date(now.getTime() - 60 * 60 * 1000);
    endTime = now;
  } else if (range_str === "day") {
    // Use today's calendar day: from midnight to midnight.
    startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
  } else if (range_str === "week") {
    // Use the last 7 calendar days: start at midnight 6 days ago, end at tomorrow's midnight.
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    startTime = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);
    endTime = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  } else if (range_str === "month") {
    // For month, you may choose to keep the approximation:
    startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    endTime = now;
  } else if (range_str === "all") {
    startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    endTime = now;
  } else {
    throw new Error("Invalid time range");
  }
  return [startTime, endTime];
}

/**
 * Aggregate the sessions into buckets based on the selected time interval.
 *
 * - For "hour" or "day": Buckets are 2-hour intervals (using today's calendar day boundaries).
 * - For "week": Buckets are full calendar days (from midnight to midnight).
 * - For "month": Buckets are divided into 4 equal segments (approximation).
 * - For "all": Buckets are based on calendar month boundaries.
 */
function aggregateSessions(
  sessions: ProjectStatsSession[],
  selectedTimeInterval: string
): Stat[] {
  // Convert each session to a SessionStat (with start_timestamp as a Date)
  const sessionStats: SessionStat[] = sessions.map((item) => ({
    ...item,
    start_timestamp: new Date(item.start_timestamp),
  }));

  if (selectedTimeInterval === "all") {
    // Use calendar month boundaries.
    const now = new Date();
    // Use the first day of the current month.
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    // Subtract 11 months so that buckets cover the last 12 months including the current month.
    const calendarStartTime = new Date(
      currentMonthStart.getFullYear(),
      currentMonthStart.getMonth() - 11,
      1
    );
    const bucketCount = 12;
    const buckets: { start: Date; end: Date; stat: Stat }[] = [];
    for (let i = 0; i < bucketCount; i++) {
      const bucketStart = new Date(
        calendarStartTime.getFullYear(),
        calendarStartTime.getMonth() + i,
        1
      );
      const bucketEnd = new Date(
        calendarStartTime.getFullYear(),
        calendarStartTime.getMonth() + i + 1,
        1
      );
      buckets.push({
        start: bucketStart,
        end: bucketEnd,
        stat: {
          total_queries: 0,
          total_positive_feedback: 0,
          total_negative_feedback: 0,
          total_sessions: 0,
        },
      });
    }
    // Aggregate each session into its calendar month bucket.
    sessionStats.forEach((session) => {
      const ts = session.start_timestamp;
      const index =
        (ts.getFullYear() - calendarStartTime.getFullYear()) * 12 +
        (ts.getMonth() - calendarStartTime.getMonth());
      if (index >= 0 && index < buckets.length) {
        buckets[index].stat.total_queries += session.query_count;
        buckets[index].stat.total_positive_feedback +=
          session.positive_feedback;
        buckets[index].stat.total_negative_feedback +=
          session.negative_feedback;
        buckets[index].stat.total_sessions += 1;
      }
    });
    return buckets.map((b) => b.stat);
  } else {
    const [startTime, endTime] = getTimeRange(selectedTimeInterval);
    let bucketDuration: number = 0; // in milliseconds
    let bucketCount: number = 0;

    if (selectedTimeInterval === "hour" || selectedTimeInterval === "day") {
      // 2-hour buckets over the calendar day.
      bucketDuration = 2 * 60 * 60 * 1000;
      // Because getTimeRange("day") now returns today's calendar day,
      // bucketCount will be exactly 24/2 = 12.
      bucketCount = 12;
    } else if (selectedTimeInterval === "week") {
      // Buckets are whole days; with our getTimeRange("week") we get 7 calendar days.
      bucketDuration = 24 * 60 * 60 * 1000;
      bucketCount = 7;
    } else if (selectedTimeInterval === "month") {
      bucketCount = 4;
      bucketDuration = (endTime.getTime() - startTime.getTime()) / bucketCount;
    } else {
      throw new Error("Invalid selectedTimeInterval");
    }

    // Initialize empty buckets.
    const buckets: { start: Date; end: Date; stat: Stat }[] = [];
    for (let i = 0; i < bucketCount; i++) {
      const bucketStart = new Date(startTime.getTime() + i * bucketDuration);
      const bucketEnd = new Date(
        startTime.getTime() + (i + 1) * bucketDuration
      );
      buckets.push({
        start: bucketStart,
        end: bucketEnd,
        stat: {
          total_queries: 0,
          total_positive_feedback: 0,
          total_negative_feedback: 0,
          total_sessions: 0,
        },
      });
    }
    // Aggregate each session into the appropriate bucket.
    sessionStats.forEach((session) => {
      const ts = session.start_timestamp;
      if (ts < startTime || ts >= endTime) return;
      const index = Math.floor(
        (ts.getTime() - startTime.getTime()) / bucketDuration
      );
      if (index >= 0 && index < buckets.length) {
        buckets[index].stat.total_queries += session.query_count;
        buckets[index].stat.total_positive_feedback +=
          session.positive_feedback;
        buckets[index].stat.total_negative_feedback +=
          session.negative_feedback;
        buckets[index].stat.total_sessions += 1;
      }
    });
    return buckets.map((b) => b.stat);
  }
}

export default function StatCard({
  graphFeedbackInfo,
  selectedTimeInterval,
  loading,
  setSelectedTimeInterval,
  totalProjectUsers,
  totalGraphData,
  allTimeProjectUsers,
}: StatCardProps) {
  // Get the array of sessions (if available)
  let sessionStats: ProjectStatsSession[] = [];
  let allTimeStats: ProjectStatsSession[] = [];
  if (graphFeedbackInfo) {
    sessionStats = graphFeedbackInfo.sessions;
  }
  if (totalGraphData) {
    allTimeStats = totalGraphData.sessions;
  }

  // Data by time range
  const [totalAnswers, setTotalAnswers] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalNegativeFeedback, setTotalNegativeFeedback] = useState<number>(0);
  const [totalFeedback, setTotalFeedback] = useState<number>(0);
  const [totalSessions, setTotalSesssions] = useState<number>(0);


  // Data for all time ( 1 year )
  const [yearAnswers, setYearAnswers] = useState<number>(0);
  const [yearUsers, setYearUsers] = useState<number>(0);
  const [yearFeedback, setYearFeedback] = useState<number>(0);
  const [yearNegativeFeedback, setYearNegativeFeedback] = useState<number>(0);
  const [yearSessions, setYearSessions] = useState<number>(0);

  const [xLabels, setXLabels] = useState<string[]>([]);
  const [dataSets, setDataSets] = useState<FeedbackDataSets>({
    negative: [],
    positive: [],
    no_feedback: [],
  });
  // This state holds the computed maximum total feedback count.
  const [yAxisMax, setYAxisMax] = useState<number>(100);
  const [aggregatedStats, setAggregatedStats] = useState<Stat[]>([]);

  useEffect(() => {
    const stats = aggregateSessions(sessionStats, selectedTimeInterval);
    setAggregatedStats(stats);

    const labelSet = getXLabels(selectedTimeInterval);
    setXLabels(labelSet);

    // Aggregate the sessionStats into buckets based on the selected time interval.
    const aggregatedStats = aggregateSessions(
      sessionStats,
      selectedTimeInterval
    );

    // Aggregate the sessionStats into buckets based for all time interval 
    const aggregatedStatsAll = aggregateSessions(
      allTimeStats,
      "all"
    );

    // Calculate totals from aggregated stats
    let allTimeAnswers = 0;
    let allTimeSessions = 0;
    let allTimeFeedback = 0;
    
    let allTimeNegativeFeedback = 0;

    aggregatedStatsAll.forEach((stat) => {
      allTimeAnswers += stat.total_queries;
      allTimeSessions += stat.total_sessions;
      allTimeFeedback +=
        stat.total_positive_feedback + stat.total_negative_feedback;
      allTimeNegativeFeedback += stat.total_negative_feedback;
    });

    setYearAnswers(allTimeAnswers);
    setYearSessions(allTimeSessions);
    setYearFeedback(allTimeFeedback);
    setYearNegativeFeedback(allTimeNegativeFeedback);
    setYearUsers(allTimeProjectUsers?.data ? allTimeProjectUsers?.data : 0);

    // Calculate totals from aggregated stats
    let totalAnswers = 0;
    let totalSessions = 0;
    let totalFeedback = 0;
    let totalNegativeFeedback = 0;

    aggregatedStats.forEach((stat) => {
      totalAnswers += stat.total_queries;
      totalSessions += stat.total_sessions;
      totalFeedback +=
        stat.total_positive_feedback + stat.total_negative_feedback;
      totalNegativeFeedback += stat.total_negative_feedback;
    });


    // For total time range data
    setTotalAnswers(totalAnswers);
    setTotalSesssions(totalSessions);
    setTotalFeedback(totalFeedback);
    setTotalNegativeFeedback(totalNegativeFeedback);
    setTotalUsers(totalProjectUsers != null ? totalProjectUsers.data : 0);

    // Compute the maximum height using total_queries from each bucket.
    const totals = aggregatedStats.map((stat) => stat.total_queries);
    const computedMax = Math.max(...totals, 1);
    setYAxisMax(computedMax);

    // Create chart data sets using the aggregated stats.
    const newDataSets = createDataSets(aggregatedStats, labelSet.length);
    setDataSets(newDataSets);
  }, [
    graphFeedbackInfo,
    selectedTimeInterval,
    sessionStats,
    totalProjectUsers,
    allTimeStats,
    allTimeProjectUsers?.data,
  ]);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "500px",
        width: "100%",
        display: "flex",
        id: "graph-main-card",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          padding: 1,
          height: "100%",
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "50%",
            pr: 4,
            pl: 2,
            pt: 1,
          }}
        >
          <Box sx={{ mb: 1, pb: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h5" fontWeight="bold" component="span">
              {yearUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </Box>
          <Box sx={{ mb: 1, pb: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h5" fontWeight="bold" component="span">
              {yearSessions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Sessions
            </Typography>
          </Box>
          <Box sx={{ mb: 1, pb: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h5" fontWeight="bold" component="span">
              {yearAnswers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Answers
            </Typography>
          </Box>
          
          {/* Feedback box with hover details */}
          <Box 
            sx={{ 
              position: "relative",
              mb: 1, 
              pb: 2, 
              borderBottom: "1px solid #ccc",
            }}
          >
            <Typography variant="h5" fontWeight="bold" component="span">
              {yearFeedback}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Feedback
            </Typography>
            <Box sx={{pt: 1}}>
              <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{pr: 1}}>
                  <Typography variant="body2" fontWeight="bold" component="span">
                  <Typography variant="body2" fontWeight="bold" color="success" component="span">
                    P:{" "}
                  </Typography>
                    {yearFeedback - yearNegativeFeedback}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold" component="span">
                  <Typography variant="body2" fontWeight="bold" color="error" component="span">
                    N:{" "}
                  </Typography>
                    {yearNegativeFeedback}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="bold" component="span">
                <Typography variant="body2" color="text.secondary" component="span">
                  Accuracy:{" "}
                </Typography>
                  {yearFeedback > 0 ? (100 - (yearFeedback > 0 ? (yearNegativeFeedback / yearFeedback) * 100 : 0)).toFixed(1) : ""}%
                </Typography>
              </Box>
            </Box>
            </Box>
          </Box>

          {/* Mid chart */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              width: "65%", // Adjusted to match the 35% for metrics
              height: "100%",
            }}
          >
            <TimeControlButtons
              setSelectedTimeInterval={setSelectedTimeInterval}
              selectedTimeInterval={selectedTimeInterval}
            />
            {loading ? (
              <Box
                sx={{
                  width: "600px", // Slightly reduced to accommodate the metrics section
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader />
              </Box>
            ) : (
<BarChart
  xAxis={[{ scaleType: "band", data: xLabels }]}
  yAxis={[{ min: 0, max: yAxisMax }]}
  series={[
    // Positive feedback (green)
    {
      data: dataSets.positive,
      color: "#74ef4b",
      stack: "total",
      valueFormatter: (v) => v?.toFixed(0) || '0',
    },
    // Negative feedback (red)
    {
      data: dataSets.negative,
      color: "#F44336",
      stack: "total",
      valueFormatter: (v) => v?.toFixed(0) || '0',
    },
    // No feedback (grey) - base layer
    {
      data: dataSets.no_feedback,
      color: "#e0e0e0",
      stack: "total",
      valueFormatter: (v) => v?.toFixed(0) || '0',
    },
  ]}
  width={570}
  height={450}
  tooltip={{ 
    trigger: "axis",
    axisContent: ({ dataIndex }) => {
      if (dataIndex == null) return null;
      const bucket = aggregatedStats[dataIndex];
      if (!bucket) return null;
      
      const noFeedback = bucket.total_queries - 
                        (bucket.total_positive_feedback + 
                         bucket.total_negative_feedback);

      return (
        <div style={{ padding: 8, background: '#fff', border: '1px solid #ccc' }}>
          <div><strong>Total Answers:</strong> {bucket.total_queries}</div>
          <div style={{ color: '#4A9A30', fontWeight: "bold" }}>
            Positive: {bucket.total_positive_feedback}
          </div>
          <div style={{ color: '#C2185B', fontWeight: "bold" }}>
            Negative: {bucket.total_negative_feedback}
          </div>
          <div style={{ color: '#757575', fontWeight: "bold" }}>
            No Feedback: {noFeedback}
          </div>
        </div>
      );
    }
  }}
/>




          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "53%",
            pr: 4,
            pl: 2,
            pt: 1,
          }}
        >
          <Box sx={{ mb: 1, pb: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h5" fontWeight="bold" component="span">
              {totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Users
            </Typography>
          </Box>
          <Box sx={{ mb: 1, pb: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h5" fontWeight="bold" component="span">
              {totalSessions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sessions
            </Typography>
          </Box>
          <Box sx={{ mb: 1, pb: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h5" fontWeight="bold" component="span">
              {totalAnswers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Answers
            </Typography>
          </Box>
          
          {/* Feedback box with hover details */}
          <Box 
            sx={{ 
              position: "relative",
              mb: 1, 
              pb: 2, 
              borderBottom: "1px solid #ccc",
              '&:hover .feedback-details': {
                display: 'block'
              }
            }}
          >
            <Typography variant="h5" fontWeight="bold" component="span">
              {totalFeedback}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Feedback
            </Typography>
            
            <Box sx={{pt: 1}}>
              <Box sx={{display: "flex", flexDirection: "row"}}>
                <Box sx={{pr: 1}}>
                  <Typography variant="body2" fontWeight="bold" component="span">
                  <Typography variant="body2" fontWeight="bold" color="success" component="span">
                    P:{" "}
                  </Typography>
                    {totalFeedback - totalNegativeFeedback}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold" component="span">
                  <Typography variant="body2" fontWeight="bold" color="error" component="span">
                    N:{" "}
                  </Typography>
                    {totalNegativeFeedback}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="bold" component="span">
                <Typography variant="body2" color="text.secondary" component="span">
                  Accuracy:{" "}
                </Typography>
                  {totalFeedback > 0 ? (100 - (totalFeedback > 0 ? (totalNegativeFeedback / totalFeedback) * 100 : 0)).toFixed(1) : ""}%
                </Typography>
              </Box>
            </Box> 
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
