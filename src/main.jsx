import React from 'react'
import ReactDOM from 'react-dom/client' // <--- This import was likely missing
import App from './App.jsx'
import './index.css'

// async function enableMocking() {
//   if (process.env.NODE_ENV !== 'development') {
//     return
//   }
//   const { worker } = await import('./mocks/browser')
//   // `worker.start()` returns a Promise that resolves
//   // once the Service Worker is up and ready to intercept requests.
//   return worker.start()
// }

// enableMocking().then(() => {
//   ReactDOM.createRoot(document.getElementById('root')).render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>, anpanman123@#$
//   )
// })
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)