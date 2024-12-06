import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FullFileBrowser, ChonkyActions } from "chonky";
import Loader from "../Loader/Loader";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from "react";
import folderSearch from "./sub-components/folderSearch";
import handleAction from "./sub-components/actionHandler";
import { customActions } from "./sub-components/customActions";
import { useFiles } from "../../context/fileContext"; // Import the useFiles hook
import { useAuth } from "../../context/authContext";
import "./FileBrowser.css";

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
    pdfVisible,
    pdfUrl,
    setPdfUrl,
    //files,
    //setFiles,
    visibleCount,
    setVisibleCount,
    incrementVisibleCount,
    totalFilesCount,
    setTotalFilesCount,
    setCodeVisible,
    setCodeValue,
    setCodeLanguage,
    codeValue,
  } = useFiles(); // Get the context function
  const { keycloak } = useAuth();
  const [files, setFiles] = useState([]);
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
        setCodeVisible,
        setCodeValue,
        setCodeLanguage,
        codeValue
      );
    },
    [getFileStructure, dragAndDropFile]
  );

  // Set the Chonky icon set
  setChonkyDefaults({ iconComponent: ChonkyIconFA });
  const [folderChain, setFolderChain] = useState(null);

  const fileActions = useMemo(
    () => [
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ChonkyActions.CreateFolder, // Make sure this is included
      ...customActions,
      ChonkyActions.DownloadFiles,
      ChonkyActions.DeleteFiles,
    ],
    []
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

    // Make sure filesTemp is an array before slicing
    if (Array.isArray(filesTemp)) {
      setTotalFilesCount(filesTemp.length);
      setFiles(filesTemp.slice(0, visibleCount));
    } else {
      setFiles([]); // Fallback to an empty array if filesTemp is not valid
    }
  }, [currentFolder, getFileStructure, visibleCount]);

  // Reset visible count when changing folders
  useEffect(() => {
    setVisibleCount(20);
  }, [currentFolder]);

  const loadMoreButton = document.getElementById("load-more-button");

  // After the FullFileBrowser is rendered:
  useEffect(() => {
    const scrollableEl = document.querySelector(".listContainer-0-3-15");
    const fileListWrapper = document.querySelector(".chonky-fileListWrapper");

    if (scrollableEl) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollableEl;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          if (loadMoreButton) loadMoreButton.classList.remove("hidden");
          if (fileListWrapper) fileListWrapper.classList.add("buttom-margin");
        } else {
          if (loadMoreButton) loadMoreButton.classList.add("hidden");
          if (fileListWrapper)
            fileListWrapper.classList.remove("buttom-margin");
        }
      };
      scrollableEl.addEventListener("scroll", handleScroll);

      return () => {
        scrollableEl.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      {fileUploadLoading ? (
        <div
          className="loader-container"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "10px",
            zIndex: "1000",
          }}
        >
          <Loader loader="white" />
        </div>
      ) : (
        <></>
      )}
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        defaultFileViewActionId={ChonkyActions.EnableListView.id}
        fileActions={fileActions}
        onFileAction={handleActionWrapper}
        disableDefaultFileActions={true}
        fileListAdditionalProps={{
          style: { marginBottom: "20px !important" }, // Add extra space at bottom
        }}
      />
    </div>
  );
}
