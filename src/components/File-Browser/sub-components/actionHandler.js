import { ChonkyActions } from "chonky";
import { findFile } from "./folderSearch";
import {
  createFolderModalEvent,
  createUploadFileModalEvent,
  createNotificationEvent,
} from "../../../utility/Modal_Util";

import { updateSinglePath } from "../../../utility/Api_Utils";
import handlePathChangeAtDepth from "../../../utility/FileSystem_Utils";
import {
  updatePathBulk,
  uploadMultiplePdfs,
} from "../../../api/kronos/postKronos";
import { deleteBulkPdf } from "../../../api/kronos/deleteKronos";
import {
  getKbId,
  getPdfFile,
  getPdfFileUrl,
  getHtmlFile,
  getHTMLFromProject,
  getFSMFromProject,
} from "../../../api/kronos/getKronos";
import { KeyboardReturnRounded } from "@mui/icons-material";

async function handleAction(
  data,
  setCurrentFolder,
  fileContext,
  currentFolder,
  keycloak,
  setPdfUrl,
  setPdfVisible,
  setFileUploadLoading,
  setCodeVisible,
  setCodeValue,
  setCodeLanguage,
  codeValue
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
    try {
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
      } else {
        throw new Error("Drag and drop failed");
      }
    } catch (error) {
      createNotificationEvent(
        "Something Went Wrong",
        "Drag and drop failed. Please try again.",
        "danger",
        4000
      );
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
    if (!keycloak || !keycloak.token) return;
    let path = getPathFromProject(parseInt(currentFolder));
    const project = getProjectForNode(parseInt(currentFolder));
    if (path.lengt > 0) path = path.slice(0, -1);
    createUploadFileModalEvent(async (files) => {
      try {
        const result = await uploadMultiplePdfs(
          files,
          project.kronosProjectId,
          path,
          keycloak.token,
          setFileUploadLoading
        );
        console.log("RESULT", result);
        if (result) {
          fileContext.addFiles(
            parseInt(currentFolder),
            files,
            project.kronosProjectId,
            result
          );
        } else {
          throw new Error("File upload failed");
        }
      } catch (error) {
        createNotificationEvent(
          "Something Went Wrong",
          "File upload failed. Please try again.",
          "danger",
          4000
        );
      }
    });
  }

  if (data.id === "download_files") {
    if (!keycloak || !keycloak.token) return;

    const selectedFile = data.state.selectedFiles[0];
    const currentNode = getNodeInfo(parseInt(selectedFile.id));

    if (currentNode.droppable) return;
    const res = await getPdfFile(
      currentNode.kronosProjectId,
      currentNode.kronosKB_id,
      currentNode.text,
      keycloak.token
    );
    if (!res) {
      createNotificationEvent(
        "Something Went Wrong",
        "Download has failed. Try again later.",
        "danger",
        4000
      );
    }
  }

  if (data.id === "open_files") {
    if (!keycloak || !keycloak.token) return;

    const selectedFile = data.payload.files[0];
    const nodeInfo = getNodeInfo(parseInt(selectedFile.id));
    try {
      if (nodeInfo.text.toLowerCase().endsWith(".html")) {
        const selectedFileCurrent = data.state.selectedFiles[0];
        console.log("selectedFileCurrent: ", selectedFileCurrent);
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        if (project_id) {
          const htmlData = await getHTMLFromProject(project_id, keycloak.token);

          if (htmlData !== "") {
            setCodeVisible(true);
            setCodeValue(htmlData);
            setCodeLanguage("html");
          } else {
            setCodeVisible(false);
            throw new Error("HTML content not found.");
          }
        } else {
          throw new Error("Project id not found.");
        }
      }
      if (nodeInfo.text.toLowerCase().endsWith(".fsm")) {
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        const project_text = project.text;

        if (project_id) {
          setCodeVisible(true);
          const fsmData = await getFSMFromProject(project_id, keycloak.token);
          if (fsmData !== "") {
            setCodeVisible(true);
            setCodeValue(fsmData);
            setCodeLanguage("json");
          } else {
            setCodeVisible(false);
            throw new Error("fsm file not found.");
          }
        } else {
          throw new Error("Project id not found.");
        }
      }

      if (nodeInfo.text.toLowerCase().endsWith(".pdf")) {
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        const project_text = project.text;

        if (project_id) {
          setPdfVisible(true);
          const kb_id = await getKbId(project_id, keycloak.token);

          if (kb_id) {
            const pdfUrl = await getPdfFileUrl(
              project_id,
              kb_id,
              project_text,
              keycloak.token
            );
            if (pdfUrl) {
              setPdfUrl(pdfUrl);
            } else {
              throw new Error("pdf url not found.");
            }
          } else {
            throw new Error("KB id not found.");
          }
        } else {
          throw new Error("Project id not found.");
        }
      }
    } catch (error) {
      createNotificationEvent(
        "Something Went Wrong",
        "Open file action failed. Please try again.",
        "danger",
        4000
      );
    }

    if (data.id === "delete_files") {
      if (!keycloak || !keycloak.token) return;

      const selectedFiles = data.state.selectedFiles;
      let project_id;
      const payload = [];
      selectedFiles.forEach((file) => {
        const nodeInfo = getNodeInfo(parseInt(file.id));
        if (nodeInfo.droppable) {
          // Droppable, extract children
          const children = getAllChildren(nodeInfo.id);
          children.forEach((childNode) => {
            payload.push(childNode.kronosKB_id);
          });
        } else {
          // File, add to list
          payload.push(nodeInfo.kronosKB_id);
        }
        if (!project_id)
          project_id = getProjectForNode(parseInt(file.id)).kronosProjectId;
      });
      try {
        const result = await deleteBulkPdf(project_id, payload, keycloak.token);
        if (result) {
          await fileContext.deleteFiles(
            selectedFiles.map((file) => parseInt(file.id))
          );
        } else {
          throw new Error("Delete action failed.");
        }
      } catch (error) {
        createNotificationEvent(
          "Something Went Wrong",
          "Delete action failed. Please try again.",
          "danger",
          4000
        );
      }
    }
  }
}

export default handleAction;
