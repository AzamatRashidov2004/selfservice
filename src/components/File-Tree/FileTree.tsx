import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import Node from "./sub-components/Node";
import DragPreview from "./sub-components/DragPreview";
import { theme } from "./sub-components/Theme";
import styles from "./App.module.css";
import SampleData from "./sub-components/sampleData.json";
import { TreeNode } from "../../utility/types"; // Adjust the import based on your structure

const FileTree: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>(SampleData);
  const handleDrop = (newTree: TreeNode[]) => setTreeData(newTree);
//   const [draggingNode, setDraggingNode] = useState<TreeNode | undefined>(undefined);
  const [nodeList, setNodeList] = useState<TreeNode[]>(treeData); // Initialize nodeList with treeData

  const updateNode = (node: TreeNode, depth: number, hasChild: boolean) => {
    const existingNode = nodeList.find((value) => value.id === node.id);
    
    if (existingNode) {
      // Update existing node properties
      existingNode.depth = depth;
      existingNode.hasChild = hasChild;
      existingNode.parent = node.parent; 
      setNodeList([...nodeList]); // Trigger re-render
    } else {
      // Add new node to the list
      node.depth = depth;
      node.hasChild = hasChild;
      setNodeList([...nodeList, node]); // Add new node and trigger re-render
    }
  };

  const checkChildIsFolder = (parentID: string) => {
    return nodeList.some((value) => value.parent === parentID && value.data.fileType !== "text");
  };

  const getDropTarget = (dropTargetId: string) => {
    return nodeList.find((value) => value.id === dropTargetId);
  };

  const getDragTarget = (dragTargetId: string) => {
    return nodeList.find((value) => value.id === dragTargetId);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.app}>
          <Tree
            tree={treeData}
            rootId={0}
            initialOpen={true}
            render={(node, { depth, isOpen, onToggle, hasChild }) => (
              <Node
                node={{...node, id: node.id.toString(), parent: node.parent.toString(), data: {fileType: "text", ...node.data}}}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
                hasChild={hasChild}
                updateNode={(value) => {
                  updateNode(value, depth, hasChild);
                }}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <DragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            canDrop={(
              treeData,
              { dragSource, dropTarget, dropTargetId, dragSourceId }
            ) => {
              if (dragSource !== dropTarget) {
                const dropT = getDropTarget(dropTargetId);
                const dragT = getDragTarget(dragSourceId);

                if (dropT) {
                  if (dropT.data.fileType !== "text") {
                    if (dropT.depth >= 1) {
                      return dragSource.data.fileType === "text"; // Allow drop if dragging a text file
                    } else {
                      if (dragT.hasChild) {
                        return !checkChildIsFolder(dragSourceId); // Check if child exists before dropping
                      } else {
                        return true; // Can drop if no children
                      }
                    }
                  }
                }
              }
              return false; // Default to false if no conditions are met
            }}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              dropTarget: styles.dropTarget,
            }}
          />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
};

export default FileTree;
