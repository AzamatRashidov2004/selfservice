import { defineFileAction, ChonkyIconName } from 'chonky';
import { ChonkyActions } from 'chonky';
import customActionNames from '../../../utility/customActionNames';
import RocketIcon from '@mui/icons-material/Rocket';

const uploadFileAction = (showContext) => {
  return defineFileAction({
    id: 'upload_file',
    fileFilter: (file) => file.isDir,
    button: {
      name: customActionNames.upload_file,
      toolbar: true, // Show it in the toolbar
      contextMenu: showContext, // Also show it in the context menu
      icon: ChonkyIconName.upload,
    },
  });
};

const uploadFolderAction = (showContext) => {
  return defineFileAction({
    id: 'upload_folder',
    fileFilter: (file) => file.isDir,
    button: {
      name: customActionNames.upload_folder,
      toolbar: true, // Show it in the toolbar
      contextMenu: showContext, // Also show it in the context menu
      icon: ChonkyIconName.upload,
    },
  });
};

const launchProjectAction = (showContext) => {
  return defineFileAction({
    id: 'launch',
    button: {
      name: customActionNames.launch,
      contextMenu: showContext,
      icon: ChonkyIconName.symlink,
    },
  });
};

const deleteProjectAction = (showContext) => {
  return defineFileAction({
    id: 'delete',
    button: {
      name: customActionNames.delete,
      contextMenu: showContext,
      icon: ChonkyIconName.trash,
    },
  });
};

const renameFolderAction = (showContext) => {
  return defineFileAction({
    id: 'rename',
    button: {
      name: customActionNames.rename,
      contextMenu: showContext,
      icon: ChonkyIconName.text,
    },
  });
};

const editProjectAction = (showContext) => {
  return defineFileAction({
    id: 'edit',
    button: {
      name: customActionNames.edit,
      contextMenu: showContext,
      icon: ChonkyIconName.config,
    },
  });
};

const detailsAction = (context = false) => {
  return defineFileAction({
    id: 'custom_details',
    fileFilter: (file, fileMap) => {
      // Only show if we are inside a folder and not at the root level
      const currentFolder = fileMap[file.id];
      return currentFolder && currentFolder.parentId !== null; // parentId !== null ensures not in root
    },
    button: {
      name: customActionNames.details,
      toolbar: true,
      contextMenu: context,
      icon: ChonkyIconName.info, // Fitting icon for a "details" action
    },
  });
};

const editFileAction = defineFileAction({
  id: 'edit_file',
  requiresSelection: true,
  button: {
    name: customActionNames.open,
    toolbar: false, // No need to show in the toolbar
    contextMenu: true, // Show it in the right-click menu
    icon: ChonkyIconName.openFiles,
  },
});

const createFolderAction = (showContext) => {
  return defineFileAction({
    id: 'create_folder',
    requiresSelection: false,
    button: {
      name: customActionNames.newFolder,
      toolbar: true,
      contextMenu: showContext, // Also show in right-click menu
      icon: ChonkyIconName.folderCreate,
    },
  });
};

const deleteFileOrFolder = defineFileAction({
  id: 'delete_files',
  requiresSelection: false,
  button: {
    name: customActionNames.delete,
    toolbar: false,
    group: 'Actions', // Put it in the same dropdown as Download/Delete
    contextMenu: true, // Also show in right-click menu
    icon: ChonkyIconName.trash,
  },
});

const downloadFile = defineFileAction({
  id: 'download_files',
  requiresSelection: false,
  button: {
    name: customActionNames.download,
    toolbar: false,
    group: 'Actions',
    contextMenu: true, // Also show in right-click menu
    icon: ChonkyIconName.download,
  },
});

export const getCustomActions = (selectedFiles, firstNodeInfo = null) => {
  const customActions = [];

  const isEmpty = selectedFiles.length === 0;
  const isSingle = selectedFiles.length === 1;
  const isProject = isSingle && firstNodeInfo && firstNodeInfo.parent === 0;
  const hasDir = selectedFiles.some((item) => item.isDir === true);
  const isSubfolder = isSingle && hasDir && firstNodeInfo && firstNodeInfo.parent !== 0;
  if (isSubfolder) {
    // Example: add a "Rename Folder" action for subfolders
    customActions.unshift(renameFolderAction(true));
  }
  if (isEmpty || (hasDir && isSingle)) {
    // If selection is empty or is a single folder
    customActions.push(createFolderAction(true));
    customActions.push(uploadFileAction(true));
    customActions.push(uploadFolderAction(true));
  }

  if (!isEmpty && !hasDir) {
    // The selection is not empty and is not a dir (so it is a file)
    customActions.push(editFileAction);
  }

  if (isSingle && !hasDir) {
    // If not a dir and a single file
    customActions.push(downloadFile);
  }

  if (!isEmpty && !isProject) {
    // The selection is not empty and not a project so it can be deleted
    customActions.push(deleteFileOrFolder);
  }

  if (!isEmpty) {
    // Duplicate to put clear folder to end
    customActions.push({
      ...ChonkyActions.ClearSelection,
      ...{
        button: {
          ...ChonkyActions.ClearSelection.button,
          group: null,
          toolbar: true,
          contextMenu: false,
          name: customActionNames.clearSelection,
        },
      },
    });
  }
  console.log(firstNodeInfo);
  if (isProject) {

    // If it is a project launch or show details
    customActions.unshift(deleteProjectAction(true));
    customActions.push(detailsAction(true));

    customActions.unshift(editProjectAction(true));


    // If it is a project launch or show details
    customActions.unshift(launchProjectAction(true));



  } 
  else {
    customActions.push(detailsAction(false));
  }
  return customActions;
};

export const customActions = getCustomActions([]);
