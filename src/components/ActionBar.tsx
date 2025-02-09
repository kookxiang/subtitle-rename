import { useCallback } from 'react';
import { useDirectory } from '../contexts/DirectoryContext';
import { useSubtitle } from '../contexts/SubtitleContext';
import './ActionBar.css';
import { Toast } from './Toast';
import { useVideo } from '../contexts/VideoContext';

export function ActionBar() {
    const { folder, setFolder } = useDirectory();
    const { setVideos } = useVideo();
    const { subtitles, setSubtitles } = useSubtitle();

    const handleCopy = useCallback(async () => {
        const permission = await folder!.requestPermission({ mode: 'readwrite' });
        if (permission !== 'granted') {
            Toast.error('目录读写权限被拒绝');
            return;
        }

        for (const subtitle of subtitles) {
            const newFileName = [subtitle.newBaseName, subtitle.extensionName.replace(/^\./, '')].join('.');
            const newFileHandle = await folder!.getFileHandle(newFileName, { create: true });
            const outputStream = await newFileHandle.createWritable();
            await outputStream.write(await subtitle.file.getFile());
            await outputStream.close();
        }
        Toast.success('复制成功');

        setFolder(null);
        setVideos([]);
        setSubtitles([]);
    }, [folder, subtitles]);

    if (!folder || !subtitles.length) return null;

    return (
        <div className="action-bar">
            <button onClick={handleCopy} className="copy-button">
                复制字幕到视频目录
            </button>
        </div>
    );
} 