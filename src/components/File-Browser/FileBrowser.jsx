import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FullFileBrowser, ChonkyActions } from "chonky";
import { useEffect, useState } from "react";
import folderSearch from "./sub-components/folderSearch";
import handleAction from "./sub-components/actionHandler";
import { customActions } from "./sub-components/customActions";
import { useFiles } from "../../context/fileContext"; // Import the useFiles hook

export default function FileBrowser() {
  const { getFileStructure, dragFromFileBrowser } = useFiles(); // Get the context function
  const handleActionWrapper = (data) => {
    handleAction(data, setCurrentFolder, {getFileStructure, dragFromFileBrowser});
  };

  setChonkyDefaults({ iconComponent: ChonkyIconFA });

  const [currentFolder, setCurrentFolder] = useState("0");
  const [files, setFiles] = useState(null);
  const [folderChain, setFolderChain] = useState(null);
  const fileActions = [...customActions, ChonkyActions.DownloadFiles];

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
  }, [currentFolder, getFileStructure]); // Depend on currentFolder and getFileStructure

  return (
    <div className="App">
      <h1>Chonky example</h1>
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
