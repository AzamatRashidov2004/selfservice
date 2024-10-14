// FilesContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import sampleData from "./sampleData.json";

// Define the shape of your context data
interface FileData {
  id: number;
  parent: number;
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
  getFileStructure: (isFileBrowserObject?: boolean) => FileData[] | TreeNode[];
  setFileStructure: (newFilesData: FileData[]) => void;
  dragAndDropFile: (draggedFileId: string, destinationFolderId: string) => void;
  addFolder: (parentId: number, folderName: string) => void; 
  addFiles: (parentId: number, files: File[]) => void; 
  deleteFiles: (ids: number[]) => void; // Add deleteFiles to the context type
  droppableTypes: string[];
  draggableTypes: string[];
  currentFolder: string;
  setCurrentFolder: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with the initial value
const FilesContext = createContext<FilesContextType | undefined>(undefined);

// Function to transform the files data into a file browser structure
const transformData = (inputData: FileData[]): TreeNode[] => {
  const buildTree = (items: FileData[], parentId: number = 0): TreeNode[] => {
    return items
      .filter((item) => item.parent === parentId)
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
export const FilesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const [currentFolder, setCurrentFolder] = useState("0");

  useEffect(() => {
    setFileStructure(sampleData); // Transform and set the initial state
  }, []);

  const getFileStructure = (isFileBrowserObject: boolean = false): FileData[] | TreeNode[] => {
    if (isFileBrowserObject) {
      return transformData(filesData);
    }
    return filesData;
  };

  const setFileStructure = (newFilesData: FileData[]) => {
    setFilesData(newFilesData);
  };

  const dragAndDropFile = (draggedFileId: string, destinationFolderId: string) => {
    const draggedId = parseInt(draggedFileId);
    const destinationId = parseInt(destinationFolderId);

    setFilesData((prevFilesData) => {
      return prevFilesData.map((file) => {
        if (file.id === draggedId) {
          return { ...file, parent: destinationId };
        }
        return file;
      });
    });
  };

  // Function to add a folder
  const addFolder = (parentId: number, folderName: string) => {
    const newId = Math.max(...filesData.map(file => file.id)) + 1;

    // Determine the file type based on the parent ID
    const parentFile = filesData.find(file => file.id === parentId);
    let folderFileType = "folder"; // Default file type

    if (parentId === 0) {
      folderFileType = "project";
    }
    if (parentFile && parentFile.data.fileType === "project") {
      folderFileType = "program"; // If added under a project, set type to program
    }

    const newFolder: FileData = {
      id: newId,
      parent: parentId,
      droppable: true,
      text: folderName,
      data: {
        fileType: folderFileType,
      },
    };

    setFilesData((prevFilesData) => [...prevFilesData, newFolder]);
  };

  // New function to add files
  const addFiles = (parentId: number, files: File[]) => {
    // Create new files based on the input files
    const newFiles = files.map((file, index) => {
      // Extract the base file type (e.g., "pdf" from "application/pdf")
      const fileType = file.type.split('/')[1]; 
  
      return {
        id: Math.max(...filesData.map(f => f.id)) + index + 1, // Assign new unique ID
        parent: parentId, // Set parent to the given parentId
        droppable: false, // Files are not droppable
        text: file.name, // Use the file name for the text
        data: {
          fileType: fileType, // Set the file type from the file object
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`, // Convert file size to string and format
        },
      };
    });
  
    // Update the state with the new files
    setFilesData((prevFilesData) => [...prevFilesData, ...newFiles]);
  };

  // Function to delete files by IDs
  const deleteFiles = (ids: number[]) => {
    setFilesData((prevFilesData) => prevFilesData.filter(file => !ids.includes(file.id)));
  };

  const droppableTypes = ["folder", "project", "program"];
  const draggableTypes = ["text", "xlsx", "pdf", "csv", "program", "folder"];

  const contextValue: FilesContextType = {
    getFileStructure,
    setFileStructure,
    dragAndDropFile,
    addFolder,
    addFiles,
    deleteFiles,
    droppableTypes,
    draggableTypes,
    currentFolder,
    setCurrentFolder,
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
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};
