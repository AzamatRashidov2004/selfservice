import { defineFileAction, ChonkyIconName } from "chonky";
import { ChonkyActions } from "chonky";

const uploadFileAction = (showContext) => {return defineFileAction({
    id: "upload",
    fileFilter: (file) => file.isDir,
    button: {
      name: "Upload",
      toolbar: true, // Show it in the toolbar
      contextMenu: showContext, // Also show it in the context menu
      icon: ChonkyIconName.upload,
    },
  });
}

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
    contextMenu: false,
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

const createFolderAction = (showContext) => {return defineFileAction({
    id: "create_folder",
    requiresSelection: false,
    button: {
      name: "New Folder",
      toolbar: true,
      contextMenu: showContext, // Also show in right-click menu
      icon: ChonkyIconName.folderCreate,
    },
  });
}

const deleteFileOrFolder = defineFileAction({
  id: "delete_files",
  requiresSelection: false,
  button: {
    name: "Delete",
    toolbar: false,
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
    toolbar: false,
    group: "Actions",
    contextMenu: true, // Also show in right-click menu
    icon: ChonkyIconName.download,
  },
})

const ClearSelection = defineFileAction({
  id: "clear_selection",
  requiresSelection: true,
  button: {
    name: "Clear",
    toolbar: false,
    group: "Actions",
    contextMenu: true, // Also show in right-click menu
    icon: ChonkyIconName.download,
  },
})

export const getCustomActions = (selectedFiles) => {
  const customActions = [detailsAction];

  const isEmpty = selectedFiles.length === 0;
  const isSingle = selectedFiles.length === 1;
  const hasDir = selectedFiles.some(item => item.isDir === true);

  if (!isEmpty){
    customActions.push(editFileAction);
    customActions.push(deleteFileOrFolder);
    customActions.push(createFolderAction(false));
    customActions.push(uploadFileAction(false));
  }

  if (isEmpty){
    customActions.push(createFolderAction(true));
    customActions.push(uploadFileAction(true));
  }

  if (isSingle && !hasDir){
    customActions.push(downloadFile)
  }

  if (!isEmpty){ // Duplicate if, clear selection should always be at the last spot
    customActions.push({
      ...ChonkyActions.ClearSelection, 
      ...{button: {...ChonkyActions.ClearSelection.button, group: null, toolbar: false, name: "Deselect"}}
    });
  }

  return customActions;
}

export const customActions = getCustomActions([]);
