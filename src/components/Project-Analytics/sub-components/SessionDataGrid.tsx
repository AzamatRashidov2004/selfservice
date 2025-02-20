import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import {
  fetchSessionEvents,
  fetchSessionEventsErrors,
  SessionEventsResponse,
  SessionEventsResponseErrors,
} from "../../../api/maestro/getMaestro";
import { useEffect, useState, useRef } from "react";
import { convertTimestamp, formatTimestamp } from "../../../utility/Date_Util";
import ReactMarkdown from "react-markdown";
import IconButton from "@mui/material/IconButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// ----- Define a Combined Row Type -----
type CombinedRow = {
  id: number;
  isError: boolean; // distinguishes error rows
  timestamp: string; // formatted timestamp
  query: string; // for session rows: the query; for error rows: the error type
  answer: string | null; // session events only (empty for errors)
  feedback: string | number; // session events only (empty for errors)
  // For error rows, we include additional details:
  level?: string;
  stack?: string;
  message?: string;
};

// ----- Create Session Event Rows -----
function createSessionRows(
  sessionData: SessionEventsResponse | null
): CombinedRow[] {
  if (!sessionData) return [];
  const rows: CombinedRow[] = [];
  let currentQuery: string | null = null;
  let queryTimestamp: string | null = null;
  let currentAnswer: string | null = null;
  let currentFeedback: number | string = "-";

  sessionData.data.forEach((event) => {
    if (event.query) {
      // Finalize the previous query if any
      if (currentQuery) {
        rows.push({
          id: rows.length + 1,
          isError: false,
          query: currentQuery,
          answer: currentAnswer,
          feedback: currentFeedback,
          timestamp: queryTimestamp ? formatTimestamp(queryTimestamp) : "-",
        });
      }
      // Start a new query
      currentQuery = event.query;
      queryTimestamp = event.timestamp;
      currentAnswer = null;
      currentFeedback = "-";
    } else if (event.answer) {
      currentAnswer = event.answer;
    } else if (event.feedback !== undefined) {
      currentFeedback = event.feedback === 1 ? "✔️" : "❌";
    }
  });

  // Finalize any remaining query
  if (currentQuery) {
    rows.push({
      id: rows.length + 1,
      isError: false,
      query: currentQuery,
      answer: currentAnswer,
      feedback: currentFeedback,
      timestamp: queryTimestamp ? formatTimestamp(queryTimestamp) : "-",
    });
  }
  return rows;
}

// ----- Create Error Rows -----
function createErrorRows(
  errorData: SessionEventsResponseErrors | null
): CombinedRow[] {
  if (!errorData || !errorData.data) return [];
  return errorData.data.map((error, index) => ({
    id: 10000 + index + 1, // use high id numbers to avoid conflict
    isError: true,
    timestamp: formatTimestamp(convertTimestamp(error.timestamp)),
    query: error.type, // display error type in the "query" column
    answer: "", // empty for errors
    feedback: "", // empty for errors
    level: error.level,
    stack: error.stack,
    message: error.message,
  }));
}

// ----- Combined DataGrid Columns -----
// Only error rows should be expandable.
const columns: GridColDef[] = [
  {
    field: "expand",
    headerName: "",
    width: 60,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      if (!params.row.isError) return null; // non-error rows: no expand icon
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
    align: "left",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "query",
    headerName: "Query / Error Type",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "answer",
    headerName: "Answer",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 400,
    renderCell: (params) => {
      if (params.row.isError) return ""; // leave empty for errors
      return (
        <div style={{ padding: "3px 0", minHeight: "36px" }}>
          <ReactMarkdown>{params.value || ""}</ReactMarkdown>
        </div>
      );
    },
  },
  {
    field: "feedback",
    headerName: "Feedback",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 100,
    renderCell: (params) => (params.row.isError ? "" : params.value),
  },
];

// We'll use these variables to manage error row expansion.
// (They will be set inside the component.)
let expandedRowId: number | null = null;
let setExpandedRowId: (id: number | null) => void;

