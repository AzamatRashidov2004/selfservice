import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DropDownButton } from "./DropDownButton";

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: "up" | "down" | "neutral";
  data: number[];
};

//todo there was a data it props
export default function StatTotalCard({
  title,
  value,
  interval,
  trend,
}: StatCardProps) {
  const theme = useTheme();

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down: "#D32F2F",
    neutral: "#BDBDBD",
  };

  const labelColors = {
    up: "success" as const,
    down: "error" as const,
    neutral: "default" as const,
  };

  const chartColor = trendColors[trend];
  console.log(chartColor);

  const size = {
    width: 250,
    height: 150,
  };

  const desktopOS = [
    {
      label: "Windows",
      value: 72.72,
    },
    {
      label: "OS X",
      value: 16.38,
    },
    {
      label: "Linux",
      value: 3.83,
    },
    {
      label: "Chrome OS",
      value: 2.42,
    },
    {
      label: "Other",
      value: 4.65,
    },
  ];
  const valueFormatter = (item: { value: number }) => `${item.value}%`;

  const data = {
    data: desktopOS,
    valueFormatter,
  };
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
                Total queries: 100
              </Typography>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Total sessions: 100
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
