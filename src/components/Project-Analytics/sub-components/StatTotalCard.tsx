import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { BarChart } from "@mui/x-charts/BarChart";
import React, { useEffect, useState } from "react";
import {
  ProjectSessionResponse,
  ProjectStatsSession,
} from "../../../api/maestro/getMaestro";
import Loader from "../../Loader/Loader";
import { TimeControlButtons } from "./TimeControlButtons";

/**
 * Types
 */
export type StatCardProps = {
  graphFeedbackInfo: ProjectSessionResponse | null;
  selectedTimeInterval: string;
  loading: boolean;
  setSelectedTimeInterval: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * This is the aggregated stat format used for the chart.
 */
interface Stat {
  total_queries: number;
  total_positive_feedback: number;
  total_negative_feedback: number;
  total_sessions: number;
}

/**
 * This type represents the raw session data (converted so that start_timestamp is a Date).
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
    const dayName = date.toLocaleDateString(undefined, { weekday: "long" });
    labels.push(dayName);
  }
  return labels;
}

/**
 * Generate month labels over a 30‑day period split into 4 segments.
 * (Example: "28 Jan - 3 Feb")
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
 * Generate year labels (12 months). For example, if today is February, this returns:
 * ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
 */

function getYearLabels(): string[] {
  const labels: string[] = [];
  const currentDate = new Date();
  const currentMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  // Subtract 11 months so that the labels start at the same month as calendarStartTime.
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
 * Returns a [startTime, endTime] pair for the selected interval.
 * (For "hour", "day", "week", and "month", this simple approximation is used.)
 * For "all", we will override the bucket logic below.
 */
function getTimeRange(range_str: string): [Date, Date] {
  const endTime = new Date();
  let startTime: Date;
  if (range_str === "hour") {
    startTime = new Date(endTime.getTime() - 60 * 60 * 1000); // last hour
  } else if (range_str === "day") {
    startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000); // last 24 hours
  } else if (range_str === "week") {
    startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000); // last 7 days
  } else if (range_str === "month") {
    startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000); // last 30 days
  } else if (range_str === "all") {
    // For "all", we won’t use this equal-division time range in our aggregation.
    // (We will instead use calendar boundaries in the aggregation branch below.)
    startTime = new Date(endTime.getTime() - 365 * 24 * 60 * 60 * 1000); // fallback
  } else {
    throw new Error("Invalid time range");
  }
  return [startTime, endTime];
}

/**
 * Aggregate the sessions into buckets based on the selected time interval.
 *
 * - For "hour" or "day": buckets are 2-hour intervals.
 * - For "week": buckets are 1-day intervals.
 * - For "month": buckets are divided into 4 equal segments.
 * - For "all": use calendar month boundaries.
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
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    // Subtract 11 months instead of 12 so that the current month is included.
    const calendarStartTime = new Date(
      currentMonthStart.getFullYear(),
      currentMonthStart.getMonth() - 11,
      1
    );
    const bucketCount = 12; // This will cover 12 months: from (currentMonth - 11) to currentMonth.
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
    // Aggregate sessions into the appropriate month bucket.
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
    // For other intervals, use the simple equal-division approach.
    const [startTime, endTime] = getTimeRange(selectedTimeInterval);
    let bucketDuration: number = 0; // in milliseconds
    let bucketCount: number = 0;

    if (selectedTimeInterval === "hour" || selectedTimeInterval === "day") {
      // 2-hour buckets
      bucketDuration = 2 * 60 * 60 * 1000;
    } else if (selectedTimeInterval === "week") {
      // 1-day buckets
      bucketDuration = 24 * 60 * 60 * 1000;
    } else if (selectedTimeInterval === "month") {
      bucketCount = 4;
      bucketDuration = (endTime.getTime() - startTime.getTime()) / bucketCount;
    } else {
      throw new Error("Invalid selectedTimeInterval");
    }
    // For "hour", "day", or "week", determine bucketCount from the total duration.
    if (
      selectedTimeInterval === "hour" ||
      selectedTimeInterval === "day" ||
      selectedTimeInterval === "week"
    ) {
      bucketCount = Math.ceil(
        (endTime.getTime() - startTime.getTime()) / bucketDuration
      );
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
}: StatCardProps) {
  // Get the array of sessions (if available)
  let sessionStats: ProjectStatsSession[] = [];
  if (graphFeedbackInfo) {
    sessionStats = graphFeedbackInfo.sessions;
  }

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
  }, [graphFeedbackInfo, selectedTimeInterval, sessionStats]);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "400px",
        width: "65%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          padding: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
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
                width: "600px",
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
              width={600}
              height={350}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
