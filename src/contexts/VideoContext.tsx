import React, { createContext, useContext, useState } from 'react';
import { VideoFile } from "../models/VideoFile";

interface VideoContextType {
    videos: VideoFile[];
    setVideos: React.Dispatch<React.SetStateAction<VideoFile[]>>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
    const [videos, setVideos] = useState<VideoFile[]>([]);

    return (
        <VideoContext.Provider value={{ videos, setVideos }}>
            {children}
        </VideoContext.Provider>
    );
}

export function useVideo() {
    const context = useContext(VideoContext);
    if (context === undefined) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
} 