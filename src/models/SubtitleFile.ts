import { sortByEpisode } from "../utils/sort";
import { MediaFile } from "./MediaFile";
import type { VideoFile } from "./VideoFile";

export class SubtitleFile extends MediaFile {
    private static readonly SUBTITLE_EXTENSIONS = ['.srt', '.ass', '.ssa'];
    
    public newBaseName: string;

    constructor(file: FileSystemFileHandle) {
        super(file);
        const extensionMatch = file.name.match(/(?:\.(?:zh|sc|tc)[a-z-_]*)?\.[^.]+$/i);
        this.extensionName = extensionMatch?.[0] ?? '';
        this.newBaseName = this.name.substring(0, this.name.length - this.extensionName.length);
    }

    updateEpisode(episode: number) {
        this.episode = episode;
    }

    matchVideo(video: VideoFile) {
        this.newBaseName = video.nameWithoutExtension;
    }

    static async scanSubtitles(folder: FileSystemDirectoryHandle): Promise<FileSystemFileHandle[]> {
        const fileHandles: FileSystemFileHandle[] = [];

        async function searchDirectory(handle: FileSystemDirectoryHandle) {
            for await (const [name, entry] of handle.entries()) {
                if (entry instanceof FileSystemFileHandle) {
                    if (SubtitleFile.SUBTITLE_EXTENSIONS.some(ext => name.endsWith(ext))) {
                        fileHandles.push(entry);
                    }
                } else if (entry.kind === 'directory') {
                    await searchDirectory(entry as FileSystemDirectoryHandle);
                }
            }
        }

        await searchDirectory(folder);

        return fileHandles;
    }
}