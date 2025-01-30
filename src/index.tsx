import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

if (!('showDirectoryPicker' in window)) {
    alert('当前浏览器不支持 File System Access API');
} else {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    const reactRoot = ReactDOM.createRoot(rootElement);

    reactRoot.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
