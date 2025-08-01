import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
