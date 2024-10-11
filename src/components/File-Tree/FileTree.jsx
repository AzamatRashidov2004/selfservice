import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./sub-components/Node";
import { CustomDragPreview } from "./sub-components/DragPreview";
import { theme } from "./sub-components/Theme";
import { useFiles } from "../../context/fileContext"; // Import the useFiles hook
import "./FileTree.css";

function FileTree() {
  const MAX_DEPTH = 3;
  const { getFileStructure, dragAndDropFile, draggableTypes, droppableTypes } = useFiles(); // Access the context
  const [draggingNode, setDraggingNode] = useState();
  const [nodeList, setNodeList] = useState([]);

  const handleDrop = (newTree, { dragSourceId, dropTargetId }) => {
    if (dragSourceId === dropTargetId) return;
    dragAndDropFile(dragSourceId, dropTargetId); // Update context
  };

  function updateNode(node, depth, hasChild) {
    let checkExist = false;
    nodeList.map((value) => {
      if (value.id === node.id) {
        value.depth = depth;
        value.hasChild = hasChild;
        value.parent = node.parent;
        checkExist = true;
      }
    });
    if (checkExist) {
      setNodeList(nodeList);
    } else {
      node.depth = depth;
      node.hasChild = hasChild;
      nodeList.push(node);
      setNodeList(nodeList);
    }
  }

  function checkChildIsFolder(parentID) {
    return nodeList.some((value) => value.parent === parentID && value.data.fileType !== "text");
  }

  function getDropTarget(dropTargetId) {
    return nodeList.find((value) => value.id === dropTargetId);
  }

  function getDragTarget(dragTargetId) {
    return nodeList.find((value) => value.id === dragTargetId);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className="FileTree-Container">
          <Tree
            tree={getFileStructure(false)} // Call with true to transform the data each render
            rootId={0}
            initialOpen={true}
            render={(
              node,
              { depth, isOpen, onToggle, isDragging, isDropTarget, hasChild }
            ) => (
              <CustomNode
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
                isDragging={isDragging}
                isDropTarget={isDropTarget}
                draggingNode={draggingNode}
                hasChild={hasChild}
                updateNode={(value) => {
                  updateNode(value, depth, hasChild);
                }}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            canDrop={(
              treeData,
              { dragSource, dropTarget, dropTargetId, dragSourceId }
            ) => {
              if (dragSource !== dropTarget) {
                let dropT = getDropTarget(dropTargetId);
                let dragT = getDragTarget(dragSourceId);
            
                if (dropT) {
                  // Only allow dropping into folders with fileType "qweqwe"
                  if (droppableTypes.includes(dropT.data.fileType) && draggableTypes.includes(dragT.data.fileType)) {
                    return true; // Allow drop only inside folders and with depth less than 3
                  }
                }
              }
              return false; // Disallow drop if it exceeds depth 3 or isn't a folder
            }}
            classes={{
              root: "treeRoot",
              draggingSource: "draggingSource",
              dropTarget: "dropTarget"
            }}
          />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default FileTree;
