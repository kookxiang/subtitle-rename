import React, { createContext, useCallback, useContext, useState } from 'react';
import { SubtitleFile } from '../models/SubtitleFile';
import { useVideo } from '../contexts/VideoContext';
import { sortByEpisode } from '../utils/sort';

interface SubtitleContextType {
    subtitles: SubtitleFile[];
    setSubtitles: React.Dispatch<React.SetStateAction<SubtitleFile[]>>;
    addSubtitle: (file: FileSystemFileHandle) => void;
}

const SubtitleContext = createContext<SubtitleContextType | undefined>(undefined);

export function SubtitleProvider({ children }: { children: React.ReactNode }) {
    const [subtitles, setSubtitles] = useState<SubtitleFile[]>([]);
    const { videos } = useVideo();

    const addSubtitle = useCallback(async (file: FileSystemFileHandle) => {
        const subtitle = new SubtitleFile(file);
        setSubtitles(prev => sortByEpisode([...prev, subtitle]));
    }, [videos, setSubtitles]);

    return (
        <SubtitleContext.Provider value={{ subtitles, setSubtitles, addSubtitle }}>
            {children}
        </SubtitleContext.Provider>
    );
}

export function useSubtitle() {
    const context = useContext(SubtitleContext);
    if (context === undefined) {
        throw new Error('useSubtitle must be used within a SubtitleProvider');
    }
    return context;
} 