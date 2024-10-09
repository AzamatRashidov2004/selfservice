import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./Type-Icon";

export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;

  const handleToggle = (e) => {
    e.stopPropagation();
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
      style={{ paddingInlineStart: indent, cursor: "pointer" }}
      className="node-root"
      onClick={handleToggle} // Added onClick to the whole row
    >
      <div
        className={`expandIconWrapper ${props.isOpen ? "isOpen" : ""}`}
        onClick={handleToggle} // This will toggle when the arrow is clicked
      >
        {props.node.droppable && (
          <ArrowRightIcon />
        )}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <div className="labelGridItem">
        <Typography variant="body2">{props.node.text}</Typography>
      </div>
    </div>
  );
};
