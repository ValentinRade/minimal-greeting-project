
import { createRoot } from 'react-dom/client';
// Import i18n before any component renders
import './i18n';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(<App />);
