import { DataGrid } from "@mui/x-data-grid";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { BarChart } from "@mui/x-charts/BarChart";
import { ProjectSessionResponse } from "../../../api/maestro/getMaestro";
import { useState } from "react";
import SessionsDataGrid from "./SessionDataGrid";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isSameYear = date.getFullYear() === now.getFullYear();
  const isSameDay = date.toDateString() === now.toDateString();

  // Check if it is yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const day = date.getDate().toString().padStart(2, "0"); // Day of the month with leading zero
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()]; // Short month name
  const year = date.getFullYear(); // Year

  const hours = date.getHours().toString().padStart(2, "0"); // 24-hour format with leading zero
  const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero to minutes

  // Handle "Today" and "Yesterday"
  if (isSameDay) {
    return `Today • ${hours}:${minutes}`;
  } else if (isYesterday) {
    return `Yesterday • ${hours}:${minutes}`;
  }

  // Format without year if it's the same year
  if (isSameYear) {
    return `${day} ${month} • ${hours}:${minutes}`;
  }

  // Default format with year
  return `${day} ${month} ${year} • ${hours}:${minutes}`;
}

// converts Sessions type to DataGrid Compatible Type
function createRows(sessionData: ProjectSessionResponse) {
  return sessionData.sessions.map((session, index) => {
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
    headerName: "Feedback Ratio",
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

type DataGridParams = {
  sessionData: ProjectSessionResponse;
};

const ProjectDataGrid: React.FC<DataGridParams> = ({ sessionData }) => {
  const rows: GridRowsProp = createRows(sessionData);

  const [selectedSession, setSelectedSession] = useState<null | string>(null);

  return (
    <>
      {!selectedSession ? (
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
          onCellClick={(params) => {
            if (params.field === "session_id") {
              console.log("Clicked Session ID:", params.value);
              setSelectedSession(params.value as string);
            }
          }}
        />
      ) : (
        <SessionsDataGrid
          session_id={selectedSession}
          close={() => {
            setSelectedSession(null);
          }}
        />
      )}
    </>
  );
};

export default ProjectDataGrid;
