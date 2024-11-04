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

export const customActions = [uploadFileAction];
