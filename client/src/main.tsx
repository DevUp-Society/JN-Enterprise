import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

// Startup Diagnostics
window.onerror = (message, source, lineno, colno, error) => {
  console.error('FATAL_STARTUP_ERROR:', { message, source, lineno, colno, error });
};

window.onunhandledrejection = (event) => {
  console.error('UNHANDLED_PROMISE_REJECTION:', event.reason);
};

console.log('RE-MOUNTING_APP_STARTUP_OK');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
