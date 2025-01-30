import React, { createContext, useCallback, useContext, useState } from 'react';

interface DirectoryContextType {
    folder: FileSystemDirectoryHandle | null;
    setFolder: (folder: FileSystemDirectoryHandle | null) => Promise<void>;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
    const [folder, setFolderState] = useState<FileSystemDirectoryHandle | null>(null);

    const setFolder = useCallback(async (newFolder: FileSystemDirectoryHandle | null) => {
        if (newFolder) {
            // 申请读写权限
            const permission = await newFolder.requestPermission({
                mode: 'readwrite'
            });
            
            if (permission !== 'granted') {
                alert('需要文件夹的读写权限才能继续操作');
                throw new Error('no permission');
            }
        }
        setFolderState(newFolder);
    }, [setFolderState]);

    return (
        <DirectoryContext.Provider value={{ folder, setFolder }}>
            {children}
        </DirectoryContext.Provider>
    );
}

export function useDirectory() {
    const context = useContext(DirectoryContext);
    if (context === undefined) {
        throw new Error('useDirectory must be used within a DirectoryProvider');
    }
    return context;
}