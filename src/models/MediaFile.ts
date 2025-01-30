export abstract class MediaFile {
    public readonly file: FileSystemFileHandle;
    public readonly name: string;
    public extensionName: string;
    public episode?: number;

    constructor(file: FileSystemFileHandle) {
        this.file = file;
        this.name = file.name;
        this.extensionName = file.name.match(/\.[^.]+$/)?.[0] ?? '';
        this.episode = this.ParseEpisode(this.name);
    }

    ParseEpisode(fileName: string): number | undefined {
        const nameWithoutExt = fileName.replace(/\.[^.]+$/, '');
        const patterns = [
            /\[([\d\.]{2,})\]/,
            /- ?([\d\.]{2,})/,
            /EP?([\d\.]{2,})/i,
            /\[([\d\.]{2,})/i,
            /#([\d\.]{2,})/i,
            /(\d{2,})/i,
            /\[([\d\.]+)\]/i,
        ];

        for (const pattern of patterns) {
            const match = nameWithoutExt.match(pattern);
            if (match) {
                return parseFloat(match[1]);
            }
        }

        return undefined;
    }
}
