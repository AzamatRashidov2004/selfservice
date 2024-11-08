import { ChonkyIconName, setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FullFileBrowser, ChonkyActions } from "chonky";
import Loader from "../Loader/Loader";
import { useEffect, useState, useCallback, useMemo } from "react";
import folderSearch from "./sub-components/folderSearch";
import handleAction from "./sub-components/actionHandler";
import { customActions } from "./sub-components/customActions";
import { useFiles } from "../../context/fileContext";
import { useAuth } from "../../context/authContext";
import "./FileBrowser.css"; // Ensure the CSS file is correctly imported

export default function FileBrowser() {
  const {
    getFileStructure,
    dragAndDropFile,
    currentFolder,
    setCurrentFolder,
    addFolder,
    addFiles,
    deleteFiles,
    getProjectForNode,
    getDepth,
    getAllChildren,
    getNodeInfo,
    getPathFromProject,
    fileUploadLoading,
    setFileUploadLoading,
    setPdfVisible,
    setPdfUrl,
  } = useFiles();

  const [files, setFiles] = useState([]); // Initialize as empty array
  const [visibleCount, setVisibleCount] = useState(1);
  const incrementVisibleCount = () => {
    setVisibleCount((prev) => prev + 1);
  };
  const [totalFilesCount, setTotalFilesCount] = useState(0);
  const { keycloak } = useAuth();

  // Set the Chonky icon set
  setChonkyDefaults({ iconComponent: ChonkyIconFA });
  const [folderChain, setFolderChain] = useState(null);

  // Create the load more file entry
  const loadMoreFile = {
    id: "load-more-button",
    name: "Double Click to load 1 more file",
    isLoadMoreButton: true,
    icon: ChonkyIconName.placeholder,
  };

  const fileActions = useMemo(
    () => [
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ChonkyActions.CreateFolder,
      ...customActions,
      ChonkyActions.DownloadFiles,
      ChonkyActions.DeleteFiles,
    ],
    []
  );

  // Define the fileDecorator function
  const fileDecorator = (file) => {
    if (file.isLoadMoreButton) {
      return {
        className: "load-more-button",
        title: "Click to load more files",
      };
    }
    return {};
  };

  // Handle actions such as opening files, switching views, etc.
  const handleActionWrapper = useCallback(
    (data) => {
      handleAction(
        data,
        setCurrentFolder,
        {
          getFileStructure,
          dragAndDropFile,
          addFolder,
          addFiles,
          deleteFiles,
          getProjectForNode,
          getDepth,
          getAllChildren,
          getNodeInfo,
          getPathFromProject,
        },
        currentFolder,
        keycloak,
        setPdfUrl,
        setPdfVisible,
        setFileUploadLoading,
        incrementVisibleCount
      );
    },
    [
      getFileStructure,
      dragAndDropFile,
      currentFolder,
      keycloak,
      setCurrentFolder,
      incrementVisibleCount,
    ]
  );

  // Fetch the folder data and set the file and folder chain states
  useEffect(() => {
    const transformedData = getFileStructure(true);
    let folderChainTemp = [];
    let filesTemp = [];

    const [found, filesTemp1, folderChainTemp1] = folderSearch(
      transformedData,
      folderChainTemp,
      currentFolder
    );

    if (found) {
      filesTemp = filesTemp1;
      folderChainTemp = folderChainTemp1;
    }
    setFolderChain(folderChainTemp);
    setTotalFilesCount(filesTemp.length);

    // Slice the files up to visibleCount
    let visibleFiles = filesTemp.slice(0, visibleCount);

    // If not all files are visible, add the load more button
    if (visibleCount < filesTemp.length) {
      visibleFiles = [...visibleFiles, loadMoreFile];
    }
    setFiles(visibleFiles);
  }, [currentFolder, getFileStructure, visibleCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      const loadMoreDiv = document.querySelector(
        '[data-chonky-file-id="load-more-button"]'
      );
      if (loadMoreDiv) {
        loadMoreDiv.classList.add("load-more-button");
      }
      // Select all spans with the specified class
      const extensionSpans = document.querySelectorAll(
        ".chonky-file-entry-description-title-extension"
      );

      extensionSpans.forEach((span) => {
        // Get the text content
        let text = span.textContent;
        // Remove the leading dot if present
        if (text.startsWith(".")) {
          span.textContent = text.substring(1);
        }
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Reset visible count when changing folders
  useEffect(() => {
    setVisibleCount(1);
  }, [currentFolder]);

  return (
    <div style={{ width: "100%", height: "400px", position: "relative" }}>
      {fileUploadLoading && (
        <div
          className="loader-container"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "10px",
          }}
        >
          <Loader loader="white" />
        </div>
      )}
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        defaultFileViewActionId={ChonkyActions.EnableListView.id}
        fileActions={fileActions}
        onFileAction={handleActionWrapper}
        disableDefaultFileActions={true}
        fileDecorator={fileDecorator} // Pass the fileDecorator function
      />
    </div>
  );
}
