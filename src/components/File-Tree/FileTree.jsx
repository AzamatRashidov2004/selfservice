import React, { useEffect, useState, useContext } from "react";
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
import { useAuth } from "../../context/authContext";
import { updateSinglePath } from "../../utility/Api_Utils";
import { updatePathBulk } from "../../api/kronos/postKronos";
import handlePathChangeAtDepth from "../../utility/FileSystem_Utils";

function FileTree() {
  const {
    getFileStructure,
    dragAndDropFile,
    draggableTypes,
    droppableTypes,
    getPathFromProject,
    getNodeInfo,
    getAllChildren,
    getDepth,
    getProjectForNode,
    pdfVisible,
    setPdfUrl,
    setPdfVisible,
    pdfUrl,
    setCodeVisible,
    setCodeLanguage,
    setCodeValue,
  } = useFiles();
  const [draggingNode, setDraggingNode] = useState();
  const [nodeList, setNodeList] = useState([]);
  const [highlightedNodeId, setHighlightedNodeId] = useState(null); // Moved highlighted state here
  const { keycloak } = useAuth();

  async function handleDrop(newTree, { dragSourceId, dropTargetId }) {
    if (dragSourceId === dropTargetId) return;
    if (!keycloak || !keycloak.token) return;

    const newPath = getPathFromProject(parseInt(dropTargetId));
    const nodeInfo = getNodeInfo(parseInt(dragSourceId));

    if (nodeInfo.droppable) {
      if (nodeInfo.kronosProjectId != newPath.kronosProjectId) {
        // todo show failed popup
        console.log("show failed modal");
        return;
      }
      // Folder drag
      const children = getAllChildren(parseInt(nodeInfo.id));
      if (!children || children.length === 0) {
        // Empty folder, just change UI
        dragAndDropFile(dropTargetId, [{ id: dragSourceId }]);
        return;
      }
      const payload = [];
      const targetDepth = getDepth(parseInt(nodeInfo.id));

      children.forEach((childNode) => {
        // Update the paths of all children files
        const newChildPath = handlePathChangeAtDepth(
          targetDepth,
          newPath,
          childNode,
          getPathFromProject
        );
        payload.push({
          id: childNode.kronosKB_id,
          project_id: childNode.kronosProjectId,
          source_file: newChildPath,
        });
      });
      const result = await updatePathBulk(
        nodeInfo.kronosProjectId,
        payload,
        keycloak.token
      );
      if (result) {
        return dragAndDropFile(dropTargetId, [{ id: dragSourceId }]);
      }
    } else {
      // Single file drag
      const result = await updateSinglePath(
        nodeInfo.kronosProjectId,
        nodeInfo.kronosKB_id,
        `${newPath}${nodeInfo.text}`,
        keycloak.token
      );
      if (result) {
        return dragAndDropFile(dropTargetId, [{ id: dragSourceId }]);
      }
    }
  }

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
                  setPdfVisible={setPdfVisible}
                  pdfVisible={setPdfVisible}
                  setPdfUrl={setPdfUrl}
                  pdfUrl={setPdfUrl}
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
                if (dropTarget && dragSource !== dropTarget) {
                  console.log("dropTarget is: ", dropTarget);
                  let project_id_source = getProjectForNode(
                    parseInt(dragSourceId)
                  );
                  let project_id_target = "";
                  if (dropTargetId) {
                    project_id_target = getProjectForNode(
                      parseInt(dropTargetId)
                    );
                  }
                  if (project_id_source !== project_id_target) {
                    console.log("here");
                    return false;
                  }
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
