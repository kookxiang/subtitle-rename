import { useCallback, useState } from 'react';
import { useDirectory } from '../contexts/DirectoryContext';
import { useVideo } from '../contexts/VideoContext';
import { VideoFile } from '../models/VideoFile';
import { sortByEpisode } from '../utils/sort';
import { Toast } from './Toast';
import './VideoManager.css';

export function VideoManager() {
    const [isDragOver, setIsDragOver] = useState(false);
    const { setFolder } = useDirectory();
    const { videos, setVideos } = useVideo();

    const setFolderHandle = useCallback((folder: FileSystemDirectoryHandle) => {
        setFolder(folder);
        setVideos([]);
        VideoFile.loadVideos(folder).then(videos => {
            setVideos(videos);
            Toast.success(`已添加 ${videos.length} 个视频文件`);
        }).catch(e => {
            Toast.error(`视频文件加载失败: ${e}`);
        });
    }, [setFolder, setVideos]);

    const handleSelectFolder = useCallback(() => {
        if (!('showDirectoryPicker' in window)) {
            Toast.error('当前浏览器不支持 File System Access API');
            return;
        }

        window.showDirectoryPicker().then(setFolderHandle);
    }, [setFolderHandle]);

    const handleEpisodeChange = useCallback((index: number, value: string) => {
        const episodeNo = parseFloat(value);
        if (isNaN(episodeNo)) return;
        const newVideos = [...videos];
        newVideos[index].episode = episodeNo;
        setVideos(newVideos);
    }, [videos, setVideos]);

    const sortVideo = useCallback(() => {
        setVideos(sortByEpisode(videos));
    }, [videos, setVideos]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        if (event.nativeEvent.dataTransfer?.items?.length !== 1) return;
        if (event.nativeEvent.dataTransfer?.items?.[0]?.kind !== 'file') return;
        if (!DataTransferItem.prototype.getAsFileSystemHandle) return;
        event.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);

        const item = event.nativeEvent.dataTransfer?.items?.[0];
        if (item?.kind !== 'file') {
            Toast.error('仅支持拖放单个文件夹');
            return;
        }
        item.getAsFileSystemHandle().then(handle => {
            if (handle?.kind !== 'directory') {
                Toast.error('仅支持拖放单个文件夹');
                return;
            }
            setFolderHandle(handle as FileSystemDirectoryHandle);
        });
    }, [setFolderHandle]);

    return (
        <div className="video-manager"
             onDrop={handleDrop}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}>
            <h3>视频文件</h3>
            <div className="video-manager-actions">
                <button onClick={handleSelectFolder}>选择文件夹</button>
            </div>
            <div className="video-file-list">
                {isDragOver && <div className="drag-over-overlay" />}
                {videos.map((video, index) => (
                    <div key={video.name} className="video-file-item" title={video.name}>
                        <input className="video-episode"
                               pattern="\d+\.?\d*"
                               value={video.episode}
                               onBlur={sortVideo}
                               onChange={(e) => handleEpisodeChange(index, e.target.value)}
                        />
                        <div className="video-name">
                            {video.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}