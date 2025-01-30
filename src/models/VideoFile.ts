import { sortByEpisode } from "../utils/sort";
import { MediaFile } from "./MediaFile";

export class VideoFile extends MediaFile {
    private static readonly VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];

    get nameWithoutExtension() {
        return this.name.replace(/\.[^.]+$/, '');
    }

    static async loadVideos(folder: FileSystemDirectoryHandle): Promise<VideoFile[]> {
        const videos: VideoFile[] = [];

        async function searchDirectory(handle: FileSystemDirectoryHandle) {
            for await (const [name, entry] of handle.entries()) {
                if (entry instanceof FileSystemFileHandle) {
                    if (VideoFile.VIDEO_EXTENSIONS.some(ext => name.endsWith(ext))) {
                        videos.push(new VideoFile(entry));
                    }
                } else if (entry.kind === 'directory') {
                    await searchDirectory(entry as FileSystemDirectoryHandle);
                }
            }
        }

        await searchDirectory(folder);

        return sortByEpisode(videos);
    }
}
