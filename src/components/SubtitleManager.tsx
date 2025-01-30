import { useCallback, useState } from 'react';
import { useSubtitle } from '../contexts/SubtitleContext';
import { useVideo } from '../contexts/VideoContext';
import { sortByEpisode } from '../utils/sort';
import './SubtitleManager.css';
import { SubtitleFile } from '../models/SubtitleFile';
import { Toast } from './Toast';

export function SubtitleManager() {
    const { subtitles, setSubtitles, addSubtitle } = useSubtitle();
    const { videos } = useVideo();
    const [isDragOver, setIsDragOver] = useState(false);

    const handleSelectFiles = useCallback(async () => {
        const fileHandles = await window.showOpenFilePicker({
            multiple: true,
            types: [{
                description: '字幕文件',
                accept: {
                    'text/plain': ['.srt', '.ass', '.ssa']
                }
            }]
        });

        for (const handle of fileHandles) {
            addSubtitle(handle);
        }

        if (fileHandles.length) {
            Toast.success(`已添加 ${fileHandles.length} 个字幕文件`);
        } else {
            Toast.error('没有选择任何字幕文件');
        }
    }, [addSubtitle]);

    const handleClear = useCallback(() => {
        setSubtitles([]);
        Toast.success('已清空字幕文件列表');
    }, [setSubtitles]);

    const handleDelete = useCallback((index: number) => {
        setSubtitles(prev => prev.filter((_, i) => i !== index));
    }, [setSubtitles]);

    const handleEpisodeChange = useCallback((index: number, newEpisode: string) => {
        const episodeNo = parseFloat(newEpisode);
        if (isNaN(episodeNo)) return;
        setSubtitles(prev => {
            const newSubtitles = [...prev];
            newSubtitles[index].updateEpisode(episodeNo);
            return newSubtitles;
        });
    }, [videos, setSubtitles]);

    const handleNameChange = useCallback((index: number, newName: string) => {
        setSubtitles(prev => {
            const newSubtitles = [...prev];
            newSubtitles[index].newBaseName = newName;
            return newSubtitles;
        });
    }, [setSubtitles]);

    const handleExtensionChange = useCallback((index: number, newExtension: string) => {
        setSubtitles(prev => {
            const oldExtension = prev[index].extensionName;
            const newSubtitles = [...prev];
            for (const subtitle of newSubtitles) {
                if (subtitle.extensionName === oldExtension) {
                    subtitle.extensionName = newExtension;
                }
            }
            newSubtitles[index].extensionName = newExtension;
            return newSubtitles;
        });
    }, [setSubtitles]);

    const handleAutoMatch = useCallback(() => {
        setSubtitles(prev => {
            const newSubtitles = [...prev];
            for (const subtitle of newSubtitles) {
                const matchingVideo = videos.find(v => v.episode === subtitle.episode);
                if (matchingVideo) {
                    subtitle.matchVideo(matchingVideo);
                }
            }
            Toast.success('已按视频文件重新命名字幕');
            return newSubtitles;
        });
    }, [videos, setSubtitles]);

    const sortSubtitles = useCallback(() => {
        setSubtitles(prev => sortByEpisode(prev));
    }, [setSubtitles]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        if (event.nativeEvent.dataTransfer?.items?.[0]?.kind !== 'file') return;
        event.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);

        const validExtensions = ['.srt', '.ass', '.ssa'];
        const items = Array.from(event.nativeEvent.dataTransfer?.items ?? []);

        for (const item of items) {
            if (item.kind !== 'file') continue;
            item.getAsFileSystemHandle().then(async fileHandle => {
                if (fileHandle?.kind === 'file') {
                    if (validExtensions.some(ext => fileHandle!.name.toLowerCase().endsWith(ext))) {
                        addSubtitle(fileHandle as FileSystemFileHandle);
                    } else {
                        Toast.error(`${fileHandle!.name} 不是合法的字幕文件`);
                    }
                } else if (fileHandle?.kind === 'directory') {
                    const fileHandles = await SubtitleFile.scanSubtitles(fileHandle as FileSystemDirectoryHandle)
                    for (const handle of fileHandles) {
                        addSubtitle(handle);
                    }
                    if (fileHandles.length) {
                        Toast.success(`已添加 ${fileHandles.length} 个字幕文件`);
                    } else {
                        Toast.error(`文件夹中没有找到字幕文件`);
                    }
                }
            });
        }
    }, [addSubtitle]);

    return (
        <div
            className="subtitle-manager"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {isDragOver && <div className="drag-over-overlay" />}
            <h3>字幕文件</h3>
            <div className="subtitle-manager-actions">
                <button onClick={handleSelectFiles}>添加</button>
                <button disabled={!subtitles.length} onClick={handleClear}>清空</button>
                <button disabled={!subtitles.length} onClick={handleAutoMatch}>自动匹配</button>
            </div>
            <div className="subtitle-file-list">
                {subtitles.map((subtitle, index) => (
                    <div key={subtitle.name} className='subtitle-file-item'>
                        <input className="subtitle-episode"
                            pattern="\d+\.?\d*"
                            value={subtitle.episode}
                            onBlur={sortSubtitles}
                            onChange={(e) => handleEpisodeChange(index, e.target.value)}
                        />
                        <div className="subtitle-new-name" title={subtitle.name}>
                            <input
                                value={subtitle.newBaseName}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                            />
                        </div>
                        <input
                            className="subtitle-extname"
                            value={subtitle.extensionName}
                            onChange={(e) => handleExtensionChange(index, e.target.value)}
                        />
                        <div className="subtitle-actions">
                            <button className="subtitle-delete" onClick={() => handleDelete(index)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 