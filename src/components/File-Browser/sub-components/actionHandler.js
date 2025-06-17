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

import {
  deletePdfProject
} from '../../../api/kronos/deleteKronos';

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

  if (data.id === 'custom_details') {
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

  if (data.id === 'rename') {
    const selectedFiles = data.state.selectedFilesForAction;
    if (selectedFiles.length !== 1) {
      createNotificationEvent(
        'Invalid Selection',
        'Please select a single item to rename.',
        'warning',
        4000
      );
      return;
    }
  
    const selectedFile = selectedFiles[0];
    const nodeInfo = getNodeInfo(parseInt(selectedFile.id));
    if (!nodeInfo) {
      createNotificationEvent(
        'Error',
        'Could not find item information.',
        'danger',
        4000
      );
      return;
    }
    
    // Get project information
    const projectInfo = getProjectForNode(parseInt(selectedFile.id));
    if (!projectInfo || !projectInfo.kronosProjectId) {
      createNotificationEvent(
        'Error',
        'Could not find project information.',
        'danger',
        4000
      );
      return;
    }
    
    const currentName = nodeInfo.text;
    
    // Important: Get ONLY the directory part of the path
    let parentPath = "";
    if (nodeInfo.parent !== 0) { // Not root
      const parentNode = getNodeInfo(nodeInfo.parent);
      if (parentNode) {
        parentPath = getPathFromProject(parentNode.id);
      }
    }
  
    // Create modal for renaming
    createFolderModalEvent(async (newName) => {
      if (!newName || newName.trim() === currentName) return;
  
      // Ensure the new name doesn't contain any forbidden characters
      const forbiddenChars = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
      if (forbiddenChars.some(char => newName.includes(char))) {
        createNotificationEvent(
          'Invalid Name',
          'Filename cannot contain any of the following characters: \\ / : * ? " < > |',
          'warning',
          4000
        );
        return;
      }
  
      const isDirectory = selectedFile.isDir;
      
      // Calculate correct paths
      const oldPath = parentPath + currentName; // Old complete path
      const newPath = parentPath + newName;     // New complete path
      
      console.log("Debug paths:", {
        parentPath, 
        currentName,
        newName,
        oldPath,
        newPath,
        isDirectory
      });
  
      try {
        const payload = [];
        const projectId = projectInfo.kronosProjectId;
  
        if (isDirectory) {
          // For directories, add trailing slash to paths
          const oldDirPath = oldPath + '/';
          const newDirPath = newPath + '/';
          
          // Handle directory rename - we need to update this folder and all nested files
          const allChildren = getAllChildren(nodeInfo.id);
          console.log(`Found ${allChildren.length} children of the directory`);
          
          // First add the folder itself (if it has a KB ID)
          if (nodeInfo.kronosKB_id) {
            payload.push({
              id: nodeInfo.kronosKB_id,
              project_id: projectId,
              source_file: newDirPath
            });
          }
          
          // Then add all children with updated paths
          allChildren.forEach(child => {
            if (child.kronosKB_id) {
              // Get the child's current path
              let childRelativePath = "";
              if (child.droppable) {
                // For folder children
                childRelativePath = getPathFromProject(child.id);
              } else {
                // For file children, get parent path + filename
                const childParentPath = getPathFromProject(child.parent);
                childRelativePath = childParentPath + child.text;
              }
              
              console.log(`Child ${child.id} (${child.text}) original path:`, childRelativePath);
              
              // Replace the old directory prefix with the new one
              const childNewPath = childRelativePath.replace(oldDirPath, newDirPath);
              console.log(`Child ${child.id} new path:`, childNewPath);
              
              payload.push({
                id: child.kronosKB_id,
                project_id: projectId,
                source_file: childNewPath
              });
            }
          });
        } else {
          // Single file rename is simpler
          payload.push({
            id: nodeInfo.kronosKB_id,
            project_id: projectId,
            source_file: newPath
          });
        }
  
        // Log the payload for debugging
        console.log("Rename payload:", JSON.stringify(payload, null, 2));
        
        // Try a simpler approach with just the file being renamed
        const simplifiedPayload = [{
          id: nodeInfo.kronosKB_id,
          project_id: projectId,
          source_file: isDirectory ? newPath + '/' : newPath
        }];
        
        console.log("Simplified payload attempt:", JSON.stringify(simplifiedPayload, null, 2));
  
        // Use bulk update endpoint with simplified payload first
        const result = await updatePathBulk(
          projectId,
          payload, // Start with just renaming the single item
          keycloak.token
        );
  
        if (result) {
          // On success, update UI only for the renamed file/folder
          fileContext.renameNodeAndChildren(
            nodeInfo.id,
            newName,
            oldPath + (isDirectory ? '/' : ''),
            newPath + (isDirectory ? '/' : '')
          );
  
          createNotificationEvent(
            'Success',
            'Item renamed successfully!',
            'success',
            4000
          );
          
          // If this was a directory with children, we can handle the children in a follow-up request
          // to simplify debugging
          if (isDirectory && allChildren.length > 0 && payload.length > 1) {
            console.log("Will now update children paths in a separate request");
            // Here you could make a separate updatePathBulk call for the children
          }
        } else {
          throw new Error('Rename failed');
        }
      } catch (error) {
        createNotificationEvent(
          'Rename Failed',
          'Could not rename item. Please try again.',
          'danger',
          4000
        );
        console.error('Rename error:', error);
      }
    }, currentName); // Pass the current name as the initial value for the input
  }

  if (data.id === 'delete') {
    // Create a simple confirmation dialog directly in the DOM
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'confirmation-dialog';
    confirmDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      padding: 32px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-width: 450px;
      max-width: 90vw;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      animation: fadeIn 0.3s ease-out;
    `;

    // Add animation keyframes
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -55%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(styleSheet);

    // Create overlay with animation
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.6);
      z-index: 9998;
      backdrop-filter: blur(2px);
      animation: fadeIn 0.2s ease-out;
    `;

    // Warning icon
    const iconContainer = document.createElement('div');
    iconContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      animation: scaleIn 0.3s ease-out;
    `;
    
    const warningIcon = document.createElement('div');
    warningIcon.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FEECEB" stroke="#E53E3E" stroke-width="2"/>
        <path d="M12 7V13" stroke="#E53E3E" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="12" cy="17" r="1.5" fill="#E53E3E"/>
      </svg>
    `;
    iconContainer.appendChild(warningIcon);

    // Title with larger font and better spacing
    const title = document.createElement('h3');
    title.textContent = 'Are you sure you want to delete this project?';
    title.style.cssText = `
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #1A202C;
      text-align: center;
    `;

    // Subtitle/description
    const subtitle = document.createElement('p');
    subtitle.textContent = 'This action cannot be undone. The project will be permanently deleted.';
    subtitle.style.cssText = `
      margin: 0;
      font-size: 16px;
      color: #4A5568;
      text-align: center;
      line-height: 1.5;
    `;

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 8px;
    `;

    // No button (Cancel)
    const noButton = document.createElement('button');
    noButton.textContent = 'Cancel';
    noButton.style.cssText = `
      padding: 12px 24px;
      background-color: #EDF2F7;
      color: #4A5568;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    noButton.onmouseover = () => {
      noButton.style.backgroundColor = '#E2E8F0';
    };
    noButton.onmouseout = () => {
      noButton.style.backgroundColor = '#EDF2F7';
    };

    // Yes button (Delete)
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Delete Project';
    yesButton.style.cssText = `
      padding: 12px 24px;
      background-color: #E53E3E;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(229, 62, 62, 0.3);
    `;
    yesButton.onmouseover = () => {
      yesButton.style.backgroundColor = '#C53030';
    };
    yesButton.onmouseout = () => {
      yesButton.style.backgroundColor = '#E53E3E';
    };

    async function deleteProject(project_id, keycloak, id) {
      const result = await deletePdfProject(project_id, keycloak);
      if (!result) {
        createNotificationEvent(
          'Deletion Failed',
          'Could not delete project',
          'danger',
          4000
        );
      }
      else {
        createNotificationEvent("Success!", "Project Deleted ", "success", 4000);
        setTimeout(() => {
          location.reload();
        }, 1000);
        //fileContext.deleteProject(id);
      }
    }

    // Add event listener for Yes button
    yesButton.addEventListener('click', () => {
      // Add a nice fade-out effect
      confirmDialog.style.animation = 'fadeIn 0.2s ease-in reverse';
      overlay.style.animation = 'fadeIn 0.2s ease-in reverse';
      
      // Remove after animation completes
      setTimeout(() => {
        document.body.removeChild(confirmDialog);
        document.body.removeChild(overlay);
        document.head.removeChild(styleSheet);

        // Execute the delete operation
        const selectedFile = data.state.selectedFilesForAction[0];
        const nodeInfo = getNodeInfo(parseInt(selectedFile.id));
        const project_id = nodeInfo.kronosProjectId;
        deleteProject(project_id, keycloak.token, parseInt(selectedFile.id));
      }, 200);
    });

    // Add event listener for No button
    noButton.addEventListener('click', () => {
      // Add a nice fade-out effect
      confirmDialog.style.animation = 'fadeIn 0.2s ease-in reverse';
      overlay.style.animation = 'fadeIn 0.2s ease-in reverse';
      
      // Remove after animation completes
      setTimeout(() => {
        document.body.removeChild(confirmDialog);
        document.body.removeChild(overlay);
        document.head.removeChild(styleSheet);
      }, 200);
    });

    // Add keyboard support for Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        noButton.click();
        document.removeEventListener('keydown', handleEscapeKey);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);

    // Assemble the dialog
    confirmDialog.appendChild(iconContainer);
    confirmDialog.appendChild(title);
    confirmDialog.appendChild(subtitle);
    buttonsContainer.appendChild(noButton);
    buttonsContainer.appendChild(yesButton);
    confirmDialog.appendChild(buttonsContainer);

    // Add to the document
    document.body.appendChild(overlay);
    document.body.appendChild(confirmDialog);
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
