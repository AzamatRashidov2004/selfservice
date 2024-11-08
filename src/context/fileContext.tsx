// FilesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { kronosKnowledgeBaseType, projectFetchReturn } from "../utility/types";
// import sampleData from "./sampleData.json";

// Define the shape of your context data
interface FileData {
  id: number;
  parent: number;
  kronosKB_id: string | null;
  kronosProjectId: string | null;
  droppable: boolean;
  text: string;
  data: {
    fileType: string;
    fileSize?: string; // Optional for folders
  };
}

// Define the structure for tree nodes
interface TreeNode {
  id: string;
  name: string;
  isDir: boolean;
  files: TreeNode[]; // Children nodes
}

interface FilesContextType {
  setProjectsContext: (projects: projectFetchReturn[]) => void;
  getFileStructure: (isFileBrowserObject?: boolean) => FileData[] | TreeNode[];
  setFileStructure: (newFilesData: FileData[]) => void;
  dragAndDropFile: (
    destinationFolderId: string,
    selectedFilse: { id: string }[]
  ) => void;
  addFolder: (parentId: number, folderName: string) => void;
  addFiles: (
    parentId: number,
    files: File[],
    project_id: string,
    kb_ids: kronosKnowledgeBaseType[]
  ) => void;
  deleteFiles: (ids: number[]) => void; // Add deleteFiles to the context type
  getAllChildren: (nodeId: number) => FileData[];
  droppableTypes: string[];
  draggableTypes: string[];
  getDepth: (nodeId: number) => number;
  currentFolder: string;
  getPathFromProject: (nodeId: number) => string;
  getProjectForNode: (nodeId: number) => FileData | undefined;
  getNodeInfo: (nodeId: number) => FileData | undefined;
  setCurrentFolder: React.Dispatch<React.SetStateAction<string>>;
  fileUploadLoading: boolean;
  setFileUploadLoading: React.Dispatch<React.SetStateAction<boolean>>;
  pdfUrl: string;
  pdfVisible: boolean;
  setPdfVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPdfUrl: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with the initial value
const FilesContext = createContext<FilesContextType | undefined>(undefined);

// Function to transform the files data into a file browser structure
const transformData = (inputData: FileData[]): TreeNode[] => {
  const buildTree = (items: FileData[], parentId: number = 0): TreeNode[] => {
    return items
      .filter((item) => item.parent === parentId)
      .sort((a, b) => a.text.localeCompare(b.text))
      .map((item) => ({
        id: item.id.toString(),
        name: item.text,
        isDir: item.droppable,
        files: buildTree(items, item.id), // Recursively build files
      }));
  };

  return [
    {
      id: "0",
      name: "Root",
      isDir: true,
      files: buildTree(inputData),
    },
  ];
};

// Create a provider component
export const FilesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [currentFolder, setCurrentFolder] = useState("0");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfVisible, setPdfVisible] = useState<boolean>(false);

  useEffect(() => {
    setFileStructure([]); // Transform and set the initial state
  }, []);

  function extractFoldersAndFile(path: string): {
    folders: string[];
    file: string;
  } {
    // Split the input path by the "/" delimiter
    const parts = path.split("/");

    // The file will always be the last part of the array
    const file = parts.pop() || ""; // Ensure we don't get undefined, fallback to an empty string

    // The remaining parts will be the folders
    const folders = parts;

    return { folders, file };
  }

  function findFolderByName(
    newFileStructure: FileData[],
    parentId: number,
    targetFolder: string
  ): number | null {
    // Find a folder that matches the parentId and the targetFolder name
    const folder = newFileStructure.find(
      (file) =>
        file.parent === parentId &&
        file.droppable && // Ensure it's a folder (droppable should be true for folders)
        file.text === targetFolder
    );

    // If folder is found, return its id, else return null
    return folder ? folder.id : null;
  }

  function handleSourceFile(
    data: { source_file: string; _id: string; project_id: string },
    projectFileStructureId: number,
    newFileStructure: FileData[],
    ids: number
  ): { ids: number; newFileStructure: FileData[] } {
    const { folders, file } = extractFoldersAndFile(data.source_file);

    if (folders) {
      let lastFolderId = 0;

      for (let index = 0; index < folders.length; index++) {
        const folder = folders[index];
        const parentId = index === 0 ? projectFileStructureId : lastFolderId;

        const folderExists: number | null = findFolderByName(
          newFileStructure,
          parentId,
          folder
        );

        if (folderExists) {
          lastFolderId = folderExists;
        } else {
          newFileStructure.push({
            droppable: true,
            id: ids,
            parent: parentId,
            text: folder,
            data: { fileType: "folder" },
            kronosKB_id: null,
            kronosProjectId: null,
          });
          lastFolderId = ids;
          ids += 1;
        }
      }

      const fileParentId =
        lastFolderId !== 0 ? lastFolderId : projectFileStructureId;
      newFileStructure.push({
        droppable: false,
        id: ids,
        parent: fileParentId,
        text: file,
        data: { fileType: file.split(".")[file.split(".").length - 1] }, // Extract file extension
        kronosKB_id: data._id,
        kronosProjectId: data.project_id,
      });
      ids += 1;
    }

    return { ids, newFileStructure };
  }

  const setProjectsContext = (projects: projectFetchReturn[]) => {
    if (projects.length === 0) return;
    let ids = 1;
    let newFileStructure: FileData[] = [];
    projects.forEach((currentProject) => {
      const project = currentProject.project;
      const projectData = currentProject.projectData;
      const projectText =
        project.name && project.name.trim() !== "" ? project.name : project._id;
      const projectFileStructureId = ids;

      // Add project folder
      newFileStructure.push({
        droppable: true,
        id: ids,
        parent: 0,
        text: projectText,
        data: { fileType: "project" },
        kronosKB_id: project._id,
        kronosProjectId: project._id,
      });
      ids += 1;

      // Handle project data
      projectData.forEach((data) => {
        const result = handleSourceFile(
          data,
          projectFileStructureId,
          newFileStructure,
          ids
        );
        ids = result.ids;
        newFileStructure = result.newFileStructure;
      });
    });

    setFileStructure(newFileStructure);
  };

  const getFileStructure = (
    isFileBrowserObject: boolean = false
  ): FileData[] | TreeNode[] => {
    if (isFileBrowserObject) {
      return transformData(filesData);
    }
    return filesData;
  };

  const getDepth = (nodeId: number): number => {
    const nodeInfo = getNodeInfo(nodeId);
    let parentId = nodeInfo?.parent;
    let depth = 0;
    while (parentId && parentId !== 0) {
      depth += 1;
      parentId = getNodeInfo(parentId)?.parent;
    }
    return depth;
  };

  const setFileStructure = (newFilesData: FileData[]) => {
    setFilesData(newFilesData);
  };

  const getNodeInfo = (nodeId: number) => {
    return filesData.find((file) => file.id === nodeId);
  };

  const getAllChildren = (nodeId: number): FileData[] => {
    // Helper function to recursively gather children
    const findChildren = (
      parentId: number,
      allFiles: FileData[]
    ): FileData[] => {
      const children = allFiles.filter((file) => file.parent === parentId);

      // Recursively find each child's children and append them to the result
      return children.reduce((acc, child) => {
        return [...acc, child, ...findChildren(child.id, allFiles)];
      }, [] as FileData[]);
    };

    // Start with the given nodeId and recursively gather its children
    return findChildren(nodeId, filesData);
  };

  const getProjectForNode = (nodeId: number): FileData | undefined => {
    const findParent = (currentId: number): FileData | undefined => {
      const currentNode = filesData.find((file) => file.id === currentId);

      if (!currentNode) return undefined; // Stop if node doesn't exist

      // Stop if the current node is a "project" and return it
      if (currentNode.data.fileType === "project") {
        return currentNode;
      }

      // Recur to the parent node
      return findParent(currentNode.parent);
    };

    // Start the recursive parent search from the given nodeId
    return findParent(nodeId);
  };

  const dragAndDropFile = (
    destinationFolderId: string,
    selectedFiles: { id: string }[]
  ) => {
    const destinationId = parseInt(destinationFolderId);

    setFilesData((prevFilesData) => {
      return prevFilesData.map((file) => {
        // Check if the file is in the selectedFiles array
        if (
          selectedFiles.some(
            (selectedFile) => parseInt(selectedFile.id) === file.id
          )
        ) {
          // If it is, return a new object with the updated parent
          return { ...file, parent: destinationId };
        }
        return file; // Return the file unchanged if it's not selected
      });
    });
  };

  // Function to add a folder
  const addFolder = (parentId: number, folderName: string) => {
    const newId = Math.max(...filesData.map((file) => file.id)) + 1;

    // Determine the file type based on the parent ID
    const parentFile = filesData.find((file) => file.id === parentId);
    let folderFileType = "folder"; // Default file type

    if (parentId === 0) {
      folderFileType = "project";
    }
    if (parentFile && parentFile.data.fileType === "project") {
      folderFileType = "folder"; // If added under a project, set type to program
    }

    const newFolder: FileData = {
      id: newId,
      parent: parentId,
      droppable: true,
      text: folderName,
      data: {
        fileType: folderFileType,
      },
      kronosKB_id: null,
      kronosProjectId: null,
    };

    setFilesData((prevFilesData) => [...prevFilesData, newFolder]);
  };

  // New function to add files
  const addFiles = (
    parentId: number,
    files: File[],
    project_id: string,
    kb_ids: kronosKnowledgeBaseType[]
  ) => {
    // Create new files based on the input files
    const newFiles = files.map((file, index) => {
      // Extract the base file type (e.g., "pdf" from "application/pdf")
      const fileType = file.type.split("/")[1];
      const path = getPathFromProject(parentId);

      return {
        id: Math.max(...filesData.map((f) => f.id)) + index + 1, // Assign new unique ID
        parent: parentId, // Set parent to the given parentId
        droppable: false, // Files are not droppable
        text: file.name, // Use the file name for the text
        data: {
          fileType: fileType, // Set the file type from the file object
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`, // Convert file size to string and format
        },
        kronosKB_id: kb_ids[index]._id, // TODO when adding files add here the
        kronosProjectId: project_id,
        source_file: path + file.name,
      };
    });

    // Update the state with the new files
    setFilesData((prevFilesData) => [...prevFilesData, ...newFiles]);
  };

  const getPathFromProject = (nodeId: number): string => {
    const path: string[] = [];
    let targetNode: FileData | undefined;

    const findParent = (currentId: number): FileData | undefined => {
      const currentNode = filesData.find((file) => file.id === currentId);

      if (!currentNode) return undefined; // Stop if node doesn't exist

      // Stop if the current node is a "project", but don't add it to the path
      if (currentNode.data.fileType === "project") {
        return currentNode;
      }

      // Add current node's name to the path (we add it in reverse order)
      path.push(currentNode.text);

      // Keep track of the target node
      if (!targetNode) {
        targetNode = currentNode;
      }

      // Recur to the parent node
      return findParent(currentNode.parent);
    };

    // Start the recursive parent search from the given nodeId
    findParent(nodeId);

    // Check if the target node is a file or folder
    const isFolder = targetNode?.droppable;

    // Return the constructed path, joined by "/", and append "/" only if it's a folder
    return path.reverse().join("/") + (isFolder ? "/" : "");
  };

  // Function to delete files by IDs
  const deleteFiles = (ids: number[]) => {
    setFilesData((prevFilesData) =>
      prevFilesData.filter((file) => !ids.includes(file.id))
    );
  };

  const droppableTypes = ["folder", "project", "program"];
  const draggableTypes = ["text", "xlsx", "pdf", "csv", "program", "folder"];
  const [fileUploadLoading, setFileUploadLoading] = useState<boolean>(false);
  /*const [files, setFiles] = useState(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const incrementVisibleCount = () => {
    setVisibleCount((prev) => prev + 1);
  };
  const [totalFilesCount, setTotalFilesCount] = useState(0);*/

  const contextValue: FilesContextType = {
    setProjectsContext,
    getFileStructure,
    setFileStructure,
    dragAndDropFile,
    getProjectForNode,
    getPathFromProject,
    getAllChildren,
    addFolder,
    getNodeInfo,
    getDepth,
    addFiles,
    deleteFiles,
    droppableTypes,
    draggableTypes,
    currentFolder,
    setCurrentFolder,
    fileUploadLoading,
    setFileUploadLoading,
    pdfUrl,
    pdfVisible,
    setPdfVisible,
    setPdfUrl,
  };

  return (
    <FilesContext.Provider value={contextValue}>
      {children}
    </FilesContext.Provider>
  );
};

// Custom hook to use the FilesContext
export const useFiles = (): FilesContextType => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};
