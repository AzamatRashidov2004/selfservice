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
  selectedTimeInterval: "hour" | "day" | "week" | "month" | "all";
  loading: boolean;
};

interface Stat {
  total_queries: number;
  total_positive_feedback: number;
  total_negative_feedback: number;
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

// For this example, hour is treated the same as day.
// Adjust if your logic differs.
const hourLabels = dayLabels;

const weekLabels = [
  "Day 1",
  "Day 2",
  "Day 3",
  "Day 4",
  "Day 5",
  "Day 6",
  "Day 7",
];

const monthLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

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
    // 1. Determine the labels based on the selected interval.
    const labelSet = getXLabels(selectedTimeInterval);
    setXLabels(labelSet);

    // 2. If we have valid stats data, compute the percentage data.
    if (
      graphFeedbackInfo &&
      Array.isArray(graphFeedbackInfo.stats) &&
      graphFeedbackInfo.stats.length > 0
    ) {
      // Make sure there's a matching number of labels and data points.
      // (If your data can mismatch in length, handle that accordingly.)
      const negativeData = graphFeedbackInfo.stats.map((item: Stat) => {
        const total =
          item.total_negative_feedback + item.total_positive_feedback;
        if (total === 0) return 0;
        return (item.total_negative_feedback / total) * 100;
      });

      const positiveData = graphFeedbackInfo.stats.map((item: Stat) => {
        const total =
          item.total_negative_feedback + item.total_positive_feedback;
        if (total === 0) return 0;
        return (item.total_positive_feedback / total) * 100;
      });

      setDataSets({
        negative: negativeData,
        positive: positiveData,
      });
    } else {
      // No data or empty array: clear the chart
      setDataSets({ negative: [], positive: [] });
    }
  }, [graphFeedbackInfo, selectedTimeInterval]);

  console.log("xLabels:", xLabels);
  console.log("dataSets:", dataSets);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "290px",
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
                // X-axis configuration for your labels
                xAxis={[
                  {
                    scaleType: "band",
                    data: xLabels,
                  },
                ]}
                // Y-axis from 0 to 100 for the percentage range
                yAxis={[
                  {
                    min: 0,
                    max: 100,
                  },
                ]}
                // Provide your two series for negative and positive
                series={[
                  {
                    data: dataSets.negative,
                    color: "#F44336", // Red color for negative
                    stack: "total",
                  },
                  {
                    data: dataSets.positive,
                    color: "#4CAF50", // Green color for positive
                    stack: "total",
                  },
                ]}
                // With `stackOffset="none"`, stacked bars will sum directly
                // to show total 100 (since we did the math for percentages).
                width={500}
                height={300}
              />
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
