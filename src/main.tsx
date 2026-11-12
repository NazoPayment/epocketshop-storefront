import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import './styles.css';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
// Imported eagerly so the one-time install prompt event is captured at startup.
import './hooks/useInstallPrompt';

// The service worker only runs in production builds, so it never caches dev-server files.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
