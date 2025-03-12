import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  ProjectSessionErrorsResponse,
  ProjectSessionResponse,
} from "../../../api/maestro/getMaestro";
import { useState, useRef, useEffect } from "react";
import { formatTimestamp } from "../../../utility/Date_Util";
import SessionsDataGrid from "./SessionDataGrid";
import IconButton from "@mui/material/IconButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// Convert session data into grid rows
function createRows(
  sessionData: ProjectSessionResponse,
  sessionDataErrors: ProjectSessionErrorsResponse | null = null
) {
  return sessionData.sessions.map((session, index) => {
    let matchingError = null;
    if (sessionDataErrors) {
      matchingError = sessionDataErrors.data.find(
        (error) => error.session_id === session.session_id
      );
    }
    return {
      id: index + 1,
      session_id: session.session_id,
      queries: session.query_count,
      feedback: session.feedback_count,
      negative: session.negative_feedback,
      positive: session.positive_feedback,
      timestamp: formatTimestamp(session.start_timestamp),
      conversions: [session.negative_feedback, session.positive_feedback],
      errors: matchingError ? matchingError.occurrences : 0, // Assign occurrences if found
    };
  });
}

// Render the sparkline (feedback ratio) cell
// @ts-expect-error any is okay here
function renderSparklineCell(params) {
  const uData = params.row.conversions[0];
  const pData = params.row.conversions[1];
  const total = uData + pData;
  const percentage = total > 0 ? `${((pData / total) * 100).toFixed(1)}%` : "";

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <BarChart
        width={300}
        height={120}
        colors={["hsl(115, 90.40%, 51.00%)", "hsl(0, 86.00%, 58.00%)"]}
        series={[
          { data: [pData], stack: "total", type: "bar" },
          { data: [uData], stack: "total", type: "bar" },
        ]}
        layout="horizontal"
        sx={{
          "& .MuiChartsAxis-root": {
            visibility: "hidden !important",
          },
        }}
      />
      <span>{percentage}</span>
    </div>
  );
}

const ProjectDataGrid: React.FC<{
  sessionData: ProjectSessionResponse;
  sessionDataErrors?: ProjectSessionErrorsResponse | null;
}> = ({ sessionData, sessionDataErrors }) => {
  console.log("AAX", sessionDataErrors);
  const rows: GridRowsProp = createRows(sessionData, sessionDataErrors);
  // Store the ID of the expanded row (if any)
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  // Store the top offset (in pixels) where the detail panel should appear
  const [detailPanelTop, setDetailPanelTop] = useState(0);
  // Reference to the grid container
  const gridRef = useRef<HTMLDivElement>(null);

  // Define columns; note we add a first column for the expand/collapse arrow.
  const columns: GridColDef[] = [
    {
      field: "expand",
      headerName: "",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isExpanded = expandedRowId === params.row.id;
        return (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedRowId(isExpanded ? null : params.row.id);
            }}
          >
            {isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          </IconButton>
        );
      },
    },
    {
      field: "timestamp",
      headerName: "Timestamp",
      headerAlign: "left",
      align: "right",
      flex: 1,
      minWidth: 150,
    },
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
      headerName: "Total Feedback",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "negative",
      headerName: "Negative feedback",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      type: "number",
    },
    {
      //field: "positive",
      field: "errors",
      headerName: "Errors",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 50,
      type: "number",
      renderCell: (params) => (
        <span
          style={{
            color: params.value !== 0 ? "red" : "inherit",
            fontWeight: params.value !== 0 ? "bold" : "normal",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "conversions",
      headerName: "Feedback Ratio",
      headerAlign: "right",
      flex: 1,
      minWidth: 150,
      renderCell: renderSparklineCell,
    },
  ];

  // When a row is expanded, compute its vertical position so the detail panel can be placed below it.
  useEffect(() => {
    if (expandedRowId && gridRef.current) {
      const rowElement = gridRef.current.querySelector(
        `[data-id="${expandedRowId}"]`
      ) as HTMLElement;
      if (rowElement) {
        const gridTop = gridRef.current.getBoundingClientRect().top;
        const rowTop = rowElement.getBoundingClientRect().top;
        const rowHeight = rowElement.offsetHeight;
        // Position detail panel just below the row
        setDetailPanelTop(rowTop - gridTop + rowHeight);
      }
    }
  }, [expandedRowId]);

  return (
    <div style={{ position: "relative", width: "100%" }} ref={gridRef}>
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
      {/* Render the detail panel if a row is expanded */}
      {expandedRowId && (
        <div
          style={{
            position: "absolute",
            top: detailPanelTop,
            left: 0,
            right: 0,
            background: "#fff",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <SessionsDataGrid
            session_id={
              rows.find((r) => r.id === expandedRowId)?.session_id || ""
            }
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDataGrid;
