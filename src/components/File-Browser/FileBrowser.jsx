import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FullFileBrowser, ChonkyActions } from "chonky";
import Loader from "../Loader/Loader";
import "./FileBrowser.css"
import {
  useEffect,
  useState,
  useCallback,
} from "react";
import folderSearch from "./sub-components/folderSearch";
import handleAction from "./sub-components/actionHandler";
import { customActions, getCustomActions } from "./sub-components/customActions";
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
    pdfVisible,
    pdfUrl,
    setPdfUrl,
    setCodeVisible,
    setCodeValue,
    setCodeLanguage,
    codeValue,
    setCurrentProjectId,
  } = useFiles(); // Get the context function
  const { keycloak } = useAuth();

  // Handle actions such as opening files, switching views, etc.
  const handleActionWrapper = useCallback(
    (data) => {
      console.log(data.state.selectedFiles);
      if (data.id === "change_selection") {
        setFileActions([
          ChonkyActions.EnableListView,
          ChonkyActions.EnableGridView,
          ...getCustomActions(data.state.selectedFiles),
        ])
      }
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
        setCurrentProjectId
      );
    },
    [getFileStructure, dragAndDropFile]
  );

  // Set the Chonky icon set
  setChonkyDefaults({ iconComponent: ChonkyIconFA });
  const [files, setFiles] = useState(null);
  const [folderChain, setFolderChain] = useState(null);
  const [fileActions, setFileActions] = useState(
    [
      ChonkyActions.EnableListView,
      ChonkyActions.EnableGridView,
      ...customActions
    ]);

  // const fileActions = useMemo(
  //   () => [
  //     ChonkyActions.EnableListView,
  //     ChonkyActions.EnableGridView,
  //     ...customActions
  //   ],
  //   []
  // );

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
    setFiles(filesTemp);
  }, [currentFolder, getFileStructure]);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      {fileUploadLoading ? (
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
      />
    </div>
  );
}
