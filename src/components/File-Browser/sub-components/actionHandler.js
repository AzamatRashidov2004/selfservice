import { ChonkyActions } from 'chonky';
import { findFile } from './folderSearch';
import {
  createFolderModalEvent,
  createUploadFileModalEvent,
  createNotificationEvent,
} from '../../../utility/Modal_Util';


import { updateSinglePath } from '../../../utility/Api_Utils';
import handlePathChangeAtDepth from '../../../utility/FileSystem_Utils';
import {
  updatePathBulk,
  uploadMultiplePdfs,
} from '../../../api/kronos/postKronos';
import { deleteBulkPdf } from '../../../api/kronos/deleteKronos';
import {
  getPdfFile,
  getPdfFileUrl,
  getHTMLFromProject,
  getFSMFromProject,
} from '../../../api/kronos/getKronos';
import { updateFSMFile } from '../../../api/kronos/postKronos';
import {
  addItemToCache,
  isItemInCache,
  getItemFromCache,
} from '../../../utility/Session_Storage';

import { getCustomActions } from './customActions';
import { maestroApiUrl } from '../../../api/apiEnv';



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
  codeValue,
  setCurrentProjectId,
  setFileActions,
  setDetailsOpen,
  setSelectedProjectData,
  current_project_id,
  currentBotConfig,
  setCurrentBotConfig,
  navigate,
) {
  const fileData = fileContext.getFileStructure(true);
  console.log('ACTION', data);

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

  if (data.id === 'change_selection') {
    let firstNodeInfo = null;
    if (data.state.selectedFiles.length > 0) {
      firstNodeInfo = getNodeInfo(parseInt(data.state.selectedFiles[0].id));
    }
    setFileActions([
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ...getCustomActions(data.state.selectedFiles, firstNodeInfo),
    ]);
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
        fileContext.dragAndDropFile(destination.id, selectedFiles);
      } else {
        throw new Error('Drag and drop failed');
      }
    } catch (error) {
      createNotificationEvent(
        'Something Went Wrong',
        'Drag and drop failed. Please try again.',
        'danger',
        4000
      );
    }
  }

  // Handle Create File custom action
  if (data.id === 'create_folder') {
    let targetID = parseInt(currentFolder);

    // If create folder is called on a folder, it should create the new folder inside it
    if (
      data.state.selectedFiles.length === 1 &&
      data.state.selectedFiles[0].isDir
    ) {
      const selectedFolder = data.state.selectedFiles[0];
      const selectedFolderID = parseInt(selectedFolder.id);
      const targetNode = getNodeInfo(selectedFolderID);
      targetID = targetNode.id;
      setCurrentFolder(targetID.toString());
    }

    createFolderModalEvent((folderName) => {
      fileContext.addFolder(targetID, folderName);
    });
  }

  if (data.id === 'details') {
    const currentProjectId = parseInt(data.state.selectedFiles[0].id);
    const project = getProjectForNode(parseInt(currentProjectId));
    if (!project) {
      createNotificationEvent(
        'Select Project',
        `Please first select a project and then press the details button`,
        '',
        3000
      );
      return;
    }
    setDetailsOpen(true);
    setSelectedProjectData({
      projectId: project.kronosProjectId,
      title: project.text,
    });
  }

  // Handle Create File custom action
  if (data.id === 'upload_file' || data.id === 'upload_folder') {
    if (!keycloak || !keycloak.token) return;
    let targetID = parseInt(currentFolder);

    if (
      data.state.selectedFiles.length === 1 &&
      data.state.selectedFiles[0].isDir
    ) {
      const selectedFolder = data.state.selectedFiles[0];
      const selectedFolderID = parseInt(selectedFolder.id);
      const targetNode = getNodeInfo(selectedFolderID);
      targetID = targetNode.id;
      setCurrentFolder(targetID.toString());
    }

    let path = getPathFromProject(parseInt(targetID));
    const project = getProjectForNode(parseInt(targetID));
    if (path.length > 0) path = path.slice(0, -1);

    // Determine upload mode based on data.id
    const uploadMode = data.id === 'upload_folder' ? 'folder' : 'file';

    createUploadFileModalEvent(async (files) => {
      try {
        const result = await uploadMultiplePdfs(
          files,
          project.kronosProjectId,
          path,
          keycloak.token,
          setFileUploadLoading
        );
        if (result) {
          fileContext.addFiles(
            parseInt(targetID),
            files,
            project.kronosProjectId,
            result
          );
        } else {
          throw new Error('File upload failed');
        }
      } catch (error) {
        createNotificationEvent(
          'Something Went Wrong',
          'File upload failed. Please try again.',
          'danger',
          4000
        );
      }
    }, uploadMode); // Pass the correct upload mode
  }

  if (data.id === 'launch') {
    const selectedFile = data.state.selectedFilesForAction[0];
    const nodeInfo = getNodeInfo(parseInt(selectedFile.id));
    const project_id = nodeInfo.kronosProjectId;
    window.open(maestroApiUrl + `/app?project_id=${project_id}`);
  }

  if (data.id === 'edit') {
    const selectedFile = data.state.selectedFilesForAction[0];
    const nodeInfo = getNodeInfo(parseInt(selectedFile.id));
    const project_id = nodeInfo.kronosProjectId;
    let config = null;
    const fsmData = await getFSMFromProject(project_id, keycloak.token);
    if (fsmData !== '') {
      // Parse the FSM JSON data
      try {
        setCurrentProjectId(project_id);
        const text = JSON.parse(fsmData);
        setCurrentBotConfig(text);
      } catch (e) {
        throw new Error('Invalid FSM JSON.');
      }
    }
    navigate('/edit');
  }

  if (data.id === 'download_files') {
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
        'Something Went Wrong',
        'Download has failed. Try again later.',
        'danger',
        4000
      );
    }
  }

  if (data.id === 'open_files') {
    if (!keycloak || !keycloak.token) return;

    const selectedFile = data.payload.files[0];
    const nodeInfo = getNodeInfo(parseInt(selectedFile.id));

    if (nodeInfo.text.toLowerCase().endsWith('.html')) {
      try {
        const selectedFileCurrent = data.state.selectedFiles[0];
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        if (project_id) {
          setCurrentProjectId(project_id);
          var htmlData;
          if (isItemInCache(project_id + '.html')) {
            htmlData = getItemFromCache(project_id + '.html');
          } else {
            htmlData = await getHTMLFromProject(project_id, keycloak.token);
            addItemToCache(project_id + '.html', htmlData);
          }

          if (htmlData !== '') {
            setCodeVisible(true);
            setCodeValue(htmlData);
            setCodeLanguage('html');
          } else {
            setCodeVisible(false);
            throw new Error('HTML content not found.');
          }
        } else {
          throw new Error('Project id not found.');
        }
      } catch (error) {
        createNotificationEvent(
          'Something Went Wrong',
          'Failed to open HTML file. Please try again.',
          'danger',
          4000
        );
      }
    } else if (nodeInfo.text.toLowerCase().endsWith('.fsm')) {
      try {
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        const project_text = project.text;

        if (project_id) {
          setCurrentProjectId(project_id);
          setCodeVisible(true);
          var fsmData;
          if (isItemInCache(project_id + '.fsm')) {
            fsmData = getItemFromCache(project_id + '.fsm');
          } else {
            fsmData = await getFSMFromProject(project_id, keycloak.token);
            // add new editor_active and editor_initial_file fields so i can use them in chatbot
            if (fsmData !== '') {
              // Parse the FSM JSON data
              let fsmObject;
              try {
                fsmObject = JSON.parse(fsmData);
              } catch (e) {
                throw new Error('Invalid FSM JSON.');
              }

              // Add new fields if they don't exist
              if (fsmObject.editor_active === undefined) {
                console.log('Here');
                fsmObject.editor_active = true;
              }
              if (fsmObject.editor_initial_file === undefined) {
                console.log('Here');
                fsmObject.editor_initial_file = '';
              }
              // Convert back to formatted JSON string
              fsmData = JSON.stringify(fsmObject, null, 2);
              console.log('The updated data is : ', fsmData);
              try {
                await updateFSMFile(
                  project_id,
                  fsmData ? fsmData : '',
                  keycloak.token ? keycloak.token : ''
                );
              } catch (e) {
                throw new Error(e);
              }
            }
            addItemToCache(project_id + '.fsm', fsmData);
          }

          if (fsmData !== '') {
            setCodeVisible(true);
            setCodeValue(fsmData);
            setCodeLanguage('json');
          } else {
            setCodeVisible(false);
            throw new Error('FSM file not found.');
          }
        } else {
          throw new Error('Project id not found.');
        }
      } catch (error) {
        createNotificationEvent(
          'Something Went Wrong',
          'Failed to open FSM file. Please try again.',
          'danger',
          4000
        );
      }
    } else if (nodeInfo.text.toLowerCase().endsWith('.pdf')) {
      try {
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        const project_text = project.text;
        const kb_id = getNodeInfo(parseInt(selectedFile.id)).kronosKB_id;
        if (project_id) {
          setPdfVisible(true);
          if (kb_id) {
            var pdfUrl;
            if (isItemInCache(kb_id)) {
              pdfUrl = getItemFromCache(kb_id);
            } else {
              pdfUrl = await getPdfFileUrl(
                project_id,
                kb_id,
                project_text,
                keycloak.token
              );
              addItemToCache(kb_id, pdfUrl);
            }
            if (pdfUrl) {
              setPdfUrl(pdfUrl);
            } else {
              throw new Error('PDF URL not found.');
            }
          } else {
            throw new Error('KB id not found.');
          }
        } else {
          throw new Error('Project id not found.');
        }
      } catch (error) {
        createNotificationEvent(
          'Something Went Wrong',
          'Failed to open PDF file. Please try again.',
          'danger',
          4000
        );
      }
    } else {
      // Handle other file types or do nothing
    }
  }

  if (data.id === 'edit_file') {
    if (!keycloak || !keycloak.token) return;

    const selectedFiles = data.state.selectedFiles;
    if (!selectedFiles || selectedFiles.length === 0) {
      // No selected files, so we cannot edit anything
      createNotificationEvent(
        'No File Selected',
        'Please select a file before trying to edit.',
        'warning',
        4000
      );
      return;
    }

    // Since we know there's at least one selected file, grab the first one:
    const selectedFile = selectedFiles[0];

    const nodeInfo = getNodeInfo(parseInt(selectedFile.id));

    if (nodeInfo.text.toLowerCase().endsWith('.html')) {
      try {
        const selectedFileCurrent = data.state.selectedFiles[0];
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        if (project_id) {
          setCurrentProjectId(project_id);
          var htmlData;
          if (isItemInCache(project_id + '.html')) {
            htmlData = getItemFromCache(project_id + '.html');
          } else {
            htmlData = await getHTMLFromProject(project_id, keycloak.token);
            addItemToCache(project_id + '.html', htmlData);
          }

          if (htmlData !== '') {
            setCodeVisible(true);
            setCodeValue(htmlData);
            setCodeLanguage('html');
          } else {
            setCodeVisible(false);
            throw new Error('HTML content not found.');
          }
        } else {
          throw new Error('Project id not found.');
        }
      } catch (error) {
        createNotificationEvent(
          'Something Went Wrong',
          'Failed to open HTML file. Please try again.',
          'danger',
          4000
        );
      }
    } else if (nodeInfo.text.toLowerCase().endsWith('.fsm')) {
      try {
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        const project_text = project.text;

        if (project_id) {
          setCurrentProjectId(project_id);
          setCodeVisible(true);
          var fsmData;
          if (isItemInCache(project_id + '.fsm')) {
            fsmData = getItemFromCache(project_id + '.fsm');
          } else {
            fsmData = await getFSMFromProject(project_id, keycloak.token);
            addItemToCache(project_id + '.fsm', fsmData);
          }
          if (fsmData !== '') {
            setCodeVisible(true);
            setCodeValue(fsmData);
            setCodeLanguage('json');
          } else {
            setCodeVisible(false);
            throw new Error('FSM file not found.');
          }
        } else {
          throw new Error('Project id not found.');
        }
      } catch (error) {
        createNotificationEvent(
          'Something Went Wrong',
          'Failed to open FSM file. Please try again.',
          'danger',
          4000
        );
      }
    } else if (nodeInfo.text.toLowerCase().endsWith('.pdf')) {
      try {
        const project = getProjectForNode(parseInt(selectedFile.id));
        const project_id = project.kronosProjectId;
        const project_text = project.text;
        const kb_id = getNodeInfo(parseInt(selectedFile.id)).kronosKB_id;
        if (project_id) {
          setPdfVisible(true);
          if (kb_id) {
            var pdfUrl;
            if (isItemInCache(kb_id)) {
              pdfUrl = getItemFromCache(kb_id);
            } else {
              pdfUrl = await getPdfFileUrl(
                project_id,
                kb_id,
                project_text,
                keycloak.token
              );
              addItemToCache(kb_id, pdfUrl);
            }
            if (pdfUrl) {
              setPdfUrl(pdfUrl);
            } else {
              throw new Error('PDF URL not found.');
            }
          } else {
            throw new Error('KB id not found.');
          }
        } else {
          throw new Error('Project id not found.');
        }
      } catch (error) {
        createNotificationEvent(
          'Something Went Wrong',
          'Failed to open PDF file. Please try again.',
          'danger',
          4000
        );
      }
    } else {
      const selectedFiles = data.state.selectedFiles;
      if (!selectedFiles || selectedFiles.length === 0) {
        // No selected files, so we cannot edit anything
        createNotificationEvent(
          'No File Selected',
          'Please select a file before trying to edit.',
          'warning',
          4000
        );
        return;
      }

      // Since we know there's at least one selected file, grab the first one:
      const selectedFile = selectedFiles[0];
      const file = findFile(fileData, selectedFile.id);
      if (file?.isDir) {
        setCurrentFolder(file.id);
      }
    }
  }

  if (data.id === 'delete_files') {
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
        throw new Error('Delete action failed.');
      }
    } catch (error) {
      createNotificationEvent(
        'Something Went Wrong',
        'Delete action failed. Please try again.',
        'danger',
        4000
      );
    }
  }
}

export default handleAction;
