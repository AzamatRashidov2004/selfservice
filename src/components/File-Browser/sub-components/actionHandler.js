import { ChonkyActions } from "chonky";
import { findFile } from "./folderSearch";
import {
  createFolderModalEvent,
  createUploadFileModalEvent,
} from "../../../utility/Modal_Util";

const handleAction = (data, setCurrentFolder, fileContext, currentFolder) => {
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
  if (data.id === "create_folder") {
    createFolderModalEvent((folderName) => {
      fileContext.addFolder(parseInt(currentFolder), folderName);
    });
  }

  // Handle Create File custom action
  if (data.id === "upload") {
    createUploadFileModalEvent((files) => {
      fileContext.addFiles(parseInt(currentFolder), files);
    });
  }
};

export default handleAction;
