import { ChonkyActions } from "chonky";
import { findFile } from "./folderSearch";

const handleAction = (data, setCurrentFolder, files) => {
  console.log("DATA", data);
  console.log("FILES", files);
  if (data.id === ChonkyActions.OpenFiles.id) {
    const file = findFile(files, data.payload.files[0].id);
    if (file?.isDir) {
      console.log("fileid", file.id);
      setCurrentFolder(file.id);
    }
  }
};

export default handleAction;
