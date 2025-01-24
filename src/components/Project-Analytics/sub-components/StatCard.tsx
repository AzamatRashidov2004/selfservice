import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

export type StatCardProps = {
  title: string;
  value: string;
  interval: string;
  trend: "up" | "down" | "neutral";
  data: number[];
};

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  console.log("color", color);
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

//todo there was a data it props
export default function StatCard({
  title,
  value,
  interval,
  trend,
}: StatCardProps) {
  const theme = useTheme();
  const daysInWeek = getDaysInMonth(4, 2024);

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
                Feedback count: 0
              </Typography>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Positive: 1
              </Typography>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Negative: 0
              </Typography>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Percentage: 30%
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {interval}
            </Typography>
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
              {...size}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
