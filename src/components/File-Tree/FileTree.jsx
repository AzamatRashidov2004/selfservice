import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { DndProvider } from "react-dnd";
import {
  Tree,
  MultiBackend,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { CustomNode } from "./sub-components/Node";
import { CustomDragPreview } from "./sub-components/DragPreview";
import { theme } from "./sub-components/Theme";
import { useFiles } from "../../context/fileContext";
import "./FileTree.css";

function FileTree() {
  const { getFileStructure, dragAndDropFile, draggableTypes, droppableTypes } =
    useFiles();
  const [draggingNode, setDraggingNode] = useState();
  const [nodeList, setNodeList] = useState([]);
  const [highlightedNodeId, setHighlightedNodeId] = useState(null); // Moved highlighted state here

  const handleDrop = (newTree, { dragSourceId, dropTargetId }) => {
    if (dragSourceId === dropTargetId) return;
    dragAndDropFile(dragSourceId, dropTargetId);
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

  function getDropTarget(dropTargetId) {
    return nodeList.find((value) => value.id === dropTargetId);
  }

  function getDragTarget(dragTargetId) {
    return nodeList.find((value) => value.id === dragTargetId);
  }

  return (
    <div className="file-tree-border-wrapper">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <div className="FileTree-Container">
            <Tree
              tree={getFileStructure(false)}
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
                  highlightedNodeId={highlightedNodeId} // Pass down the highlighted node id
                  setHighlightedNodeId={setHighlightedNodeId} // Pass down the setter function
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
                  if (dropT && dragT) {
                    if (
                      droppableTypes.includes(dropT.data.fileType) &&
                      draggableTypes.includes(dragT.data.fileType)
                    ) {
                      return true;
                    }
                  }
                }
                return false;
              }}
              classes={{
                root: "treeRoot",
                draggingSource: "draggingSource",
                dropTarget: "dropTarget",
              }}
            />
          </div>
        </DndProvider>
      </ThemeProvider>
    </div>
  );
}

export default FileTree;
