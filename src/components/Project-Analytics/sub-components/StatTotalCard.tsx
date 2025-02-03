import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { ProjectStatsResponse } from "../../../api/maestro/getMaestro";
import Loader from "../../Loader/Loader";

/**
 * Types
 */
export type StatCardProps = {
  graphFeedbackInfo: ProjectStatsResponse | null;
  selectedTimeInterval: string;
  loading: boolean;
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
 * Label arrays for each time interval
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

const hourLabels = dayLabels; // For simplicity, treat 'hour' the same as 'day'

// For week interval, show actual day names.
const weekLabels = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// For month interval, show date ranges instead of generic "Week 1" labels.
const monthLabels = [
  "23.01 - 30.01",
  "31.01 - 07.02",
  "08.02 - 14.02",
  "15.02 - 21.02",
];

const allLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getXLabels(interval: string): string[] {
  switch (interval) {
    case "hour":
      return hourLabels;
    case "day":
      return dayLabels;
    case "week":
      return weekLabels;
    case "month":
      return monthLabels;
    case "all":
      return allLabels;
    default:
      return [];
  }
}

/**
 * Create data arrays matching the length of the labels.
 * The values are percentages computed from the raw data.
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

    if (
      item.total_negative_feedback === undefined ||
      item.total_positive_feedback === undefined
    ) {
      negativeArr.push(0);
      positiveArr.push(0);
      continue;
    }

    const total = item.total_negative_feedback + item.total_positive_feedback;
    if (total === 0) {
      negativeArr.push(0);
      positiveArr.push(0);
    } else {
      negativeArr.push((item.total_negative_feedback / total) * 100);
      positiveArr.push((item.total_positive_feedback / total) * 100);
    }
  }

  return { negative: negativeArr, positive: positiveArr };
}

export default function StatCard({
  graphFeedbackInfo,
  selectedTimeInterval,
  loading,
}: StatCardProps) {
  const [xLabels, setXLabels] = useState<string[]>([]);
  const [dataSets, setDataSets] = useState<FeedbackDataSets>({
    negative: [],
    positive: [],
  });

  useEffect(() => {
    const labelSet = getXLabels(selectedTimeInterval);
    setXLabels(labelSet);

    if (graphFeedbackInfo && Array.isArray(graphFeedbackInfo.stats)) {
      // Create percentage arrays matching the number of labels
      const newDataSets = createDataSets(
        graphFeedbackInfo.stats,
        labelSet.length
      );
      setDataSets(newDataSets);
    } else {
      // No data: empty arrays
      setDataSets({ negative: [], positive: [] });
    }
  }, [graphFeedbackInfo, selectedTimeInterval]);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "290px",
        minWidth: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Loader />
              </div>
            ) : (
              <BarChart
                // X-axis configuration for your labels with tick settings to force all labels
                xAxis={[
                  {
                    scaleType: "band",
                    data: xLabels,
                    tick: {
                      autoSkip: false,
                    },
                  },
                ]}
                // Y-axis from 0 to 100 for the percentage range
                yAxis={[
                  {
                    min: 0,
                    max: 100,
                  },
                ]}
                // Two series with valueFormatter to show raw counts
                series={[
                  {
                    label: "Negative feedback",
                    data: dataSets.negative,
                    color: "#F44336",
                    stack: "total",
                    valueFormatter: (v, { dataIndex }) => {
                      if (
                        !graphFeedbackInfo ||
                        !Array.isArray(graphFeedbackInfo.stats)
                      ) {
                        return "";
                      }
                      const stat = graphFeedbackInfo.stats[dataIndex];
                      return `${
                        stat && stat.total_negative_feedback !== undefined
                          ? stat.total_negative_feedback
                          : 0
                      }`;
                    },
                  },
                  {
                    label: "Positive feedback",
                    data: dataSets.positive,
                    color: "#74ef4b",
                    stack: "total",
                    valueFormatter: (v, { dataIndex }) => {
                      if (
                        !graphFeedbackInfo ||
                        !Array.isArray(graphFeedbackInfo.stats)
                      ) {
                        return "";
                      }
                      const stat = graphFeedbackInfo.stats[dataIndex];
                      return `${
                        stat && stat.total_positive_feedback !== undefined
                          ? stat.total_positive_feedback
                          : 0
                      }`;
                    },
                  },
                ]}
                // Increase width if necessary so labels have enough room
                width={600}
                height={300}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
