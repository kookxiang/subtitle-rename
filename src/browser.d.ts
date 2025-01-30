interface FileSystemFileHandle {
    move(newPath: string): Promise<void>;
} 