import { SubtitleManager } from './components/SubtitleManager';
import { VideoManager } from './components/VideoManager';
import { DirectoryProvider } from './contexts/DirectoryContext';
import { SubtitleProvider } from './contexts/SubtitleContext';
import { VideoProvider } from './contexts/VideoContext';
import { ActionBar } from './components/ActionBar';
import './App.css';

export function App() {
    return (
        <DirectoryProvider>
            <VideoProvider>
                <SubtitleProvider>
                    <div className="root-container">
                        <VideoManager />
                        <SubtitleManager />
                        <ActionBar />
                    </div>
                </SubtitleProvider>
            </VideoProvider>
        </DirectoryProvider>
    );
}
