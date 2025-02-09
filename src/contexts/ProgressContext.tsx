import React, { createContext, useContext, useState } from 'react';

interface ProgressContextType {
    finished: number;
    setFinished: (finished: number) => void;

    total: number;
    setTotal: (total: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    const [finished, setFinished] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    return (
        <ProgressContext.Provider value={{ finished, setFinished, total, setTotal }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error('useProgress must be used within a ProgressContext');
    }
    return context;
}