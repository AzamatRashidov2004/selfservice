import { createRoot } from 'react-dom/client'
import './index.css'
import {loadConfig} from "./utility/config.ts";

async function bootstrap() {
    await loadConfig();
    const { default: App } = await import('./App')
    createRoot(document.getElementById('root')!).render(<App />);
}

bootstrap();


