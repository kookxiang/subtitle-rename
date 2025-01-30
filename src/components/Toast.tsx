import { useEffect, useState } from 'react';
import './Toast.css';
import { createRoot } from 'react-dom/client';

export type ToastType = 'success' | 'error';

const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 1);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // 等待淡出动画完成后再移除
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast ${type} ${isVisible ? 'visible' : ''}`}>
            {message}
        </div>
    );
}

Toast.show = (type: ToastType, message: string, duration = 3000) => {
    if (!toastContainer.parentElement) {
        document.body.appendChild(toastContainer);
    }

    const mountNode = document.createElement('div');
    mountNode.className = 'toast-instance';
    toastContainer.appendChild(mountNode);

    const newRoot = createRoot(mountNode);
    newRoot.render((
        <Toast
            type={type}
            message={message}
            duration={duration}
            onClose={() => {
                newRoot.unmount();
                toastContainer.removeChild(mountNode);

                if (toastContainer.children.length === 0) {
                    document.body.removeChild(toastContainer);
                }
            }}
        />
    ));
}

Toast.success = (message: string, duration = 3000) => {
    Toast.show('success', message, duration);
}

Toast.error = (message: string, duration = 3000) => {
    Toast.show('error', message, duration);
}
