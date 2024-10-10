// import "./styles.css";
import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { FullFileBrowser, ChonkyActions } from "chonky";
import { useEffect, useState } from "react";
import folderSearch from "./sub-components/folderSearch";
import handleAction from "./sub-components/actionHandler";
import { customActions } from "./sub-components/customActions";
import transformData from "./sub-components/transformData"; // Import transformData
import sampleData from "../File-Tree/sub-components/sampleData.json"; // Load your local JSON data

export default function FileBrowser() {
  
  const handleActionWrapper = (data) => {
    handleAction(data, setCurrentFolder, files);
  };
  console.log("start", sampleData); // This will log the imported data
  setChonkyDefaults({ iconComponent: ChonkyIconFA });

  const [currentFolder, setCurrentFolder] = useState("0");
  const [files, setFiles] = useState(null);
  const [folderChain, setFolderChain] = useState(null);
  const fileActions = [...customActions, ChonkyActions.DownloadFiles];
  
  useEffect(() => {
    let folderChainTemp = [];
    let filesTemp = [];

    // Transform the sampleData using the transformData function
    const transformedData = transformData(sampleData);

    const [found, filesTemp1, folderChainTemp1] = folderSearch(
      transformedData, // Use the transformed data here
      folderChainTemp,
      currentFolder
    );
    if (found) {
      console.log("found", filesTemp1, folderChainTemp1);
      filesTemp = filesTemp1;
      folderChainTemp = folderChainTemp1;
    }
    setFolderChain(folderChainTemp);
    setFiles(filesTemp);
  }, [currentFolder]);

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
