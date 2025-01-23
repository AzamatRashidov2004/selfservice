import { DataGrid } from "@mui/x-data-grid";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { BarChart } from "@mui/x-charts/BarChart";
import { Session } from "../../../utility/types";
import { sessionData } from "./mockData";

// Define a helper function to get days in a month
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

// converts ugly timestamp to pretty format
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  const month = date.toLocaleString("default", { month: "short" }); // Short month name, e.g., "Jan"
  const day = date.getDate(); // Day of the month
  const year = date.getFullYear(); // Year

  const hours = date.getHours().toString().padStart(2, "0"); // 24-hour format
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero to minutes

  return `${month} ${day},${year},${hours}:${minutes}`;
}

// converts Sessions type to DataGrid Compatible Type
function createRows(sessions: Session[]) {
  return sessions.map((session, index) => {
    return {
      id: index + 1,
      session_id: session.session_id,
      queries: session.query_count,
      feedback: session.feedback_count,
      timestamp: formatTimestamp(session.start_timestamp),
      conversions: [session.positive_feedback, session.negative_feedback],
    };
  });
}

// Define the function to render sparklines
// @ts-expect-error any is okay
function renderSparklineCell(params) {
  const uData = [params.row.conversions[0]];
  const pData = [params.row.conversions[1]];

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <BarChart
        width={300}
        height={120}
        colors={["hsl(115, 90.40%, 51.00%)", "hsl(0, 86.00%, 58.00%)"]}
        series={[
          { data: pData, stack: "total", type: "bar" },
          { data: uData, stack: "total", type: "bar" },
        ]}
        layout="horizontal"
        sx={{
          "& .MuiChartsAxis-root": {
            visibility: "hidden !important",
          },
        }}
      />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: "session_id", headerName: "Session ID", flex: 1.5, minWidth: 200 },
  {
    field: "queries",
    headerName: "Queries",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "feedback",
    headerName: "Feedback",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "timestamp",
    headerName: "Timestamp",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "conversions",
    headerName: "Daily Conversions",
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

// creates rows for the DataGrid
export const rows: GridRowsProp = createRows(sessionData);

export default function CustomDataGrid() {
  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[20]}
      disableColumnResize
      density="compact"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
