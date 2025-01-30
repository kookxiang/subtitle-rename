export function sortByEpisode<T extends { episode?: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => {
        // 如果两个都没有 episode，保持原顺序
        if (!a.episode && !b.episode) return 0;
        // 没有 episode 的排在后面
        if (!a.episode) return 1;
        if (!b.episode) return -1;
        // 按 episode 升序排列
        return a.episode - b.episode;
    });
} 