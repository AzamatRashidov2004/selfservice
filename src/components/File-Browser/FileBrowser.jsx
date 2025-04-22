import { setChonkyDefaults } from "chonky";
import PropTypes from "prop-types";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FullFileBrowser, ChonkyActions } from "chonky";
import Loader from "../Loader/Loader";
import "./FileBrowser.css";
import { useEffect, useState, useCallback, useRef } from "react";
import folderSearch from "./sub-components/folderSearch";
import handleAction from "./sub-components/actionHandler";
import { customActions } from "./sub-components/customActions";
import { useFiles } from "../../context/fileContext"; // Import the useFiles hook
import { useAuth } from "../../context/authContext";
import "./FileBrowser.css";
import { clearSelection } from "../../utility/chonkyActionCalls";
import { useNavigate } from "react-router-dom";

export default function FileBrowser({
  setDetailsOpen,
  setSelectedProjectData,
}) {
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
    current_project_id,
    setCurrentProjectId,
    currentBotConfig,
    setCurrentBotConfig
  } = useFiles(); // Get the context function
  const { keycloak } = useAuth();
  const [files, setFiles] = useState([]);
  const chonkyRef = useRef(null);
  const navigate = useNavigate();
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
        codeValue,
        setCurrentProjectId,
        setFileActions,
        setDetailsOpen,
        setSelectedProjectData,
        current_project_id,
        currentBotConfig,
        setCurrentBotConfig,
        navigate
      );
    },
    [getFileStructure, dragAndDropFile, navigate]
  );

  // Set the Chonky icon set
  setChonkyDefaults({ iconComponent: ChonkyIconFA });
  const [folderChain, setFolderChain] = useState(null);
  const [fileActions, setFileActions] = useState([
    ChonkyActions.EnableListView,
    ChonkyActions.EnableGridView,
    ChonkyActions.OpenFileContextMenu,
    ...customActions,
  ]);

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
  loadMoreButton?.classList.add("hidden");

  // After the FullFileBrowser is rendered:
  useEffect(() => {
    var scrollableEl;
    document.querySelectorAll("div").forEach((div) => {
      if ([...div.classList].some((cls) => cls.includes("listContainer"))) {
        scrollableEl = div;
      }
    });

    console.log("the scrollableEl is: ", scrollableEl);
    const fileListWrapper = document.querySelector(".chonky-fileListWrapper");

    if (scrollableEl) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollableEl;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
          if (visibleCount < totalFilesCount) {
            if (loadMoreButton) loadMoreButton.classList.remove("hidden");
          }
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
  }, [visibleCount, files]);

  useEffect(() => {
    const handleClick = (event) => {
      if (chonkyRef.current && chonkyRef.current.contains(event.target)) {
        const isFileClicked = event.target.closest("[data-chonky-file-id]");
        if (!isFileClicked) {
          clearSelection();
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={chonkyRef}
      style={{ width: "100%", height: "100% !important" }}
      className="chonkyWrapperChild"
    >
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
          <Loader loader="white" loaderText="Uploading File" />
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
          style: { marginBottom: "28px !important" }, // Add extra space at bottom
        }}
      />
    </div>
  );
}

FileBrowser.propTypes = {
  setDetailsOpen: PropTypes.func.isRequired,
};
