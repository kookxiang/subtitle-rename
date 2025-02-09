import React, { createContext, useCallback, useContext, useState } from 'react';

interface DirectoryContextType {
    folder: FileSystemDirectoryHandle | null;
    setFolder: (folder: FileSystemDirectoryHandle | null) => void;
}

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
    const [folder, setFolderState] = useState<FileSystemDirectoryHandle | null>(null);

    const setFolder = useCallback((newFolder: FileSystemDirectoryHandle | null) => {
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