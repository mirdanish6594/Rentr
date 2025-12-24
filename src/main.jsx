import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

async function enableMocking() {
  // Import the worker
  const { worker } = await import('./mocks/browser')

  // Start the worker and log success/failure
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  }).catch(err => {
    console.error("MSW Failed to start:", err);
  });
}

// Initialize
enableMocking().then(() => {
  console.log("Mocking Enabled. Rendering App...");
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
