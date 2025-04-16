import React from "react";
import { TypeIcon } from "./Type-Icon";

export const CustomDragPreview = (props) => {
  const item = props.monitorProps.item;

  return (
    <div className="drag-root">
      <div className="icon">
        <TypeIcon droppable={item.droppable} fileType={item?.data?.fileType} />
      </div>
      <div className="label">{item.text}</div>
    </div>
  );
};
