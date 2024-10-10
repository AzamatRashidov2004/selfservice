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
    fileContext.dragFromFileBrowser(draggedFile.id, destination.id);
  }
};

export default handleAction;
