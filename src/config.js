// src/config.js

// If we are on localhost, use the local backend.
// If we are on Vercel (production), use the Render backend.
const API_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://rentr-api.onrender.com"; // <--- MAKE SURE THIS MATCHES YOUR RENDER URL EXACTLY

export default API_URL;