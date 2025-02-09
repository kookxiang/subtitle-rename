import { ActionBar } from './components/ActionBar';
import { ProgressBar } from './components/ProgressBar';
import { SubtitleManager } from './components/SubtitleManager';
import { VideoManager } from './components/VideoManager';
import { DirectoryProvider } from './contexts/DirectoryContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { SubtitleProvider } from './contexts/SubtitleContext';
import { VideoProvider } from './contexts/VideoContext';
import './App.css';

export function App() {
    return (
        <ProgressProvider>
            <DirectoryProvider>
                <VideoProvider>
                    <SubtitleProvider>
                        <div className="root-container">
                            <VideoManager />
                            <SubtitleManager />
                            <ActionBar />
                            <ProgressBar />
                        </div>
                    </SubtitleProvider>
                </VideoProvider>
            </DirectoryProvider>
        </ProgressProvider>
    );
}
