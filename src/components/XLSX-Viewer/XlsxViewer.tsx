import React, { useEffect, useState, useMemo, useCallback } from "react";
import ExcelJS from "exceljs";

interface XlsxOverlayViewerProps {
  isOpen: boolean;
  onClose: () => void;
  /** Either a File or an ArrayBuffer containing XLSX data */
  file?: File | ArrayBuffer | null;
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const containerStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  maxWidth: "90vw",
  maxHeight: "90vh",
  position: "relative",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  padding: "20px",
  position: "relative",
  flexShrink: 0,
};

const closeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "transparent",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};

const tabContainerStyle: React.CSSProperties = {
  display: "flex",
  marginBottom: "10px",
  borderBottom: "1px solid #ccc",
};

const tabStyle: React.CSSProperties = {
  padding: "10px",
  cursor: "pointer",
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
  borderBottom: "2px solid #000",
};

const contentWrapperStyle: React.CSSProperties = {
  flex: 1,
  overflowX: "auto",
  overflowY: "auto",
};

const tableStyle: React.CSSProperties = {
  borderCollapse: "collapse",
  whiteSpace: "nowrap",
};

const thTdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};

// Define a type for a single cell value.
type CellValue = string | number | boolean | Date | null | undefined;

// Rows are arrays of cell values
type SheetRow = CellValue[];

// The data is an array of arrays (SheetRow)
type SheetData = SheetRow[];

const XlsxOverlayViewer: React.FC<XlsxOverlayViewerProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [workbook, setWorkbook] = useState<ExcelJS.Workbook | null>(null);

  useEffect(() => {
    const loadFile = async () => {
      if (!file) {
        setWorkbook(null);
        setSheetNames([]);
        return;
      }

      try {
        let data: ArrayBuffer;
        if (file instanceof File) {
          data = await file.arrayBuffer();
        } else if (file instanceof ArrayBuffer) {
          data = file;
        } else {
          setWorkbook(null);
          setSheetNames([]);
          return;
        }

        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(data);

        setWorkbook(wb);
        setSheetNames(wb.worksheets.map((ws) => ws.name));
        setSelectedSheetIndex(0);
      } catch (error) {
        console.error("Error reading file:", error);
        setWorkbook(null);
        setSheetNames([]);
      }
    };

    loadFile();
  }, [file]);

  const currentSheetData = useMemo<SheetData | null>(() => {
    if (!workbook || sheetNames.length === 0) return null;
    const sheetName = sheetNames[selectedSheetIndex];
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) return null;

    const sheetData: SheetData = [];
    sheet.eachRow({ includeEmpty: true }, (row) => {
      // row.values is a sparse array starting at index 1
      const rowValues = row.values as (CellValue | undefined)[];
      // Remove the first empty index (index 0 is unused)
      const processedRow = rowValues.slice(1);
      sheetData.push(processedRow);
    });

    return sheetData;
  }, [workbook, sheetNames, selectedSheetIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking inside the container
    e.stopPropagation();
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={containerStyle} onClick={handleContainerClick}>
        <div style={headerStyle}>
          <button style={closeButtonStyle} onClick={onClose}>
            ✕
          </button>
          {workbook && sheetNames.length > 1 && (
            <div style={tabContainerStyle}>
              {sheetNames.map((name, index) => (
                <div
                  key={name}
                  style={
                    index === selectedSheetIndex ? activeTabStyle : tabStyle
                  }
                  onClick={() => setSelectedSheetIndex(index)}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
          {!workbook && <p>No valid workbook loaded.</p>}
        </div>
        {workbook && currentSheetData && (
          <div style={contentWrapperStyle}>
            <table style={tableStyle}>
              <tbody>
                {currentSheetData.map((row, rIndex) => (
                  <tr key={rIndex}>
                    {row.map((cell, cIndex) => (
                      <td style={thTdStyle} key={cIndex}>
                        {cell !== null && cell !== undefined
                          ? cell.toString()
                          : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default XlsxOverlayViewer;
