import { ChonkyActions } from "chonky";
import { findFile } from "./folderSearch";

const handleAction = (data, setCurrentFolder, fileContext) => {
  const fileData = fileContext.getFileStructure(true);
  console.log("ACTION", data);

  if (data.id === ChonkyActions.OpenFiles.id) {
    const file = findFile(fileData, data.payload.files[0].id);
    if (file?.isDir) {
      setCurrentFolder(file.id);
    }
  }

  if (data.id === ChonkyActions.EndDragNDrop.id) {
    const { destination, draggedFile } = data.payload;
    fileContext.dragAndDropFile(draggedFile.id, destination.id);
  }

  // Handle Create File custom action
  if (data.id === "create_file") {
    const newFile = {
      id: `file_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
      name: "New File.txt",
      isDir: false,
    };
    fileContext.createFile(newFile, currentFolderIdRef.current); // Add file to the current folder
  }
};

export default handleAction;