type DataGridParams = {
  session_id: string;
  close: () => void;
};

const SessionsDataGrid: React.FC<DataGridParams> = ({ session_id, close }) => {
  const [sessionData, setSessionData] = useState<SessionEventsResponse | null>(
    null
  );
  const [sessionError, setSessionError] =
    useState<SessionEventsResponseErrors | null>(null);
  const [combinedRows, setCombinedRows] = useState<CombinedRow[]>([]);

  // Error row expansion state (only errors are expandable)
  const [localExpandedRowId, _setLocalExpandedRowId] = useState<number | null>(
    null
  );
  expandedRowId = localExpandedRowId;
  setExpandedRowId = _setLocalExpandedRowId;

  // For computing the detail panel vertical position.
  const [detailPanelTop, setDetailPanelTop] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const eventsResponse = await fetchSessionEvents(session_id);
      setSessionData(eventsResponse);
      const errorsResponse = await fetchSessionEventsErrors(session_id);
      setSessionError(errorsResponse);
    }
    fetchData();
  }, [session_id]);

  useEffect(() => {
    const sessionRows = createSessionRows(sessionData);
    const errorRows = createErrorRows(sessionError);
    // Combine rows and sort by timestamp (assumes ISO-compatible format)
    const allRows = [...sessionRows, ...errorRows].sort((a, b) =>
      a.timestamp < b.timestamp ? -1 : 1
    );
    setCombinedRows(allRows);
  }, [sessionData, sessionError]);

  // Compute detail panel position for an expanded error row.
  useEffect(() => {
    if (localExpandedRowId && gridRef.current) {
      const rowElement = gridRef.current.querySelector(
        `[data-id="${localExpandedRowId}"]`
      ) as HTMLElement;
      if (rowElement) {
        const gridTop = gridRef.current.getBoundingClientRect().top;
        const rowTop = rowElement.getBoundingClientRect().top;
        const rowHeight = rowElement.offsetHeight;
        setDetailPanelTop(rowTop - gridTop + rowHeight);
      }
    }
  }, [localExpandedRowId]);

  return (
    <div style={{ position: "relative", width: "100%" }} ref={gridRef}>
      <DataGrid
        autoHeight
        rows={combinedRows}
        columns={columns}
        sx={{
          "& .MuiDataGrid-row": {
            "&.error-row": {
              backgroundColor: "#FFCDD2", // Light red for error rows
            },
          },
          "& .MuiDataGrid-columnHeader:not(:last-child)": {
            borderRight: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-cell:not(:last-child)": {
            borderRight: "1px solid rgba(224, 224, 224, 1)",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
          },
        }}
        getRowHeight={() => "auto"}
        getRowClassName={(params) => (params.row.isError ? "error-row" : "")}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[20]}
        disableColumnResize
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: { variant: "outlined", size: "small" },
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
                InputComponentProps: { variant: "outlined", size: "small" },
              },
            },
          },
        }}
      />
      {/* Inline detail panel for expanded error rows */}
      {localExpandedRowId && (
        <div
          style={{
            position: "absolute",
            top: detailPanelTop,
            left: 0,
            right: 0,
            background: "#FFCDD2",
            borderTop: "2px solid #ff0033",
            padding: "16px",
            zIndex: 10,
          }}
        >
          {(() => {
            const errorRow = combinedRows.find(
              (r) => r.id === localExpandedRowId && r.isError
            );
            if (!errorRow) return null;
            return (
              <div
                style={{
                  fontSize: "0.9rem",
                }}
              >
                <div>
                  <strong>Timestamp:</strong> {errorRow.timestamp}
                </div>
                <div>
                  <strong>Error Type:</strong> {errorRow.query}
                </div>
                <div>
                  <strong>Level:</strong> {errorRow.level}
                </div>
                <div>
                  <strong>Message:</strong> {errorRow.message}
                </div>
                <div>
                  <strong>Stack:</strong>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                    {errorRow.stack}
                  </pre>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default SessionsDataGrid;
