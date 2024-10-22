import { ChonkyActions } from "chonky";
import { findFile } from "./folderSearch";
import {
  createFolderModalEvent,
  createUploadFileModalEvent,
} from "../../../utility/Modal_Util";

import { updateSinglePath } from "../../../utility/Api_Utils";
import handlePathChangeAtDepth from "../../../utility/FileSystem_Utils";
import { updatePathBulk } from "../../../api/kronos/postKronos";

async function handleAction(
  data,
  setCurrentFolder,
  fileContext,
  currentFolder,
  keycloak
) {
  const fileData = fileContext.getFileStructure(true);
  console.log("ACTION", data);

  const {
    getFileStructure,
    dragAndDropFile,
    addFolder,
    addFiles,
    deleteFiles,
    getProjectForNode,
    getAllChildren,
    getNodeInfo,
    getPathFromProject,
    getDepth,
  } = fileContext;

  if (data.id === ChonkyActions.OpenFiles.id) {
    const file = findFile(fileData, data.payload.files[0].id);
    if (file?.isDir) {
      setCurrentFolder(file.id);
    }
  }

  if (data.id === ChonkyActions.EndDragNDrop.id) {
    // Handle Drag and Drop of single/multiple files
    if (!keycloak || !keycloak.token) return;

    const { destination, draggedFile } = data.payload;

    const newPath = getPathFromProject(parseInt(destination.id));
    const nodeInfo = getNodeInfo(parseInt(draggedFile.id));
    const selectedFiles = data.state.selectedFiles;

    let result = false;
    if (selectedFiles.length > 1 || nodeInfo.droppable) {
      // Multiple file dragging
      const payload = [];
      selectedFiles.forEach((file) => {
        const currentNode = getNodeInfo(parseInt(file.id));
        if (!currentNode) return;

        if (currentNode.droppable) {
          const targetDepth = getDepth(parseInt(currentNode.id));
          // If folder
          const children = getAllChildren(parseInt(currentNode.id));
          children.forEach((childNode) => {
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
        } else {
          // If file
          console.log(currentNode);
          payload.push({
            _id: currentNode.kronosKB_id,
            project_id: currentNode.kronosProjectId,
            source_file: `${newPath}${currentNode.text}`,
          });
        }
      });
      result = await updatePathBulk(
        nodeInfo.kronosProjectId,
        payload,
        keycloak.token
      );
    } else {
      // Single file dragging
      result = await updateSinglePath(
        nodeInfo.kronosProjectId,
        nodeInfo.kronosKB_id,
        `${newPath}${nodeInfo.text}`,
        keycloak.token
      );
    }
    if (result) {
      console.log(selectedFiles);
      fileContext.dragAndDropFile(destination.id, selectedFiles);
    }
  }

  // Handle Create File custom action
  if (data.id === "create_folder") {
    createFolderModalEvent((folderName) => {
      fileContext.addFolder(parseInt(currentFolder), folderName);
    });
  }

  // Handle Create File custom action
  if (data.id === "upload") {
    const projectInfo = getProjectForNode(parseInt(currentFolder));
    const targetPath = getPathFromProject(parseInt(currentFolder));
    console.log(projectInfo, targetPath);
    // createUploadFileModalEvent((files) => {
    //   fileContext.addFiles(parseInt(currentFolder), files);
    // });
  }

  if (data.id === "delete_files") {
    fileContext.deleteFiles(
      data.state.selectedFiles.map((file) => parseInt(file.id))
    );
  }
}

export default handleAction;
