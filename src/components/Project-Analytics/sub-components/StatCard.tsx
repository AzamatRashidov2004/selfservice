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

//todo there was a data it props
export default function StatCard({ projectStats }: StatCardProps) {
  const size = {
    width: 250,
    height: 150,
  };

  console.log("XXX", projectStats);

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

  const valueFormatter = (item: { value: number }) => `${item.value}%`;

  const data = {
    data: values,
    valueFormatter,
  };
  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="column"
              sx={{ justifyContent: "space-between", alignItems: "left" }}
            >
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Feedback count:{" "}
                {projectStats.stats.total_negative_feedback +
                  projectStats.stats.total_positive_feedback}
              </Typography>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Positive: {projectStats.stats.total_positive_feedback}
              </Typography>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Negative: {projectStats.stats.total_negative_feedback}
              </Typography>
            </Stack>
          </Stack>
          <Box sx={{ width: "50%", height: 150 }}>
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}%`,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",
                  ...data,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fontWeight: "bold",
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
  );
}
