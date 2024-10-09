import React from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { TreeNode } from "../../../utility/types";
import { TypeIcon } from "./Type-Icon";
import styles from "./CustomNode.module.css";

type Props = {
  node: NodeModel<TreeNode>;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onToggle: (id: NodeModel["id"]) => void;
  onSelect: (node: NodeModel) => void;
};

export const Node: React.FC<Props> = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleSelect = () => props.onSelect(props.node);

  return (
    <div
      className={`tree-node ${styles.root} ${
        props.isSelected ? styles.isSelected : ""
      }`}
      style={{ paddingInlineStart: indent }}
      onClick={handleSelect}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ""
        }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRightIcon />
          </div>
        )}
      </div>
      <div>
        {/* @ts-expect-error: Suppress TypeScript error for item.data access */}
        <TypeIcon droppable={droppable ? droppable : false} type={data?.type} />
      </div>
      <div className={styles.labelGridItem}>
        <Typography variant="body2">{props.node.text}</Typography>
      </div>
    </div>
  );
};
