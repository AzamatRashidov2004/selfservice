import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FullFileBrowser, ChonkyActions } from "chonky";
import Loader from "../Loader/Loader";
import { useEffect, useState, useCallback, useMemo } from "react";
import folderSearch from "./sub-components/folderSearch";
import handleAction from "./sub-components/actionHandler";
import { customActions } from "./sub-components/customActions";
import { useFiles } from "../../context/fileContext"; // Import the useFiles hook
import { useAuth } from "../../context/authContext";

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
    files,
    setFiles,
    visibleCount,
    setVisibleCount,
    incrementVisibleCount,
    totalFilesCount,
    setTotalFilesCount,
  } = useFiles();
  const { keycloak } = useAuth();

  // Set the Chonky icon set
  setChonkyDefaults({ iconComponent: ChonkyIconFA });
  const [folderChain, setFolderChain] = useState(null);

  // Create the load more file entry
  const loadMoreFile = {
    id: "load-more-button",
    name: "Load More",
    isLoadMoreButton: true,
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

  // Handle actions such as opening files, switching views, etc.
  const handleActionWrapper = useCallback(
    (data) => {
      // Check if the clicked file is the load more button
      if (data.id === ChonkyActions.OpenFiles.id && data.payload.targetFile) {
        const targetFile = data.payload.targetFile;
        if (targetFile.isLoadMoreButton) {
          // Increment visibleCount to load more files
          incrementVisibleCount();
          return;
        }
      }
      // Existing action handler logic
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
        setFileUploadLoading
      );
    },
    [
      getFileStructure,
      dragAndDropFile,
      currentFolder,
      keycloak,
      setCurrentFolder,
      incrementVisibleCount, // Include in dependencies
    ]
  );

  // Fetch the folder data and set the file and folder chain states
  useEffect(() => {
    const transformedData = getFileStructure(true); // Get the file structure from context
    let folderChainTemp = [];
    let filesTemp = [];

    const [found, filesTemp1, folderChainTemp1] = folderSearch(
      transformedData, // Use the transformed data from context
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

  // Reset visible count when changing folders
  useEffect(() => {
    setVisibleCount(1); // Reset to initial number when folder changes
  }, [currentFolder]);

  // Customize the appearance of the "Load More" button
  const fileDecorator = (file) => {
    if (file.isLoadMoreButton) {
      return {
        icon: null, // Remove the icon
        style: {
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          textAlign: "center",
          lineHeight: "30px",
        },
      };
    }
    return {};
  };

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
        fileDecorator={fileDecorator}
      />
    </div>
  );
}
