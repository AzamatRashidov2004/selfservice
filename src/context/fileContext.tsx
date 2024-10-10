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
}

// Create the context with the initial value
const FilesContext = createContext<FilesContextType | undefined>(undefined);

// Function to transform the files data into a file browser structure
const transformData = (inputData: FileData[]): TreeNode[] => {
  // Helper function to build the tree structure
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

  // Create the root node
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

  useEffect(() => {
    setFileStructure(sampleData); // Transform and set the initial state
  }, []);

  // Function to get the file structure
  const getFileStructure = (isFileBrowserObject: boolean = false): FileData[] | TreeNode[] => {
    if (isFileBrowserObject) {
      return transformData(filesData); // Transform to file browser object
    }
    return filesData; // Return original files data
  };

  // Function to set the file structure
  const setFileStructure = (newFilesData: FileData[]) => {
    setFilesData(newFilesData); // Update files data
  };

  // Function to handle drag-and-drop changes
  const dragAndDropFile = (draggedFileId: string, destinationFolderId: string) => {
    console.log("here")
    // Convert IDs to numbers as the filesData uses numeric IDs
    const draggedId = parseInt(draggedFileId);
    const destinationId = parseInt(destinationFolderId);

    setFilesData((prevFilesData) => {
      return prevFilesData.map((file) => {
        // Update the parent of the dragged file to the destination folder
        if (file.id === draggedId) {
          return { ...file, parent: destinationId };
        }
        return file;
      });
    });
  };

  const contextValue: FilesContextType = {
    getFileStructure,
    setFileStructure,
    dragAndDropFile,
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
