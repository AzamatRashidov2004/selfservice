import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DropDownButton } from "./DropDownButton";
import { ProjectStatsResponse } from "../../../api/maestro/getMaestro";

export type StatCardProps = {
  projectStats: null | ProjectStatsResponse;
};

//todo there was a data it props
export default function StatTotalCard({ projectStats }: StatCardProps) {
  return (
    <>
      <DropDownButton />
      <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
        <CardContent>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
          >
            <Stack
              direction="column"
              sx={{ justifyContent: "space-evenly", alignItems: "right" }}
            >
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Total queries:{" "}
                {projectStats ? projectStats.stats.total_queries : ""}
              </Typography>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Total sessions:{" "}
                {projectStats ? projectStats.stats.total_sessions : ""}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
