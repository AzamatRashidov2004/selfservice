import React, { useState } from "react";
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
import SampleData from "./sub-components/sampleData.json";
import "./FileTree.css"

function FileTree() {
  const MAX_DEPTH = 3;
  const [treeData, setTreeData] = useState(SampleData);
  const handleDrop = (newTree) => setTreeData(newTree);
  const [draggingNode, setDraggingNode] = useState();
  const [nodeList, setNodeList] = useState([]);

  function updateNode(node, depth, hasChild) {
    let checkExist = false;
    nodeList.map((value) => {
      if (value.id == node.id) {
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
    let fileExist = false;

    nodeList.map((value) => {
      if (value.parent == parentID) {
        if (value.data.fileType != "text") {
          fileExist = true;
        }
      }
    });
    return fileExist;
  }
  function getDropTarget(dropTargetId) {
    let dropTarget;

    nodeList.map((value) => {
      if (value.id == dropTargetId) {
        dropTarget = value;
      }
    });
    return dropTarget;
  }

  function getDragTarget(dragTargetId) {
    let dragTarget;

    nodeList.map((value) => {
      if (value.id == dragTargetId) {
        dragTarget = value;
      }
    });
    return dragTarget;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className="FileTree-Container">
          <Tree
            tree={treeData}
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
              if (dragSource != dropTarget) {
                let dropT = getDropTarget(dropTargetId);
                let dragT = getDragTarget(dragSourceId);

                if (dropT != null) {
                  if (dropT.data.fileType != "text") {
                    if (dropT.depth >= MAX_DEPTH - 1) {
                      if (dragSource.data.fileType == "text") {
                        return true;
                      } else {
                        return false;
                      }
                    } else {
                      if (dragT.hasChild) {
                        if (checkChildIsFolder(dragSourceId)) {
                          return false;
                        } else {
                          return true;
                        }
                      } else {
                        return true;
                      }
                    }
                  }
                }
              }
            }}
            classes={{
              root: "treeRoot",              // Now referencing normal CSS class
              draggingSource: "draggingSource", // Now referencing normal CSS class
              dropTarget: "dropTarget"         // Now referencing normal CSS class
            }}
          />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default FileTree;
