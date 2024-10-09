import React from "react";
import { DragLayerMonitorProps } from "@minoru/react-dnd-treeview";
import { TreeNode } from "../../../utility/types";
import { TypeIcon } from "./Type-Icon";
import styles from "./CustomDragPreview.module.css";

type Props = {
  monitorProps: DragLayerMonitorProps<TreeNode>;
};

export const CustomDragPreview: React.FC<Props> = (props) => {
  const item = props.monitorProps.item;

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        {/* @ts-expect-error: Suppress TypeScript error for item.data access */}
        <TypeIcon droppable={item.droppable} type={item.data ? item.data.fileType : "text"} />
      </div>
      <div className={styles.label}>{item.text}</div>
    </div>
  );
};