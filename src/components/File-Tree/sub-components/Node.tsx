import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./Type-Icon";
import styles from "./CustomNode.module.css";
import { TreeNode } from "../../../utility/types"; // Adjust the import based on your structure

interface NodeProps {
  node: TreeNode;
  depth: number;
  isOpen: boolean;
  onToggle: (id: string) => void; // Function to toggle node open/close
  updateNode: (node: TreeNode) => void; // Function to update node info
  hasChild: boolean; // Whether the node has children
  parent?: number, 
}

const Node: React.FC<NodeProps> = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.node, props.parent, props]); // Make sure to add props.node and props.parent to the dependency array

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.hasChild, props]);

  return (
    <div className={`tree-node ${styles.root}`} style={{ paddingInlineStart: indent }}>
      <div className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""}`}>
        {droppable && (
          <div onClick={handleToggle}>
            <ArrowRightIcon />
          </div>
        )}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data ?  data.fileType : "undefined"} />
      </div>
      <div className={styles.labelGridItem}>
        <Typography variant="body2">{data?.title || "Unnamed Node"}</Typography>
      </div>
    </div>
  );
};

export default Node
