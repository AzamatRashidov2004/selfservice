import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./Type-Icon";
import { useFiles } from "../../../context/fileContext";

export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;
  const { setCurrentFolder } = useFiles();

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
      <div className="labelGridItem">
        <Typography variant="body2" noWrap>
          {props.node.text}
        </Typography>
      </div>
    </div>
  );
};
