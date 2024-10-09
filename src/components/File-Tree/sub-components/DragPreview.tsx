import React from "react";
import { TypeIcon } from "./Type-Icon";
import styles from "./CustomDragPreview.module.css";

interface CustomDragPreviewProps {
  monitorProps: {
    item: {
      droppable: boolean;
      data: {
        fileType: string; // Optional if fileType may not always be present
      };
      text: string; // Assuming text is always present
    };
  };
}

const DragPreview: React.FC<CustomDragPreviewProps> = (props) => {
  const item = props.monitorProps.item;

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <TypeIcon droppable={item.droppable} fileType={item.data.fileType} />
      </div>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
};

export default DragPreview