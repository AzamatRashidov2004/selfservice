import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { BarChart } from "@mui/x-charts/BarChart";
import React, { useEffect, useState } from "react";
import { ProjectStatsResponse } from "../../../api/maestro/getMaestro";
import Loader from "../../Loader/Loader";
import { TimeControlButtons } from "./TimeControlButtons";

/**
 * Types
 */
export type StatCardProps = {
  graphFeedbackInfo: ProjectStatsResponse | null;
  selectedTimeInterval: string;
  loading: boolean;
  setSelectedTimeInterval: React.Dispatch<React.SetStateAction<string>>;
};

interface Stat {
  total_queries: number;
  total_positive_feedback: number | undefined;
  total_negative_feedback: number | undefined;
  total_sessions: number;
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
 * Generate week labels in ascending order.
 * The first label corresponds to 6 days ago and the last label is today.
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
 * Generate month labels in ascending order over a 30‑day period,
 * split into 4 segments. The label format is improved for readability.
 *
 * Example: "28 Jan - 3 Feb"
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
 * Generate year labels (for the "all" interval) over the past 12 months.
 * We start 11 months ago so that the labels appear in ascending order.
 *
 * For example, if today is February, this returns:
 * ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
 */
function getYearLabels(): string[] {
  const labels: string[] = [];
  const currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 11,
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
 * Choose labels based on the selected time interval.
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
 * Create data arrays using raw feedback counts.
 * This ensures that the bar height reflects the total number of feedback.
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
    const neg = item.total_negative_feedback || 0;
    const pos = item.total_positive_feedback || 0;
    negativeArr.push(neg);
    positiveArr.push(pos);
  }
  return { negative: negativeArr, positive: positiveArr };
}

export default function StatCard({
  graphFeedbackInfo,
  selectedTimeInterval,
  loading,
  setSelectedTimeInterval,
}: StatCardProps) {
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

    if (graphFeedbackInfo && Array.isArray(graphFeedbackInfo.stats)) {
      // Cast stats to our defined Stat[] type.
      let statsData = graphFeedbackInfo.stats as Stat[];
      // For the "all" interval, if 13 data points are returned, ignore the first.
      if (selectedTimeInterval === "all" && statsData.length === 13) {
        statsData = statsData.slice(1);
      }
      // Compute the maximum total feedback across all segments.
      const totals = statsData.map(
        (stat) =>
          (stat.total_negative_feedback || 0) +
          (stat.total_positive_feedback || 0)
      );
      const computedMax = Math.max(...totals, 1);
      setYAxisMax(computedMax);

      const newDataSets = createDataSets(statsData, labelSet.length);
      setDataSets(newDataSets);
    } else {
      setDataSets({ negative: [], positive: [] });
      setYAxisMax(100);
    }
  }, [graphFeedbackInfo, selectedTimeInterval]);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "400px", // Increased overall height to better accommodate both sections
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
        {/* Graph Container: Pushed to bottom */}
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
                  valueFormatter: (_v, { dataIndex }) => {
                    if (
                      !graphFeedbackInfo ||
                      !Array.isArray(graphFeedbackInfo.stats)
                    )
                      return "";
                    const offset =
                      selectedTimeInterval === "all" &&
                      graphFeedbackInfo.stats.length === 13
                        ? 1
                        : 0;
                    const stat = graphFeedbackInfo.stats[dataIndex + offset] as
                      | Stat
                      | undefined;
                    return stat && stat.total_negative_feedback !== undefined
                      ? String(stat.total_negative_feedback)
                      : "0";
                  },
                },
                {
                  data: dataSets.positive,
                  color: "#74ef4b",
                  stack: "total",
                  valueFormatter: (_v, { dataIndex }) => {
                    if (
                      !graphFeedbackInfo ||
                      !Array.isArray(graphFeedbackInfo.stats)
                    )
                      return "";
                    const offset =
                      selectedTimeInterval === "all" &&
                      graphFeedbackInfo.stats.length === 13
                        ? 1
                        : 0;
                    const stat = graphFeedbackInfo.stats[dataIndex + offset] as
                      | Stat
                      | undefined;
                    return stat && stat.total_positive_feedback !== undefined
                      ? String(stat.total_positive_feedback)
                      : "0";
                  },
                },
              ]}
              // Remove fixed sizes so the chart scales to the container.
              width={600}
              height={350}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
