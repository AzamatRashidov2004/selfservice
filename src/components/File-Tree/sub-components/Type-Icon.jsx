import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";  // PDF icon
import TableChartIcon from "@mui/icons-material/TableChart"; // For CSV and XLSX
import CodeIcon from "@mui/icons-material/Code"; // HTML and JSON
import AssignmentIcon from "@mui/icons-material/Assignment"; // For "Project"
import MemoryIcon from "@mui/icons-material/Memory"; // For "Program"

export const TypeIcon = (props) => {

  switch (props.fileType) {
    case "image":
      return <ImageIcon />;
    case "csv":
      return <TableChartIcon />; // Using a table icon for better representation of CSV
    case "xlsx":
      return <TableChartIcon />; // Reusing the same table icon for XLSX
    case "pdf":
      return <PictureAsPdfIcon />;
    case "html":
    case "json":
      return <CodeIcon />; // Reusing code icon for both HTML and JSON
    case "project":
      return <AssignmentIcon />; // Using an assignment icon to remind of a "Project"
    case "program":
      return <MemoryIcon />; // Using a memory chip icon to represent a "Program"
    case "text":
      return <DescriptionIcon />;
    case "folder":
      return <FolderIcon />
    default:
      return null;
  }
};
