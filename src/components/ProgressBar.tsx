import { useProgress } from '../contexts/ProgressContext';
import './ProgressBar.css';

export function ProgressBar() {
    const { finished, total } = useProgress();

    if (!total || finished === total) return <div className="progress-bar-wrapper" />;

    return (
        <div className="progress-bar-wrapper visible">
            <div className="progress-bar-container">
                <div className="progress-bar-finished" style={{ flex: finished }} />
                <div className="progress-bar-unfinished" style={{ flex: total - finished }} />
            </div>
        </div>
    );
}