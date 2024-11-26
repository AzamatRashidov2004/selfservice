import { defineFileAction, ChonkyIconName } from "chonky";

const uploadFileAction = defineFileAction({
  id: "upload",
  fileFilter: (file) => file.isDir,
  button: {
    name: "Upload Files",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.upload,
  },
});

const detailsAction = defineFileAction({
  id: "details",
  fileFilter: (file, fileMap) => {
    // Only show if we are inside a folder and not at the root level
    const currentFolder = fileMap[file.id];
    return currentFolder && currentFolder.parentId !== null; // parentId !== null ensures not in root
  },
  button: {
    name: "View Details",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.info, // Fitting icon for a "details" action
  },
});

export const customActions = [uploadFileAction, detailsAction];
