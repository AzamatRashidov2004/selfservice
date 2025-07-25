import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { ProjectStatsResponse } from "../../../api/maestro/getMaestro";

export type StatCardProps = {
  projectStats: null | ProjectStatsResponse;
};

export default function StatCard({ projectStats }: StatCardProps) {
  const size = {
    width: 300,
    height: 300,
  };

  if (!projectStats) return null;

  const values = [
    {
      label: "positive",
      value: parseFloat(
        (
          (projectStats?.stats.total_positive_feedback /
            (projectStats?.stats.total_positive_feedback +
              projectStats?.stats.total_negative_feedback)) *
          100
        ).toFixed(1)
      ),
    },
    {
      label: "negative",
      value: parseFloat(
        (
          (projectStats?.stats.total_negative_feedback /
            (projectStats?.stats.total_positive_feedback +
              projectStats?.stats.total_negative_feedback)) *
          100
        ).toFixed(1)
      ),
    },
  ];

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: 300,
          width: "40%",
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
              height: "100%",
            }}
          >
            <Stack sx={{ justifyContent: "space-between" }}>
              <Stack
                direction="column"
                sx={{ justifyContent: "space-between", alignItems: "left" }}
              >
                <Typography
                  component="h2"
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Total Feedback:{" "}
                  {projectStats.stats.total_negative_feedback +
                    projectStats.stats.total_positive_feedback}
                </Typography>
                <Typography
                  component="h2"
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Total Queries: {projectStats.stats.total_queries}
                </Typography>
                <Typography
                  component="h2"
                  variant="subtitle2"
                  gutterBottom
                  sx={{
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Total Sessions: {projectStats.stats.total_sessions}
                </Typography>
              </Stack>
            </Stack>
            <Box
              sx={{
                width: "60%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "20px",
              }}
            >
              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.value}%`,
                    arcLabelMinAngle: 35,
                    arcLabelRadius: "60%",
                    data: values,
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: "bold",
                    fontSize: "20px",
                  },
                  "& .MuiChartsLegend-root": {
                    visibility: "hidden !important",
                  },
                }}
                colors={["hsl(115, 90.40%, 51.00%)", "hsl(0, 86.00%, 58.00%)"]}
                {...size}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
