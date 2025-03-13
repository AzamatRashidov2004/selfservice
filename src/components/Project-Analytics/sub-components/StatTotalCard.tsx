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
function createDataSets(stats: Stat[], labelCount: number): FeedbackDataSets {
  const negativeArr: number[] = [];
  const positiveArr: number[] = [];
  for (let i = 0; i < labelCount; i++) {
    const item = stats[i];
    if (!item) {
      negativeArr.push(0);
      positiveArr.push(0);
      continue;
    }
    negativeArr.push(item.total_negative_feedback);
    positiveArr.push(item.total_positive_feedback);
  }
  return { negative: negativeArr, positive: positiveArr };
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
}: StatCardProps) {
  // Get the array of sessions (if available)
  let sessionStats: ProjectStatsSession[] = [];
  if (graphFeedbackInfo) {
    sessionStats = graphFeedbackInfo.sessions;
  }

  const [totalAnswers, setTotalAnswers] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalFeedback, setTotalFeedback] = useState<number>(0);
  const [totalSessions, setTotalSesssions] = useState<number>(0);

  const [xLabels, setXLabels] = useState<string[]>([]);
  const [dataSets, setDataSets] = useState<FeedbackDataSets>({
    negative: [],
    positive: [],
  });
  // This state holds the computed maximum total feedback count.
  const [yAxisMax, setYAxisMax] = useState<number>(100);

  useEffect(() => {
    const labelSet = getXLabels(selectedTimeInterval);
    setXLabels(labelSet);

    // Aggregate the sessionStats into buckets based on the selected time interval.
    const aggregatedStats = aggregateSessions(
      sessionStats,
      selectedTimeInterval
    );

    // Calculate totals from aggregated stats
    let totalAnswers = 0;
    let totalSessions = 0;
    let totalFeedback = 0;

    aggregatedStats.forEach((stat) => {
      totalAnswers += stat.total_queries;
      totalSessions += stat.total_sessions;
      totalFeedback +=
        stat.total_positive_feedback + stat.total_negative_feedback;
    });

    setTotalAnswers(totalAnswers);
    setTotalSesssions(totalSessions);
    setTotalFeedback(totalFeedback);
    setTotalUsers(totalProjectUsers != null ? totalProjectUsers.data : 0);

    // Compute the maximum total feedback across all buckets.
    const totals = aggregatedStats.map(
      (stat) =>
        (stat.total_negative_feedback || 0) +
        (stat.total_positive_feedback || 0)
    );

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
  ]);

  useEffect(() => {
    console.log("AAAAAA", totalProjectUsers?.data);
  }, [totalProjectUsers]);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "400px",
        width: "65%",
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
        {/* Left side metrics - more compact and centered */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Centers content vertically
            alignItems: "flex-start", // Aligns content to the left
            width: "35%",
            pr: 4,
            pl: 2, // Added left padding
            pt: 1,
          }}
        >
          <Box sx={{ mb: 1, pb: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h5" fontWeight="bold" component="span">
              {totalAnswers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Answers
            </Typography>
          </Box>

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
              {totalFeedback}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Feedback
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" fontWeight="bold" component="span">
              {totalSessions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sessions
            </Typography>
          </Box>
        </Box>

        {/* Right side chart */}
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
                width: "550px", // Slightly reduced to accommodate the metrics section
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
              xAxis={[
                {
                  scaleType: "band",
                  data: xLabels,
                },
              ]}
              yAxis={[{ min: 0, max: yAxisMax }]}
              series={[
                {
                  data: dataSets.negative,
                  color: "#F44336",
                  stack: "total",
                  valueFormatter: (_v, { dataIndex }) =>
                    String(dataSets.negative[dataIndex] || 0),
                },
                {
                  data: dataSets.positive,
                  color: "#74ef4b",
                  stack: "total",
                  valueFormatter: (_v, { dataIndex }) =>
                    String(dataSets.positive[dataIndex] || 0),
                },
              ]}
              width={550} // Slightly reduced to accommodate the metrics section
              height={350}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
