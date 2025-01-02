import { defineFileAction, ChonkyIconName } from "chonky";

const uploadFileAction = defineFileAction({
  id: "upload",
  fileFilter: (file) => file.isDir,
  button: {
    name: "Upload",
    toolbar: true, // Show it in the toolbar
    group: "Actions", // Put it inside the Actions dropdown group
    contextMenu: true, // Also show it in the context menu
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
    name: "Details",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.info, // Fitting icon for a "details" action
  },
});

const editFileAction = defineFileAction({
  id: "edit_file",
  requiresSelection: true,
  button: {
    name: "Open",
    toolbar: false, // No need to show in the toolbar
    contextMenu: true, // Show it in the right-click menu
    icon: ChonkyIconName.openFiles,
  },
});

const createFolderAction = defineFileAction({
  id: "create_folder",
  requiresSelection: false,
  button: {
    name: "New Folder",
    toolbar: true,
    group: "Actions", // Put it in the same dropdown as Download/Delete
    contextMenu: true, // Also show in right-click menu
    icon: ChonkyIconName.folderCreate,
  },
});

const deleteFileOrFolder = defineFileAction({
  id: "delete_files",
  requiresSelection: false,
  button: {
    name: "Delete",
    toolbar: true,
    group: "Actions", // Put it in the same dropdown as Download/Delete
    contextMenu: true, // Also show in right-click menu
    icon: ChonkyIconName.trash,
  },
})

const downloadFile = defineFileAction({
  id: "download_files",
  requiresSelection: false,
  button: {
    name: "Download",
    toolbar: true,
    group: "Actions", // Put it in the same dropdown as Download/Delete
    contextMenu: true, // Also show in right-click menu
    icon: ChonkyIconName.download,
  },
})

export const customActions = [
  uploadFileAction,
  detailsAction,
  downloadFile,
  editFileAction,
  deleteFileOrFolder,
  createFolderAction,
];
