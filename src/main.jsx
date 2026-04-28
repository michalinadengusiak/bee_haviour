// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Providers } from './app/Providers'
import { DashboardPage } from './pages/DashboardPage'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Providers>
      <DashboardPage />
    </Providers>
  </React.StrictMode>
)
