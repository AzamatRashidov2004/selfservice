import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { ProjectStatsResponse } from "../../../api/maestro/getMaestro";
import { BarChart } from "@mui/x-charts/BarChart";

export type StatCardProps = {
  projectStats: null | ProjectStatsResponse;
};

export default function StatCard({ projectStats }: StatCardProps) {
  if (!projectStats) return null;

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: "100%",
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
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["group A", "group B", "group C"],
                  },
                ]}
                series={[
                  {
                    data: [70, 70, 70],
                    color: "#4CAF50", // Green color
                    stack: "total",
                  },
                  {
                    data: [30, 30, 30],
                    color: "#F44336", // Red color
                    stack: "total",
                  },
                ]}
                stackOffset="expand"
                width={300}
                height={250}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
