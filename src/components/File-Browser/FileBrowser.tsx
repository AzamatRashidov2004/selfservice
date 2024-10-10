import React, { useEffect, useState } from 'react';
import { FullFileBrowser, FileData, ChonkyActions, setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import initialFilesData from './example-json.json'; // Ensure the path is correct

const FileBrowser: React.FC = () => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string>('qwerty123456'); // Set root folder ID
    const [folderChain, setFolderChain] = useState<FileData[]>([]); // Track folder chain

    // Set Chonky defaults
    setChonkyDefaults({ iconComponent: ChonkyIconFA });

    // Load files from the JSON data
    useEffect(() => {
        // Transform fileMap into an array of FileData
        const transformedFiles: FileData[] = Object.values(initialFilesData.fileMap).map(file => {
            if (!file) return null;
            return {
                id: file.id,
                name: file.name,
                isDir: file.isDir,
                parentId: file.parentId,
                childrenIds: file.childrenIds,
                modDate: file.modDate,
                size: file.size,
                thumbnailUrl: file.thumbnailUrl,
            };
        }).filter(Boolean) as FileData[]; // Remove null values

        setFiles(transformedFiles);
    }, []);

    useEffect(() => {
        // Function to find the current folder and its chain
        const updateFolderChain = (currentId: string) => {
            const chain: FileData[] = [];
            const findFolder = (folder: FileData): boolean => {
                if (folder.id === currentId) {
                    chain.push(folder);
                    return true;
                }
                if (folder.childrenIds) {
                    for (const childId of folder.childrenIds) {
                        const childFolder = files.find(f => f.id === childId);
                        if (childFolder && findFolder(childFolder)) {
                            chain.unshift(folder); // Add current folder to the chain
                            return true;
                        }
                    }
                }
                return false;
            };
            const rootFolder = files.find(file => file.id === currentId);
            if (rootFolder) {
                findFolder(rootFolder);
            }
            setFolderChain(chain);
        };

        updateFolderChain(currentFolder);
    }, [currentFolder, files]);

    // Your Chonky file browser component here
    return (
        <div>
            <FullFileBrowser
                files={files}
                folderChain={folderChain}
                onFolderOpen={folder => setCurrentFolder(folder.id)}
            />
        </div>
    );
};

export default FileBrowser;
