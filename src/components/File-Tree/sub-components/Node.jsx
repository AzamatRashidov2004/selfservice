import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./Type-Icon";
import { useFiles } from "../../../context/fileContext";

export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;
  const { setCurrentFolder } = useFiles();

  const setPdfVisible = props.setPdfVisible;
  const setPdfUrl = props.setPdfUrl;

  const handleToggle = (e, target) => {
    e.stopPropagation();

    if (target === "row") {
      if (props.node.droppable) {
        setCurrentFolder(props.node.id.toString());
      } else {
        setCurrentFolder(props.node.parent.toString());
      }
      props.setHighlightedNodeId(props.node.id); // Update the highlighted node in the parent component
    }

    props.onToggle(props.node.id);
  };

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.parent]);

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.hasChild]);

  const handleDoubleClick = () => {
    const file = data; // Ensure data is a File object or adjust if needed.
    console.log("file is: ", data);

    if (file && file.fileType === "pdf") {
      setPdfVisible(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPdfUrl(event.target.result); // Set the data URL for the PDF
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  return (
    <div
      style={{
        paddingInlineStart: indent,
        cursor: "pointer",
        backgroundColor:
          props.highlightedNodeId === props.node.id ? "#e0f7fa" : "transparent",
      }}
      className={`node-root depth-${props.depth}`}
      onClick={(e) => {
        handleToggle(e, "row");
      }}
    >
      <div
        className={`expandIconWrapper ${props.isOpen ? "isOpen" : ""}`}
        onClick={(e) => {
          handleToggle(e, "arrow");
        }}
      >
        {props.node.droppable && <ArrowRightIcon />}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <div
        className="labelGridItem"
        style={{
          textOverflow: "ellipsis !important",
          whiteSpace: "nowrap !important",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body2"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.node.text}
        </Typography>
      </div>
    </div>
  );
};
