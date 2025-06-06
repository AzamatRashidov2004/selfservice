import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { TypeIcon } from "./Type-Icon";
import { useFiles } from "../../../context/fileContext";
import {
  getKbId,
  getPdfFileUrl,
} from "../../../api/kronos/getKronos";
import keycloak from "../../../keycloak";
import { clearSelection } from "../../../utility/chonkyActionCalls";
import handleAction from "../../File-Browser/sub-components/actionHandler";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { ChonkyIconName } from "chonky";
import customActionNames from "../../../utility/customActionNames";

export const CustomNode = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;
  const { 
    setCurrentFolder, 
    getProjectForNode, 
    currentFolder, 
    getNodeInfo,
    getFileStructure,
    dragAndDropFile,
    addFolder,
    addFiles,
    deleteFiles,
    getAllChildren,
    getPathFromProject,
    getDepth,
    setFileUploadLoading,
    setPdfVisible,
    pdfVisible,
    setPdfUrl,
    pdfUrl,
    setCodeVisible,
    setCodeValue,
    setCodeLanguage,
    codeValue,
    current_project_id,
    setCurrentProjectId,
    currentBotConfig,
    setCurrentBotConfig
  } = useFiles();
  const { keycloak } = useAuth();
  const navigate = useNavigate();

  const setPdfVisibleProp = props.setPdfVisible;
  const setPdfUrlProp = props.setPdfUrl;

  const findChonkyContainerWithTimeout = (selector, timeout = 3000, interval = 100) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const attemptFind = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime >= timeout) {
          // Instead of rejecting, resolve with null to handle gracefully
          console.warn(`Element not found within ${timeout}ms: ${selector}`);
          resolve(null);
        } else {
          setTimeout(attemptFind, interval);
        }
      };

      attemptFind();
    });
  };

  const handleContextMenu = async (event) => {
    if (event.altKey) {
      return; // Do nothing if the Alt key is pressed
    }

    // Prevent the default context menu from appearing
    event.preventDefault();
    clearSelection();
    props.setHighlightedNodeId(props.node.id);
    
    if (props.node.droppable) {
      setCurrentFolder(props.node.parent.toString())
    } else {
      setCurrentFolder(props.node.parent.toString());
    }

    // Get the mouse position from the right-click event
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    props.setDetailsOpen(false);
    props.setSelectedProjectData(null);

    console.log(`Right-clicked on FileTree node: ${props.node.text}`);
    
    // Create a simple custom context menu directly
    showFileTreeContextMenu(mouseX, mouseY, props.node);
  };

  // Helper function to get FontAwesome icons like Chonky uses
  const getChonkyIcon = (iconName) => {
    const iconMap = {
      symlink: 'fas fa-external-link-alt', // Launch
      config: 'fas fa-cog', // Edit  
      trash: 'fas fa-trash', // Delete
      info: 'fas fa-info-circle', // Details
      folderCreate: 'fas fa-folder-plus', // New Folder
      upload: 'fas fa-upload', // Upload
      text: 'fas fa-edit', // Rename
      openFiles: 'fas fa-eye', // Open
      download: 'fas fa-download' // Download
    };
    return iconMap[iconName] || 'fas fa-file';
  };

  const showFileTreeContextMenu = (x, y, node) => {
    // Remove any existing context menu
    const existingMenu = document.querySelector('.filetree-context-menu');
    if (existingMenu) existingMenu.remove();
    
    // Get node info and determine available actions
    const nodeInfo = getNodeInfo(parseInt(node.id));
    const isProject = nodeInfo && nodeInfo.parent === 0 && nodeInfo.data.fileType === "project";
    const isFolder = node.droppable;
    const isFile = !node.droppable;
    
    console.log("Node info:", nodeInfo, { isProject, isFolder, isFile });
    
    // Define actions based on node type - using the same structure as your customActions
    const actions = [];
    
    if (isProject) {
      actions.push(
        { id: 'launch', label: customActionNames.launch, icon: 'symlink' },
        { id: 'edit', label: customActionNames.edit, icon: 'config' },
        { id: 'delete', label: customActionNames.delete, icon: 'trash' },
        { id: 'create_folder', label: customActionNames.newFolder, icon: 'folderCreate' },
        { id: 'upload_file', label: customActionNames.upload_file, icon: 'upload' },
        { id: 'upload_folder', label: customActionNames.upload_folder, icon: 'upload' },
        { id: 'custom_details', label: customActionNames.details, icon: 'info' }
      );
    } else if (isFolder) {
      actions.push(
        { id: 'create_folder', label: customActionNames.newFolder, icon: 'folderCreate' },
        { id: 'upload_file', label: customActionNames.upload_file, icon: 'upload' },
        { id: 'upload_folder', label: customActionNames.upload_folder, icon: 'upload' },
        { id: 'rename', label: customActionNames.rename, icon: 'text' },
        { id: 'delete_files', label: customActionNames.delete, icon: 'trash' }
      );
    } else if (isFile) {
      actions.push(
        { id: 'edit_file', label: customActionNames.open, icon: 'openFiles' },
        { id: 'download_files', label: customActionNames.download, icon: 'download' },
        { id: 'delete_files', label: customActionNames.delete, icon: 'trash' }
      );
    }
    
    if (actions.length === 0) {
      console.log("No actions available for this node type");
      return;
    }

    // Calculate menu position to avoid going off-screen
    const menuHeight = actions.length * 40; // Approximate height per item
    const menuWidth = 160;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let adjustedY = y;
    let adjustedX = x;

    // Adjust Y position if menu would go below viewport
    if (y + menuHeight > viewportHeight) {
      adjustedY = Math.max(10, viewportHeight - menuHeight - 10);
    }

    // Adjust X position if menu would go beyond viewport
    if (x + menuWidth > viewportWidth) {
      adjustedX = Math.max(10, viewportWidth - menuWidth - 10);
    }

    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'filetree-context-menu';
    menu.style.cssText = `
      position: fixed;
      top: ${adjustedY}px;
      left: ${adjustedX}px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      min-width: 160px;
      padding: 4px 0;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
    `;
    
    
    
    // Add menu items
    actions.forEach(action => {
      const item = document.createElement('div');
      item.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #333;
        transition: background-color 0.1s;
      `;
      
      item.innerHTML = `
        <i class="${getChonkyIcon(action.icon)}" style="width: 20px; text-align: center; color: black; font-size: 16px;
"></i>
        <span style="font-size: 15px;">${action.label}</span>
      `;
      
      // Hover effect
      item.onmouseenter = () => item.style.backgroundColor = '#f0f0f0';
      item.onmouseleave = () => item.style.backgroundColor = 'transparent';
      
      // Click handler - import and use your existing action handler
      item.onclick = () => {
        menu.remove();
        console.log(`Executing action: ${action.id} on node: ${node.text}`);
        
        // Create mock data structure that matches what your actionHandler expects
        const mockFileData = {
          id: node.id.toString(),
          name: node.text,
          isDir: node.droppable
        };
        
        const mockState = {
          selectedFiles: [mockFileData],
          selectedFilesForAction: [mockFileData]
        };
        
        const mockPayload = {
          files: [mockFileData]
        };
        
        // Create file context object
        const fileContext = {
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
        };
        
        // Call the action handler with all required parameters
        try {
          console.log(`Calling handleAction for: ${action.id}`);
          console.log("Action data:", { id: action.id, payload: mockPayload, state: mockState });
          console.log("Node info:", getNodeInfo(parseInt(node.id)));
          
          handleAction(
            { id: action.id, payload: mockPayload, state: mockState },
            setCurrentFolder,
            fileContext,
            currentFolder,
            keycloak,
            setPdfUrlProp,
            setPdfVisibleProp,
            setFileUploadLoading,
            setCodeVisible,
            setCodeValue,
            setCodeLanguage,
            codeValue,
            setCurrentProjectId,
            () => {}, // setFileActions - not used in this context
            props.setDetailsOpen,
            props.setSelectedProjectData,
            current_project_id,
            currentBotConfig,
            setCurrentBotConfig,
            navigate
          );
        } catch (error) {
          console.error("Error executing action:", error);
        }
      };
      
      menu.appendChild(item);
    });
    
    // Add to document
    document.body.appendChild(menu);
    
    // Remove on click outside
    const removeMenu = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', removeMenu);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    
    // Remove on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        menu.remove();
        document.removeEventListener('click', removeMenu);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', removeMenu);
      document.addEventListener('keydown', handleEscape);
    }, 100);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    props.setHighlightedNodeId(props.node.id);
    props.onToggle(props.node.id);

    // Is it a file
    if (!props.node.droppable) {
      setCurrentFolder(props.node.parent.toString());
      return;
    }

    // It is a folder
    if (props.isOpen) {
      setCurrentFolder(props.node.parent.toString());
      return;
    }

    setCurrentFolder(props.node.id.toString());
  };

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.parent]);

  useEffect(() => {
    // If current folder is set to this node and it is closed
    if (parseInt(currentFolder) == props.node.id && !props.isOpen) {
      props.onToggle(props.node.id);
      props.setHighlightedNodeId(props.node.id);
    }
  }, [currentFolder])

  useEffect(() => {
    props.updateNode(props.node);
  }, [props.hasChild]);

  async function handleDoubleClick() {
    setPdfVisibleProp(true);
    if (!keycloak || !keycloak.token) return;

    const file = data;
    if (file && file.fileType === "pdf") {
      const number_id = parseInt(props.node.id);
      const project = getProjectForNode(number_id);

      if (project) {
        const { kronosProjectId: projectId, text: text } = project;

        console.log("project id: ", projectId);

        try {
          const kb_id = await getKbId(projectId, keycloak.token);
          const url = await getPdfFileUrl(
            projectId,
            kb_id,
            text,
            keycloak.token
          );
          if (url != "") {
            setPdfVisibleProp(true);
            setPdfUrlProp(url);
          } else {
            console.error("No content in PDF blob.");
          }
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      } else {
        console.error("Project not found for node:", number_id);
      }
    }
  }

  return (
    <div
      style={{
        paddingInlineStart: indent,
        cursor: "pointer",
        backgroundColor:
          props.highlightedNodeId === props.node.id ? "#e0f7fa" : "transparent",
      }}
      className={`node-root depth-${props.depth}`}
      onClick={(e) => {
        handleToggle(e);
      }}
      onDoubleClick={data?.fileType === "pdf" ? handleDoubleClick : () => { }}
      onContextMenu={handleContextMenu}
    >
      <div
        className={`expandIconWrapper ${props.isOpen ? "isOpen" : ""}`}
        onClick={(e) => {
          handleToggle(e);
        }}
      >
        {props.node.droppable && <ArrowRightIcon />}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <div
        className="labelGridItem"
        style={{
          textOverflow: "ellipsis !important",
          whiteSpace: "nowrap !important",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="body2"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.node.text}
        </Typography>
      </div>
    </div>
  );
};