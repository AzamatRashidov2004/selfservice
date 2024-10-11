import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FullFileBrowser, ChonkyActions } from "chonky";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import folderSearch from "./sub-components/folderSearch";
import handleAction from "./sub-components/actionHandler";
import { customActions } from "./sub-components/customActions";
import { useFiles } from "../../context/fileContext"; // Import the useFiles hook

export default function FileBrowser() {
  const { getFileStructure, dragAndDropFile } = useFiles(); // Get the context function

  // Handle actions such as opening files, switching views, etc.
  const handleActionWrapper = useCallback(
    (data) => {
      handleAction(data, setCurrentFolder, { getFileStructure, dragAndDropFile });
    },
    [getFileStructure, dragAndDropFile]
  );

  // Set the Chonky icon set
  setChonkyDefaults({ iconComponent: ChonkyIconFA });

  const [currentFolder, setCurrentFolder] = useState("0");
  const [files, setFiles] = useState(null);
  const [folderChain, setFolderChain] = useState(null);
  
  // Setup ref for folder ID
  const currentFolderIdRef = useRef(currentFolder);

  const resetFileMap = useCallback(() => {
    setCurrentFolder("0"); // Reset to the root folder (or any default value)
  }, []);

  const fileActions = useMemo(() => [
    ChonkyActions.EnableListView,
    ChonkyActions.EnableGridView,
    ChonkyActions.CreateFolder,  // Make sure this is included
    ...customActions,
    ChonkyActions.DownloadFiles,
    ChonkyActions.DeleteFiles,
], []);

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
    <>
      <div style={{ width: "1300px", height: "400px" }}>
        <FullFileBrowser
          files={files}
          folderChain={folderChain}
          defaultFileViewActionId={ChonkyActions.EnableListView.id}
          fileActions={fileActions}
          onFileAction={handleActionWrapper}
          disableDefaultFileActions={true}
        />
      </div>
    </>
  );
}