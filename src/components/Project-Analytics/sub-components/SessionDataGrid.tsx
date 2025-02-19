import { DataGrid } from "@mui/x-data-grid";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import {
  fetchSessionEvents,
  SessionEventsResponse,
} from "../../../api/maestro/getMaestro";
import { useEffect, useState } from "react";
import { formatTimestamp } from "../../../utility/Date_Util";
import ReactMarkdown from "react-markdown";

function createRows(sessionData: SessionEventsResponse | null) {
  if (!sessionData) return [];

  const rows: Array<{
    id: number;
    query: string | null;
    answer: string | null;
    feedback: number | string;
    timestamp: string;
  }> = [];

  let currentQuery: string | null = null;
  let queryTimestamp: string | null = null;
  let currentAnswer: string | null = null;
  let currentFeedback: number | string = "-";

  sessionData.data.forEach((event) => {
    if (event.query) {
      // If there's an active query, finalize it before starting a new one
      if (currentQuery) {
        rows.push({
          id: rows.length + 1,
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
      // Store the answer for the current query
      currentAnswer = event.answer;
    } else if (event.feedback !== undefined) {
      // Store the feedback for the current query
      currentFeedback = event.feedback === 1 ? "✔️" : "❌";
    }
  });

  // Finalize any remaining query
  if (currentQuery) {
    rows.push({
      id: rows.length + 1,
      query: currentQuery,
      answer: currentAnswer,
      feedback: currentFeedback,
      timestamp: queryTimestamp ? formatTimestamp(queryTimestamp) : "-",
    });
  }

  return rows;
}

const columns: GridColDef[] = [
  {
    field: "timestamp",
    headerName: "Timestamp",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "query",
    headerName: "Query",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "answer",
    headerName: "Answer",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 600,
    renderCell: (params) => (
      <div
        style={{
          padding: "3px 0",
          minHeight: "36px",
        }}
      >
        {/* Render the Markdown */}
        <ReactMarkdown>{params.value || ""}</ReactMarkdown>
      </div>
    ),
  },
  {
    field: "feedback",
    headerName: "Feedback",
    headerAlign: "left",
    align: "left",
    flex: 1,
    minWidth: 100,
  },
];
// SessionEventsResponse
type DataGridParams = {
  session_id: string;
  close: () => void;
};

const SessionsDataGrid: React.FC<DataGridParams> = ({ session_id, close }) => {
  const [sessionData, setSessionData] = useState<null | SessionEventsResponse>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      fetchSessionEvents(session_id).then((response) => {
        console.log(response);
        setSessionData(response);
      });
    }

    fetchData();
  }, [session_id]);

  const rows: GridRowsProp = createRows(sessionData);
  return (
    <div className="session-grid-wrapper">
      {sessionData ? (
        <DataGrid
          rows={rows}
          columns={columns}
          sx={{
            // Add vertical lines between columns
            "& .MuiDataGrid-columnHeader:not(:last-child)": {
              borderRight: "1px solid rgba(224, 224, 224, 1)",
            },
            "& .MuiDataGrid-cell:not(:last-child)": {
              borderRight: "1px solid rgba(224, 224, 224, 1)",
            },
            // Optional: Add line to the right of the last column
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
            },
          }}
          getRowHeight={() => "auto"}
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default SessionsDataGrid;
